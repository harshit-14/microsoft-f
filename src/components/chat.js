import { Socket } from 'socket.io-client';
import './chat.css'
import {useParams} from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react';


export default function Chat(props)
{
  
   
    const [data,setData]=useState("")
 
   const {roomId}=useParams()
   
  const showmessage=function(message,name){

     if(!props.showchat)
     {
         props.setDis(false);
         props.setMess(message)
         props.setMessName(name)
     }

    
  }
     
    const submitbutton =  useCallback(()=>{
        if(data)
        {
            
            const outer = document.getElementById('chatbox')
            const newmess=document.createElement('div')
            newmess.textContent=data
            newmess.className = "mymess"
            outer.append(newmess);
            const temp = document.createElement('div')
            temp.className = "temp"
            newmess.append(temp)
            const divforname = document.createElement('span')
            divforname.className = "divforname";
          
            divforname.textContent = "~"+props.name;
            temp.append(divforname)
            const divfortime = document.createElement('span')
            divfortime.className = "divfortime";
            const date =  new Date();
            const x=date.toLocaleString('en-us',{hour:'numeric',hour12:'true'})
            const time=date.getHours()+" : "+date.getMinutes() +" "+x[x.length-2]+x[x.length-1]
            divfortime.textContent = time;
            temp.append(divfortime);
            const shouldScroll = outer.scrollTop + outer.clientHeight === outer.scrollHeight;
            if (!shouldScroll) {
                outer.scrollTop = outer.scrollHeight;
            }
           
            props.socket?.emit('send-message',data,roomId,props.CurrentUserId,props.name)
            setData('');    
        }
        

    })

   
    useEffect(()=>{
     
        props.socket?.off('receive-message').on('receive-message',(message,roomI,currentUserId,name)=>{ 
       
            if(roomI===roomId)
            {
            const outer = document.getElementById('chatbox')
            var newmess=document.createElement('div')
            newmess.className = "others-mess"
            newmess.textContent=message
            outer.append(newmess)
            const temp = document.createElement('div')
            temp.className = "temp"
            newmess.append(temp)
            const divforname = document.createElement('span')
            divforname.className = "divforname";
            divforname.textContent = "~"+name;
            temp.append(divforname)
            const divfortime = document.createElement('span')
            divfortime.className = "divfortime";
            const date =  new Date();
            const x=date.toLocaleString('en-us',{hour:'numeric',hour12:'true'})
            const time=date.getHours()+" : "+date.getMinutes() +" "+x[x.length-2]+x[x.length-1]
            divfortime.textContent = time;
            temp.append(divfortime);
            const shouldScroll = outer.scrollTop + outer.clientHeight === outer.scrollHeight;
            if (!shouldScroll) {
                outer.scrollTop = outer.scrollHeight;
            }
            showmessage(message,name);
           
            }
            else{
                return;
            }
            
        })
    })
    useEffect(()=>{
       const listener = event =>{
           if(event.code==="Enter" || event.code==="NumpadEnter")
           {
               console.log("enter key was passed");
               event.preventDefault();
               if(data)
               {
                   console.log("props.socket===============>",props.socket)
                   const outer = document.getElementById('chatbox')
                   const newmess=document.createElement('div')
                   newmess.textContent=data
                   newmess.className = "mymess"
                   outer.append(newmess);
                   const temp = document.createElement('div')
                   temp.className = "temp"
                   newmess.append(temp)
                   const divforname = document.createElement('span')
                   divforname.className = "divforname";
                 
                   divforname.textContent = "~"+props.name;
                   temp.append(divforname)
                   const divfortime = document.createElement('span')
                   divfortime.className = "divfortime";
                   const date =  new Date();
                   const x=date.toLocaleString('en-us',{hour:'numeric',hour12:'true'})
                   const time=date.getHours()+" : "+date.getMinutes() +" "+x[x.length-2]+x[x.length-1]
                   divfortime.textContent = time;
                   temp.append(divfortime);
                   const shouldScroll = outer.scrollTop + outer.clientHeight === outer.scrollHeight;
            if (!shouldScroll) {
                outer.scrollTop = outer.scrollHeight;
            }
                  
                   props.socket?.emit('send-message',data,roomId,props.CurrentUserId,props.name)
                   setData('');    
               }
           }
       }

       document.addEventListener("keydown",listener);
       return ()=>{
           document.removeEventListener("keydown",listener)
       }
    },)

    return(
      
        <div id={props.showchat?"chat-box":"hide-chat"}>
            <div className="group-chat">Group Chat<button onClick={props.setShowChat}><i class="fas fa-times-circle"></i></button></div>
            <div id="chatbox"></div>
            <div className="chat-outer-of-input">
                 <input   type="text" placeholder="message" name="mess" value={data}  onChange={(e)=>{setData(e.target.value)}} className="input-chat"></input>
                 <button className="chat-button" onClick={submitbutton}><i class="fas fa-location-arrow"></i></button>
            </div>
        </div>
       
    )
}