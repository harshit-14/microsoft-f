import React,{useEffect,useState,useRef,useCallback} from 'react'
import io from 'socket.io-client'
import './room.css'
import {useParams} from 'react-router-dom'
import { useHistory} from 'react-router-dom'
import ButtonControl from './buttonControl'
import { joinRoomAPI,fetchRoomAPI } from './api'
import RemoteStreamVideo from './remotevideo'
import ShareMeet from './share-meet'
import Login from './login'
import axios from 'axios'
import Chat from './chat'
import Register from './register'
export default function Room(props) {

 // console.log('I am room.js')

 // console.log("participants",participants);
 
 const socketInstance = useRef(null);
    const history = useHistory();
    const screen = useRef(null);
    const [login,setLogin] = useState(true);
    const [handRaiseEntry,setHandRaiseEntry] = useState(null)
    const [handDownEntry,setHandDownEntry] = useState(null)
    const [handRaise,setHandRaise] = useState(false)
    const [second,setSecond] = useState(0)
    const [isshare,setIsShare] = useState(false);
    const [timer,setTimer] = useState("")
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
    //  console.log("participants",participants)
  //  console.log(currentUserId)

    useEffect(() => {
    //   console.log("1 useeffect --> set the values")
       //console.log("lets check before setting",props.currentUserId)
        peerInstance.current=props.peerInstance
       
        setCurrentUser(props.currentUserId)
        console.log("completed")
    },[props.peerInstance,props.currentUserId])

    useEffect(() => {
      //console.log("useEffect 2 calls setCurrentUserVideo callback function")
      if(token)
      {
        console.log("name of current user---------------------->",name);
        setCurrentUserVideo();
          if(currentUserId)
        {
          socketInstance.current=io.connect('https://ms-teams-backend-hk.herokuapp.com')
         // console.log(socketInstance.current)
         socketInstance.current.on('get:peerId',()=>{
           socketInstance.current.emit('send:peerId',currentUserId)
        //   console.log(currentUserId)
         //  console.log("get:peer---------------------------------->")
         
       })
        }
        
      }
        
   
    },[currentUserId,token])

    
      
    useEffect(() => {
    //  console.log("-----------useeffect 3 for userLeftListner")

        const userLeftListner=(peerId)=>{
            const filteredParticipants=participants.filter(
                participant=>participant.id!==peerId
            )
            setParticipants(filteredParticipants)
        }

        socketInstance.current?.on('user:left',userLeftListner)
        
        return()=>{
            socketInstance.current?.off('user:left',userLeftListner)
        }

    }, [participants])

      //useeffect of video and mute button

      useEffect(()=>{
      //  console.log("useeffect 4 for videoMuted");
        if(!currentMediaStream.current)
        {
          return;
        }
       // console.log("getvideootrack",currentMediaStream.current)
        const videoTracks  = currentMediaStream.current.getVideoTracks();
        // console.log("video track",videoTracks);
        if(videoTracks[0])
        {
          videoTracks[0].enabled = !videoMuted
        }
      },[videoMuted])
    
     
      useEffect(()=>{
       // console.log("useeffect 5 for audioMuted")
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
    

////////////////////////////////////////////////////////////////////////////
    const setCurrentUserVideo=useCallback(async()=>{
      console.log("usecallback setCurrentUserVideo")
        if(!currentUserVideoRef.current)
        {
       //   console.log("1")
            return;
        }
        if(!currentUserId)
        {
        //  console.log("2")
            return;
        }
        
        try
        {
         //  console.log('set current user vedio')
            const mediaStream = await navigator.getUserMedia({video:true,audio:true},async(mediaStream)=>{
                
                currentUserVideoRef.current.srcObject=mediaStream
                currentUserVideoRef.current.play();
                currentMediaStream.current=mediaStream
              // console.log("stream set")
          //    console.log("api call to joinroomapi started");
          const data={
            id:currentUserId,
            name:name
          }
                await joinRoomAPI(roomId,data)
            //   console.log("api call to joinroomAPI ended");
              //  console.log("room id",roomId);
             //  console.log("user id",currentUserId);
             // console.log('room joined..')
           //   console.log("callback 2  callEveryOneInTheRoom started");
                await callEveryoneInTheRoom(roomId)
            //  console.log("callback 2  clalEveryOneInTheRoom ended")
            })
        }
        catch(error)
        {
            console.log(error)
        }
    },[roomId,currentUserId,token])

   ////////////////////////call///////////////////////// 
    const call=useCallback((participant)=>{
          // console.log("function to call")
        if(!currentMediaStream.current)
        {
           // console.log('returning')
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
///////////////////////////call every one///////////////////////////////////////////////
    const callEveryoneInTheRoom=useCallback(async(roomId)=>{
     //    console.log("useCallback callEveryoneInTheRoom")
        try
        {
            const roomInformation=await fetchRoomAPI(roomId)
            const {participants}  = roomInformation;

          //  console.log('here are participants to call--',participants)
           // console.log("server participants",roomInformation.participants)
              
            if(participants.length)
            {
             //   console.log("calling everyone-- ",roomInformation.participants)
                const participantCall=[]=roomInformation.participants.filter(
                    
                    (participant)=>participant.id!==currentUserId)
                    .map((participant)=>call(participant))

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

    },[currentUserId,call])


 //console.log("answer se phele participants",participants)

///////////////////////////////////answer call////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {

       // console.log('useeffect for answer the call')
        if(!peerInstance.current) {
            return;
        }        
        const incomingCallListener = async(incomingCall) => {
        
          if(!currentMediaStream.current) {
         
            return;
          }
          
         
         // console.log('going to answer incomming call')
           incomingCall.answer(currentMediaStream.current)

          incomingCall.on('stream',function(remoteStream) {

            if(remoteStream.getTracks()[0].kind==='audio')
            {
              const temp = {
                roomId:roomId,
                peerId:incomingCall.peer
              }
             // console.log("post request------------------------->")
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
       //console.log("hk")
        peerInstance.current.on('call', incomingCallListener);
        //console.log("hk123")
      //  return () =>peerInstance.current.off('call', incomingCallListener)
     return()=> peerInstance.current.off('call',incomingCallListener)
    
    },[peerInstance,participants])

/////////////////////////////////screen sharing////////////////////////////////////////////////

    //console.log("last me current user id check")

    const callForScreenShare = useCallback((stream,userId)=>{
     // console.log("call for screen share functon chl gya")
      peerInstance.current.call(userId,stream)
           
    })
    
    const stopSharing=()=>{
         setSharer(false)
         setIsShare(false)
         socketInstance.current.emit("user-stop-sharing",roomId)
    }

    socketInstance.current?.off("stop-sharing").on("stop-sharing",(roomid)=>{
      if(roomid===roomId)
      {
        setIsShare(false)
      }
    })
  
   
    function screenShare()
     {
     //  console.log("------------------share------------------")
      // console.log(participants);
       
       navigator.mediaDevices.getDisplayMedia().then(stream => {
         socketInstance.current.emit("user-screen-share-id",currentUserId);
      
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
        //callForScreenShare();
        participants.map((participant)=>callForScreenShare(stream,participant.id))

       })
     }

    // console.log("id of person sharing screen se phele")
     socketInstance.current?.off("id-of-person-sharing-screen").on("id-of-person-sharing-screen",(id)=>{
       //console.log("i am sharing screen",id);
     })
        //console.log("sharere value------------------------------------>",sharer);     
   // console.log('room ka return')
    

   
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
       
      if(handRaiseEntry)
      {
        console.log("-------------raise------------->>>>>>>>>>>>",handRaiseEntry)
        const outer = document.getElementById('dropdown-content')
        const temp = document.createElement('h6')
        temp.textContent=handRaiseEntry;
        temp.setAttribute('id',handRaiseEntry)
        const x = document.createElement('i')
        x.className = "fas fa-hand-paper"
        temp.append(x)
        temp.className="dropdown-h6"
        outer.appendChild(temp)
        setHandRaiseEntry(null)
      }
      if(handDownEntry)
      {
        console.log("-----------------down--------->>>>>>>>>>>>",handDownEntry)
        const outer = document.getElementById('dropdown-content')
        const temp = document.getElementById(handDownEntry) 
        outer.removeChild(temp)
        setHandDownEntry(null)
      }


    },[handRaiseEntry,handDownEntry])

    return (
      <div>
         {
           token
           ?
           <div classname="room-2-parts">
           <div>
             <div className="room-container-1">
               <div className="room-navbar">
                 <spa>{timer
               }</spa>
               <span>@{name}</span>
               <h className="dropdown">
                <button className="dropdownbtn">participants <i class="fas fa-hand-paper"></i></button>
                <div className="dropdown-content" id="dropdown-content">
                </div>
               </h>
               </div>

       <div className={showchat?"room-show-chat":"room-hide-chat"}>
       {
         isshare
         ?
         <div ><video className="sharevideo" ref={screen}></video></div>
         :
         <div style={{display:"none", width:0, height:0}}></div>
       }
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
                           <RemoteStreamVideo key={participant.userId} remoteStream={participant.mediaStream} name={participant.name}></RemoteStreamVideo>   
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
       </div>
         <div className="room-chat-box"><Chat className="bottom-chat" showchat={showchat} setShowChat={()=>{setShowChat(false)}} currentUserId={props.currentUserId} name={name} socket={socketInstance.current}></Chat></div>
     </div>
    
   </div>
   <div>
   <ButtonControl 
   onLeave={()=>{
    const videoTracks = currentMediaStream.current.getVideoTracks()
    videoTracks[0].stop() 
    socketInstance.current?.disconnect(roomId)
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
   socket={socketInstance.current}
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
   > 
   </ButtonControl>
   </div>
   </div>  
           :
           login?
          <Login token={token} setToken={setToken} setName={setName} login={login} setLogin={setLogin}></Login>
          :
          <Register login={login} setLogin={setLogin} token={token} setToken={setToken} setName={setName}></Register>
         }
      </div>  
    )
}