import React,{useEffect,useState,useRef,useCallback} from 'react'
import io from 'socket.io-client'
import './room.css'
import {useParams} from 'react-router-dom'
import { useHistory} from 'react-router-dom'
import ButtonControl from './buttonControl'
import { joinRoomAPI,fetchRoomAPI } from './api'
import RemoteStreamVideo from './remotevideo'
import ShareMeet from './share-meet'
import SignIn from './sign_in'
import axios from 'axios'
import Chat from './chat'
import SignUp from './sign_up'
export default function Room(props) {

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
    const [second,setSecond] = useState(0)
    const [isshare,setIsShare] = useState(false);
    const [timer,setTimer] = useState("")
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

    // useEffect to set peerInstance and setCUrrentUSerId
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
              socket.current=io.connect('https://ms-teams-backend-hk.herokuapp.com')
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

    useEffect(() => {

       // console.log('useeffect for answer the call')
        if(!peerInstance.current) {
            return;
        }        
        const incomingCallListener = async(incomingCall) => {
        
          if(!currentMediaStream.current) {
         
            return;
          }
          
         
          console.log('going to answer incomming call')
           incomingCall.answer(currentMediaStream.current)

          incomingCall.on('stream',function(remoteStream) {

            if(remoteStream.getTracks()[0].kind==='audio')
            {
              const temp = {
                roomId:roomId,
                peerId:incomingCall.peer
              }
            
             //https://ms-teams-backend-hk.herokuapp.com/name
                axios.post('https://ms-teams-backend-hk.herokuapp.com/name',(temp))
                .then((res)=>{
                  console.log(res);  
              const newParticipant={
                id: incomingCall.peer,
                mediaStream: remoteStream,
                 name:res.data
              }
              setParticipants(participants.concat(newParticipant));
                })
                .catch((err)=>{
                  console.log(err);
                })

              if(sharer)
              {
               // console.log("yes i haved shared the screen ");
              }
              
              //console.log("answer useffect completed",participants)
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

/////////////////////////////////screen sharing////////////////////////////////////////////////

    //console.log("last me current user id check")

    const callForScreenShare = useCallback((stream,userId)=>{
   
      peerInstance.current.call(userId,stream)
           
    })
    
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
   
   useEffect(()=>{
       if(sharer)
       {
         callForScreenShare(myScreenMedia.current,participants[participants.length-1].id)
       }
   },[participants])

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
        console.log("stream",stream);
          setSharer(true);                  //shaerer is for bottom button toggle and identify who share screen
         setIsShare(true);                  //this is for screen share div or window 
          screen.current.srcObject=stream;
          screen.current.play(); 
        
        participants.map((participant)=>callForScreenShare(stream,participant.id))

       })
     }
     socket.current?.off("id-of-person-sharing-screen").on("id-of-person-sharing-screen",(id)=>{ 
     })
      
  
    

   
   useEffect(()=>{
     let interval = setInterval(() => {
        setSecond(second + 1);
        let sec = second%60
        let min = Math.floor(second/60)
        let hr = Math.floor(second/3600)
        if(sec<10)
        {
          sec='0'+sec
        }
        if(hr<10)
        {
          hr='0'+hr
        }
        if(min<10)
        {
          min='0'+min
        }
        setTimer(hr+':'+min+':'+sec)
      }, 1000);
      return () => clearInterval(interval);
    })

   useEffect(()=>{
     console.log("hand raise ko nul karne wala useEffect")
     if(handRaiseName)
     {
       setTimeout(()=>{
        setHandRaiseName(null)
       },3000)
     
     }
     
   },[handRaiseName])

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

    const copyLink = ()=>{
      var x = document.getElementById("url_input");
      x.select();
      x.setSelectionRange(0,99999);
      document.execCommand("copy");
      alert("copied url")
    }

    return (
      <div>
         {
           token
           ?
           <div classname="room-2-parts" style={{overflow:"none"}}>
           <div>
             <div className="room-container-1">
               <div className="room-navbar">
                 <spa>{timer}</spa>
              <input type="text"  value={window.location.href} id="url_input"  ></input>
               <button className="copy-link" onClick={()=>{copyLink()}}>Copy Link</button>
               <button className="share-via-mail" onClick={()=>{setShareMail(!sharemail)}}>Share Via Mail</button>

               <div className="dropdown">
                <button className="dropdownbtn">participants <i class="fas fa-hand-paper"></i></button>
                <div className="dropdown-content" id="dropdown-content">
                </div>
               </div>
               <span id="hand-raise-navbar" style={handRaiseName?{visibility:"visible"}:{visibility:"hidden"}}>{handRaiseName} Raised Hand</span>
               <span className="username-navbar">@{name}</span>
               </div>
       
       <div className={showchat?"room-show-chat":"room-hide-chat"}>
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
                <div className="room-video-outer">
                 
                  <div className="column-one">
           <video ref={currentUserVideoRef} muted/>
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
           <video ref={currentUserVideoRef} muted/>
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
   
     history.push('/')
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