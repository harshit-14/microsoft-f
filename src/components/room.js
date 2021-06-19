import React,{useEffect,useState,useRef,useCallback} from 'react'
import io from 'socket.io-client'
import './room.css'
import {useParams} from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import ButtonControl from './buttonControl'
import { joinRoomAPI,fetchRoomAPI } from './api'
import RemoteStreamVideo from './remotevideo'
import Chat from './chat'

export default function Room(props) {

  console.log('I am room.js')

 // console.log("participants",participants);
   const socketInstance = useRef(null);
    const history = useHistory();
    const screen = useRef(null);
    const [isshare,setIsShare] = useState(false);
    const [otherScreen,setOtherScreen] = useState(null)
    const {roomId}=useParams()
    const [muted,setMuted] = useState(false)
    const [videoMuted,setVideoMuted] = useState(false)
    const [currentUserId,setCurrentUser]=useState()
    const currentMediaStream=useRef(null)
    const currentUserVideoRef=useRef(null)
    const [participants,setParticipants]=useState([])  
    const peerInstance=useRef(null)
    
    
      console.log("participants",participants)
    console.log(currentUserId)
    useEffect( () => {
       console.log("1 useeffect --> set the values")
       console.log("lets check before setting",props.currentUserId)
        peerInstance.current=props.peerInstance
       
        setCurrentUser(props.currentUserId,()=>{
          console.log("first useffect",currentUserId)
        })
        console.log("completed")
    },[props.peerInstance,props.currentUserId])
  
  
     

    useEffect(() => {
      console.log("useEffect 2 calls setCurrentUserVideo callback function")
        setCurrentUserVideo();
        if(currentUserId)
        {
          socketInstance.current=io.connect('http://localhost:5000')
          console.log(socketInstance.current)
         socketInstance.current.on('get:peerId',()=>{
           socketInstance.current.emit('send:peerId',currentUserId)
           console.log(currentUserId)
           console.log("get:peer---------------------------------->")
       })
         
        }
   
    },[currentUserId])

    
      
    useEffect(() => {
      console.log("useeffect 3 for userLeftListner")

        const userLeftListner=(peerId)=>{
            const filteredParticipants=participants.filter(
                participant=>participant.userId!==peerId
            )
            setParticipants(filteredParticipants)
        }

        socketInstance.current?.on('user:left',userLeftListner)
        
        return()=>{
            socketInstance.current.off('user:left',userLeftListner)
        }

    }, [participants])

      //useeffect of video and mute button

      useEffect(()=>{
        console.log("useeffect 4 for videoMuted");
        if(!currentMediaStream.current)
        {
          return;
        }
        console.log("getvideootrack",currentMediaStream.current)
        const videoTracks  = currentMediaStream.current.getVideoTracks();
         console.log("video track",videoTracks);
        if(videoTracks[0])
        {
          videoTracks[0].enabled = !videoMuted
        }
      },[videoMuted])
    
     
      useEffect(()=>{
        console.log("useeffect 5 for audioMuted")
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
          console.log("1")
            return;
        }
        if(!currentUserId)
        {
          console.log("2")
            return;
        }
        try
        {
           console.log('set current user vedio')
            const mediaStream = await navigator.getUserMedia({video:true,audio:true},async(mediaStream)=>{
                
                currentUserVideoRef.current.srcObject=mediaStream
                currentUserVideoRef.current.play();
                currentMediaStream.current=mediaStream
              // console.log("stream set")
              console.log("api call to joinroomapi started");
                await joinRoomAPI(roomId,currentUserId)
               console.log("api call to joinroomAPI ended");
              //  console.log("room id",roomId);
             //  console.log("user id",currentUserId);
             // console.log('room joined..')
              console.log("callback 2  callEveryOneInTheRoom started");
                await callEveryoneInTheRoom(roomId)
              console.log("callback 2  clalEveryOneInTheRoom ended")
            })
        }
        catch(error)
        {
            console.log(error)
        }
    },[roomId,currentUserId])

   ////////////////////////call///////////////////////// 
    const call=useCallback((userId)=>{
           console.log("function to call")
        if(!currentMediaStream.current)
        {
            console.log('returning')
            return;
        }
        
        const outgoingCall=peerInstance.current.call(userId,currentMediaStream.current)
        
           return new Promise((resolve)=>{
             const streamListener = (remoteStream)=>{
               const newParticipant = {
                 userId,
                 mediaStream:remoteStream
               }
               outgoingCall.off('stream',streamListener);
               resolve(newParticipant)
                
             }
             outgoingCall.on('stream',streamListener);
           })

        },[participants]);
