import React,{useEffect,useState,useRef,useCallback,useLayoutEffect} from 'react'
import io from 'socket.io-client'
import './room.css'
import {useParams} from 'react-router-dom'
import { useHistory} from 'react-router-dom'
import ButtonControl from '../lower-button-control/buttonControl'
import { joinRoomAPI,fetchRoomAPI } from '../apis/api'
import RemoteStreamVideo from '../remotevideo'
import ShareMeet from '../share-meet/share-meet'
import SignIn from './sign_in'
import axios from 'axios'
import Chat from '../room-chat/chat'
import SignUp from './sign_up'
import Timer from '../timer'
import {browserHistory} from 'react-router'
export default function Room(props){

    const socket = useRef(null);
    const [record,setRecord] = useState(false);
    const [dis,setDis] = useState(true)
    const history = useHistory();
    const screen = useRef(null);
    const [handRaiseName,setHandRaiseName] = useState('')
    const [people,setPeople] = useState(false)
    const [login,setLogin] = useState(true);
    const [handRaiseEntry,setHandRaiseEntry] = useState(null)
    const [handDownEntry,setHandDownEntry] = useState(null)
    const [handRaise,setHandRaise] = useState(false)
    const [isshare,setIsShare] = useState(false);
    const [sharemail,setShareMail] = useState(false)
    const {roomId}=useParams()
    const [muted,setMuted] = useState(false)
    const [videoMuted,setVideoMuted] = useState(false)
    const [currentUserId,setCurrentUser]=useState('')
    const currentMediaStream=useRef(null)
    const currentUserVideoRef=useRef(null)
    const [participants,setParticipants]=useState([])  
    const peerInstance=useRef(null)
    const [token,setToken] = useState()
    const [sharer,setSharer] = useState(false)
    const [name,setName] = useState('')
    const [showchat,setShowChat] = useState(false)
    const [messname,setMessName] = useState('');
    const [mess,setMess] = useState('')
    const myScreenMedia = useRef(null)


   useEffect(()=> {
  // Your code here.
  return()=>{
    console.log("hook he kam aege")
        const videoTracks = currentMediaStream.current.getVideoTracks()
                              videoTracks[0].stop() 
                              socket.current?.disconnect()
                              history.push('/feedback')
   
  }
  
}, [])

    // useEffect to set peerInstance and setCUrrentUSerId
    useEffect(()=>{
      console.log(sessionStorage.getItem('name'))
      if(sessionStorage.getItem('name'))
      {
        setName(sessionStorage.getItem('name'))
        setToken("user loged in before")
      }
    },[])
    useEffect(() => {
        peerInstance.current=props.peerInstance
        setCurrentUser(props.currentUserId)
    },[props.peerInstance,props.currentUserId])

    //useEffect to call SetCUrrentUSerVideo and make Socket connection with server
    useEffect(() => {
      if(token)
      {
          setCurrentUserVideo();
          if(currentUserId)
          {
              //https://ms-teams-backend-hk.herokuapp.com
              socket.current=io.connect('https://ms-team-backend-hk.herokuapp.com/')
              socket.current.on('get:peerId',()=>{
              socket.current.emit('send:peerId',currentUserId)
             })
          }
      }
    },[currentUserId,token])

    
    //useEffect for useLeft the Meeting 
    useEffect(() => {
          const userLeftListner=(peerId)=>{
          const filteredParticipants=participants.filter(
                participant=>participant.id!==peerId)
                setParticipants(filteredParticipants)
          }
                 socket.current?.on('user:left',userLeftListner)
                  return()=>{
                      socket.current?.off('user:left',userLeftListner)
                  }
    },[participants])

     //useEffect for video on/off
      useEffect(()=>{
            if(!currentMediaStream.current)
            {
              return;
            }
            const videoTracks = currentMediaStream.current.getVideoTracks();
            if(videoTracks[0])
            {
              videoTracks[0].enabled = !videoMuted
            }
      },[videoMuted])
    
      //useEffect for Audio on/off
      useEffect(()=>{
        if(!currentMediaStream.current)
        {
          return;
        }
        const audioTracks  = currentMediaStream.current.getAudioTracks();
        if(audioTracks[0])
        {
          audioTracks[0].enabled = !muted
        }
      },[muted])
    
      //useCallback for setting currentUser Media Stream
      const setCurrentUserVideo=useCallback(async()=>{
      console.log("usecallback setCurrentUserVideo")
        if(!currentUserVideoRef.current)
        {
            return;
        }
        if(!currentUserId)
        {
            return;
        }
        try
        {
                const mediaStream = await navigator.getUserMedia({video:true,audio:true},async(mediaStream)=>{
                currentUserVideoRef.current.srcObject=mediaStream
                currentUserVideoRef.current.play();
                currentMediaStream.current=mediaStream
          const data={
            id:currentUserId,
            name:name
          }
                await joinRoomAPI(roomId,data)
                await callingToAll(roomId)
            })
        }
        catch(error)
        {
            console.log(error)
        }
    },[roomId,currentUserId,token])

    //callback function for calling every particpant in the room and sending your current stream
    const calling=useCallback((participant)=>{
        if(!currentMediaStream.current)
        {
            return;
        }
        
        const outgoingCall=peerInstance.current.call(participant.id,currentMediaStream.current)
        
           return new Promise((resolve)=>{
             const streamListener = (remoteStream)=>{
               const newParticipant = {
                 id:participant.id,
                 mediaStream:remoteStream,
                 name:participant.name
               }
               outgoingCall.off('stream',streamListener);
               resolve(newParticipant)
                
             }
             outgoingCall?.on('stream',streamListener);
           })

        },[participants]);

    //calling Every one in the room
    const callingToAll=useCallback(async(roomId)=>{
        try
        {
            const roomInformation=await fetchRoomAPI(roomId)
            const {participants}  = roomInformation;
            if(participants.length)
            {
         
                const participantCall=[]=roomInformation.participants.filter(
                    
                    (participant)=>participant.id!==currentUserId)
                    .map((participant)=>calling(participant))

                    Promise.all(participantCall)
                    .then((values=[])=>{
                      const validParticipants = values.filter(value => value)
                      setParticipants(validParticipants)
                    })
            }

        }
        catch(error)
        {
            console.log(error)
        }

    },[currentUserId,calling])

    //useEffect for answering the call 
    useEffect(() => {
        if(!peerInstance.current) {
            return;
        }        
        const incomingCallListener = async(incomingCall) => {
          if(!currentMediaStream.current){
            return;
          }
          incomingCall.answer(currentMediaStream.current)

          incomingCall.on('stream',function(remoteStream){
            if(remoteStream.getTracks()[0].kind==='audio')
            {
              const temp = {
                roomId:roomId,
                peerId:incomingCall.peer
              }
            
             //https://ms-teams-backend-hk.herokuapp.com/name
                axios.post('https://ms-team-backend-hk.herokuapp.com/name',(temp))
                .then((res)=>{

              const newParticipant={
                id: incomingCall.peer,
                mediaStream: remoteStream,
                 name:res.data
              }
              //updating the participants array
              setParticipants(participants.concat(newParticipant));
                })
                .catch((err)=>{
                  console.log(err);
                })

              if(sharer)
              {

              }
            }
            else{
              setIsShare(true);
              screen.current.srcObject = remoteStream;
              screen.current.play();          
            }
             });
        }
      
        peerInstance.current.on('call', incomingCallListener);
     return()=> peerInstance.current.off('call',incomingCallListener)
    },[peerInstance,participants])

     //share screen
    const callForScreenShare = useCallback((stream,userId)=>{
      peerInstance.current.call(userId,stream)   
    })
    
    //stop sharing screen
    const stopSharing=()=>{
         setSharer(false)
         setIsShare(false)
         socket.current.emit("user-stop-sharing",roomId)
    }

    socket.current?.off("stop-sharing").on("stop-sharing",(roomid)=>{
      if(roomid===roomId)
      {
        setIsShare(false)
      }
    })
   
    //useEffect to call everyone to send your screen stream to share your screen
   useEffect(()=>{
       if(sharer)
       {
         if(participants[participants.length-1])
         {
          callForScreenShare(myScreenMedia.current,participants[participants.length-1].id)
         }
         
       }
   },[participants])

   //screen share function runs when screen share button is clicked 
    function screenShare()
     {
       if(isshare===true)
       {
         alert("someone has shared screen")
         return ;
        }

         navigator.mediaDevices.getDisplayMedia().then(stream => {
         myScreenMedia.current = stream;
         socket.current.emit("user-screen-share-id",currentUserId);
      
         let videoTracks=stream.getVideoTracks()[0]
         videoTracks.onended=()=>{
           setIsShare(false)
           stopSharing();
         }
          setSharer(true);                  //shaerer is for bottom button toggle and identify who share screen
          setIsShare(true);                  //this is for screen share div or window 
          screen.current.srcObject=stream;
          screen.current.play(); 
        participants.map((participant)=>callForScreenShare(stream,participant.id))
       })
     }
     socket.current?.off("id-of-person-sharing-screen").on("id-of-person-sharing-screen",(id)=>{ 
     })
      
 
   //useEffect for raise hand notification
   useEffect(()=>{
      if(handRaiseName)
      {
        setTimeout(()=>{
          setHandRaiseName(null)
        },3000)
      }
     
    },[handRaiseName])

    //useEffect tto hand new people who raise hand
    useEffect(()=>{
      if(handRaiseEntry)
      {
        setHandRaiseName(handRaiseEntry);
      
        const outer = document.getElementById('dropdown-content')
        const temp = document.createElement('h6')
        temp.textContent=handRaiseEntry;
        temp.setAttribute('id',handRaiseEntry)
        const x = document.createElement('i')
        x.className = "fas fa-hand-paper"
        temp.append(x)
        temp.className="dropdown-h6"
        outer.appendChild(temp)
    
        setHandRaiseEntry(null);
      
      }
      if(handDownEntry)
      {
        const outer = document.getElementById('dropdown-content')
        const temp = document.getElementById(handDownEntry) 
        if(temp)
        {
          outer.removeChild(temp)
        }
        setHandDownEntry(null)
      }
    },[handRaiseEntry,handDownEntry])

   //useEffect for new message notification
   useEffect(()=>{
        var x  = document.getElementById("notification")
        if(x)
        {
          setTimeout(()=>{
            setDis(true)
            setMess('')
            setMessName('')
         },5000)
        }
        
   },[mess,messname])

  //function for copy link for current meeting
    const copyLink=()=>{
      var x = document.getElementById("url_input");
      x.select();
      x.setSelectionRange(0,99999);
      document.execCommand("copy");
      alert("copied url")
    }
   const video_1={
    height: "450px",
    width: "600px",
    boxShadow: "0 0 7px black",
    marginTop: "30px",
    borderRadius: "3%",
    marginLeft: "30px"
   }
   const video_more={
    height: "230px",
    width: "300px",
    boxShadow: "0 0 7px red",
    marginTop: "30px",
    borderRadius: "3%",
    marginLeft: "30px"
   }
   const video_3={
    height: "260px",
    width: "345px",
    boxShadow: "0 0 7px black",
    marginTop: "30px",
    borderRadius: "3%",
    marginLeft: "30px"
   }
   const video_2={
    height: "300px",
    width: "400px",
    boxShadow: "0 0 7px black",
    marginTop: "30px",
    borderRadius: "3%",
    marginLeft: "30px"
   }
    return(
       <div >
           { 
              token
              ?
                <div classname="room-2-parts" >
                    <div>
                      <div className="room-container-1" >
                          <div className="room-navbar">
                          <spa><Timer></Timer></spa>
                          <input type="text"  value={window.location.href} id="url_input"  ></input>
                          <button className="copy-link" onClick={()=>{copyLink()}}>Copy Link</button>
                          <button className="share-via-mail" onClick={()=>{setShareMail(!sharemail)}}>Share Via Mail</button>
                          <div className="dropdown">
                              <button className="dropdownbtn">participants <i class="fas fa-hand-paper"></i></button>
                              <div className="dropdown-content" id="dropdown-content"></div>
                          </div>
                          <span id="hand-raise-navbar" style={handRaiseName?{visibility:"visible"}:{visibility:"hidden"}}>{handRaiseName} Raised Hand</span>
                          <span className="username-navbar">@{name}</span>
                        </div>
                          <div className={showchat?"room-show-chat":"room-hide-chat"} >
                          {
                            isshare
                            ?
                            <div><video className="sharevideo" ref={screen}></video></div>
                            :
                            <div></div>
                          }
                            {sharemail?<ShareMeet setShareMail={setShareMail}></ShareMeet>:<span style={{display:"none"}}></span>}
                                {
                                    participants.length>0?
                                    <div className="room-video-outer" >
                                    
                                  <div className="column-one" >
                                    <video ref={currentUserVideoRef} style={participants.length<2?video_2:participants.length===2?video_3:video_more} muted/>
                                      <div>You</div>
                                  </div>
                                      {
                                      participants.map(
                                          participant=>(
                                              <RemoteStreamVideo key={participant.userId} remoteStream={participant.mediaStream} name={participant.name} len={participants.length}></RemoteStreamVideo>   
                                          )
                                      )
                                    }
                                    </div>
                                    :
                                  <div>
                                      <div className="column-1">
                                          <video ref={currentUserVideoRef} style={participants.length<1?video_1:video_1}   muted/>
                                          <div className="video-name">You</div>
                                       </div>
                                  </div>
                                }
                                <div id="notification" className="notification"  style={dis?{visibility:"hidden"}:{visibility:"visible"}}><i class="fas fa-sms"></i>     <span className="messname">{messname}</span><br></br><span>{mess}</span></div>
                          </div>
                     <div className={people?"people":"nopeople"}>
                      <div className="people-heading">Participants<span className="number">{participants.length}</span></div>
                      <div>
                        {
                          people && participants.length>0
                          ?
                          <ul className="people-ul">
                            {participants.map(participant=>(<li className="people-li"><i class="fas fa-user"></i><span>{participant.name}</span></li>))}
                          </ul>
                          :
                          <div className="room-empty">No one in the Room</div>
                        }
                       </div>
                       </div>
                       <div className="room-chat-box"><Chat className="bottom-chat" dis={dis} setDis={setDis} mess={mess} setMess={setMess} messname={messname} setMessName={setMessName}  showchat={showchat} setShowChat={()=>{setShowChat(false)}} currentUserId={props.currentUserId} name={name} socket={socket.current}></Chat></div>
                       </div>
                   </div>
                  
                      <div>
                        <ButtonControl 
                            onLeave={()=>{
                              const videoTracks = currentMediaStream.current.getVideoTracks()
                              videoTracks[0].stop() 
                              socket.current?.disconnect()
                              history.push('/feedback')
                            }}
                            toggleMute={()=>setMuted(!muted)}
                            toggleVideoMute={()=>setVideoMuted(!videoMuted)}
                            muted={muted}
                            videoMuted={videoMuted}
                            sharescreen={()=>screenShare()}
                            shared = {sharer}
                            stopSharing={()=>{stopSharing()}}
                            currentUserId={currentUserId}
                            socket={socket.current}
                            showchat={showchat}
                            setShowChat={()=>{setShowChat(true)}}
                            name={name}
                            roomId={roomId}
                            handRaise={handRaise}
                            setHandRaise={setHandRaise}
                            handRaiseEntry={handRaiseEntry}
                            handDownEntry={handDownEntry}
                            setHandRaiseEntry={setHandRaiseEntry}
                            setHandDownEntry={setHandDownEntry}
                            setHandRaiseName={setHandRaiseName}
                            record={record}
                            setRecord={setRecord}
                            setPeople={setPeople}
                            people={people}
                            len={participants.len}
                            > 
                        </ButtonControl>
                      </div>
                        
              </div>  
               :
               login?
              <SignIn token={token} setToken={setToken} setName={setName} login={login} setLogin={setLogin}></SignIn>
               :
              <SignUp login={login} setLogin={setLogin} token={token} setToken={setToken} setName={setName}></SignUp>
          }
       </div>  
    )
}
