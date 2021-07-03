import React, { useState,useEffect } from 'react'
import './buttoncontrol.css'

import {Tooltip,OverlayTrigger,Popover,Button,Spinner} from 'react-bootstrap'

const style = {
    position : 'fixed',
    width: '100%',
    bottom:0,
  justifySelf:"center"
     
}
export default function ButtonControl(props)
{
    const handRaisefunction=()=>{
        if(!props.handRaise)
        {
            console.log("hand is raised")
            props.socket.emit("raise-hand",props.name,props.roomId)
        }
        else
        {
            console.log("hand is down")
            props.socket.emit("hand-down",props.name,props.roomId)
        }
      props.setHandRaise(!props.handRaise)
    }

    const [time,setTime] = useState('')
      
    useEffect(()=>{
        props.socket?.off("receive-raise-hand").on("receive-raise-hand",(name,roomid)=>{
            
            props.setHandRaiseName(name)
            props.setHandRaiseEntry(name)
          
            console.log("button controls hand raise name receive",name)
          console.log("name",name)
          console.log(roomid)
        })
        props.socket?.off("receive-hand-down").on("receive-hand-down",(name,roomid)=>{
            props.setHandDownEntry(name)
            console.log("name",name)
            console.log(roomid)
          })
      })
       
       

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
    },1000)
    return ()=>{clearInterval(temp)}
 },[])
 
    console.log("length of participants is-------------",props.len)
return(
    <>
    <div className="faltu">eawrfwfvwvsvw</div>
<div  style={style}>
    
    <div className="button-outer-1">
    <div className="buttoncontrol-time">{time}</div>
    <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Participants</Popover.Title></Popover>}>
            <button className="danger" onClick={()=>{props.setPeople(!props.people)}}>
                <span className="icon">
                <i class="fas fa-users"></i>
                {props.len>0?<span>{props.length}</span>:<span></span>}
                </span>
            </button>
            </OverlayTrigger>
    <div>
    <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Leave Call</Popover.Title></Popover>}>
            <button className="button-is-danger-1" onClick={props.onLeave}>
                <span className="icon">
                    <i className="fas fa-phone-slash"/>
                </span>  
            </button>
            </OverlayTrigger>
            <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Microphone</Popover.Title></Popover>}>
            <button className={`${props.muted ? 'danger' : 'primary' }`} onClick={props.toggleMute}>
                <span className="icon">
                    <i className={`fas ${props.muted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                </span>
            </button>
            </OverlayTrigger>
            <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">Camera</Popover.Title></Popover>}>
            <button className={`${props.videoMuted ? 'danger' : 'primary' } `} onClick={props.toggleVideoMute}>
                <span className="icon">
                    <i className={`fas ${props.videoMuted ? 'fa-video-slash' : 'fa-video'}`}></i>
                </span>
            </button>
            </OverlayTrigger>
            <OverlayTrigger
            placement="top"
            overlay={<Popover id="popover-basic"><Popover.Title as="h3">{props.handRaise?<span>Hand Raise</span>:<span>Hand Down</span>}</Popover.Title></Popover>}>
            <button className="handRaise" onClick={handRaisefunction}>
                  {
                      props.handRaise?<i class="fas fa-hand-paper"></i>:<i class="fas fa-hand-rock"></i>
                  }
                
            
            </button>
            </OverlayTrigger>
            </div>
          
            {
            !props.shared
            ?
              <button className="screenshare" onClick={props.sharescreen}>Screen Share</button>
            :
            <button className="screenshare" onClick={props.stopSharing}>stop share</button>
              }
              <button className="lets-chat" onClick={props.setShowChat} >
                  Lets chat
              </button>
             
            </div>
          
        </div>
       
        </>
)
}