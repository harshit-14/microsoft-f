import { useEffect, useState } from 'react'
import './roomtop.css'
import ShareMeet from './share-meet'
import Chat from './chat'
export default function RoomTop(props){
    const [sharemeet,setShareMeet] = useState(false)
    const [time,setTime] = useState('')
   const [isshow,setIsShow] = useState(false)
  
useEffect(()=>{
   const temp = setInterval(()=>{
       var x  = new Date();
       var y = x.toLocaleString('en-us',{hour:'numeric',hour12:'true'})
       if(x.getMinutes()<10)
       {
        if(x.getHours()>12)
        {
           let c =  x.getHours();
             c%=12;
             setTime(c+" : "+"0"+x.getMinutes()+" "+y[y.length-2]+y[y.length-1])
        }
        else{
            setTime(x.getHours()+" : "+"0"+x.getMinutes()+" "+y[y.length-2]+y[y.length-1])
        }
       }
       else{
        if(x.getHours()>12)
        {
           let c =  x.getHours();
             c%=12;
             setTime(x.getHours()+" : "+x.getMinutes()+" "+y[y.length-2]+y[y.length-1])
        }
        else{
            setTime(x.getHours()+" : "+x.getMinutes()+" "+y[y.length-2]+y[y.length-1])
        }
        
       }
      // console.log("x",x)
       //console.log("y",y)
    //console.log("temp",temp);
   // console.log(x.getMinutes());
   },1000)
   return ()=>{clearInterval(temp)}
},[])

    return(
        <div className="roomtop-outer">
        <Chat currentUserId={props.currentUserId} socket={props.socket} isShow={()=>{setIsShow(!isshow)}} isshowvalue={isshow}></Chat>
        <button onClick={()=>setIsShow(!isshow)} className="roomtop-chat-button"><span><i class="fab fa-rocketchat"><span className="chat">Chat</span></i></span></button>
        <button className="sharelink"  onClick={()=>{
            setShareMeet(!sharemeet)
        }}><span><i class="fas fa-share"></i><span className="share-text">Share</span></span></button>
        <div className="share-box">
       {
           sharemeet
           ?
           <ShareMeet></ShareMeet>
           :
           <div></div>
       }
       </div>
        <span className="time">{time}</span>
        </div>
    )
}