///////////////////////////call every one///////////////////////////////////////////////
    const callEveryoneInTheRoom=useCallback(async(roomId)=>{
         console.log("useCallback callEveryoneInTheRoom")
        try
        {
            const roomInformation=await fetchRoomAPI(roomId)
            const {participants}  = roomInformation;

            console.log('here are participants to call--',participants)
            console.log("server participants",roomInformation.participants)
              
            if(participants.length)
            {
                console.log("calling everyone-- ",roomInformation.participants)
                const participantCall=[]=roomInformation.participants.filter(
                    
                    (participant)=>participant!==currentUserId)
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
            console.log('oooppsss error')
            console.log(error)
        }

    },[currentUserId,call])


  console.log("answer se phele participants",participants)

///////////////////////////////////answer call////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {

        console.log('useeffect for answer the call')
        if(!peerInstance.current) {
            return;
        }        
        const incomingCallListener = async(incomingCall) => {
        
          if (!currentMediaStream.current) {
         
            return;
          }
          
         
          console.log('going to answer incomming call')
           incomingCall.answer(currentMediaStream.current)
          
        
          
           
          incomingCall.on('stream',function(remoteStream) {
            if(remoteStream.getTracks()[0].kind==='audio')
            {
              const newParticipant={
                userId: incomingCall.peer,
                mediaStream: remoteStream
              }
              setParticipants(participants.concat(newParticipant));
              console.log("answer useffect completed",participants)
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
   /*
useEffect(()=>{
     console.log("screenshare incoming useeffect")
     if(!peerInstance.current)
     {
       return;
     }
     const incomingCall = async(incomingScreen)=>{
       incomingScreen.on('stream',(stream)=>{
         console.log("screen share receive")
         setOtherScreen(stream);
       })
     } 
   },[peerInstance])
    */
    console.log("last me current user id check")


    const callForScreenShare = useCallback((stream,userId)=>{
      console.log("call for screen share functon chl gya")
    
     // console.log(stream.data)
      peerInstance.current.call(userId,stream)
           
    })

    function screenShare()
     {
       console.log("------------------share------------------")
       console.log(participants);
       
       navigator.mediaDevices.getDisplayMedia().then(stream => {
        console.log("stream",stream);

         setIsShare(true); 
          screen.current.srcObject=stream;
          screen.current.play(); 
        //callForScreenShare();
       
        participants.map((participant)=>callForScreenShare(stream,participant.userId))

       })
     }


    console.log('room ka return')

    return (
        <div>
            <div className="Room">
            <p className="id">
        </p>
        <div>
        {
            otherScreen===null
            ?
            <div>my name is harshit</div>
            :
            <div>video a jaegi yhan pe</div>

        }
        </div>
      <div className="room-container">
      
        <div className="columns">
        {
          isshare
          ?
          <div><video ref={screen}></video></div>
          :
          <div></div>
        }
             {
                 participants.length>0?
                 <div className="videogrid">
                   <div className="column">
            <video ref={currentUserVideoRef} muted/>
                </div>
                   {
                    participants.map(
                        participant=>(
                            <RemoteStreamVideo key={participant.userId} remoteStream={participant.mediaStream}></RemoteStreamVideo>   
                        )
                    )
                 }</div>
                 :
                <div>
                  <div className="column">
            <video ref={currentUserVideoRef} muted/>
          </div>
                </div>
                
             }
        </div>
        <div>
          <Chat socket={socketInstance.current} currentUserId={currentUserId}></Chat>
        </div>
       
      </div>
     
    </div>
    <ButtonControl 
    onLeave={()=>{socketInstance.current?.disconnect()
      history.push('/')
    }}
    toggleMute={()=>setMuted(!muted)}
    toggleVideoMute={()=>setVideoMuted(!videoMuted)}
    muted={muted}
    videoMuted={videoMuted}
    > 
    <div>fwfwfwfw</div>
    </ButtonControl>
    <button onClick={screenShare}>share screen</button>
    <p>Lfvwvwvwvwvvfv</p>
        </div>
    )
}