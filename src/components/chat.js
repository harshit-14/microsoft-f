import { Socket } from 'socket.io-client';
import './chat.css'
import {useParams} from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react';


export default function Chat(props)
{
  
     console.log(props)
    const [data,setData]=useState("")
 
   console.log("i am  chat.js")
   const {roomId}=useParams()
   
    
     //console.log(roomId); 
    const submitbutton =  useCallback(()=>{
        
        const outer = document.getElementById('chatbox')
        const newmess=document.createElement('div')
        newmess.textContent=data
        newmess.className = "mymess"
        outer.append(newmess)
        console.log(props.socket);
        props.socket?.emit('send-message',data)
        setData('');

    })

   
    useEffect(()=>{
        props.socket?.off('receive-message').on('receive-message',message=>{ 
            console.log("count",message);
            const outer = document.getElementById('chatbox')
            var newmess=document.createElement('div')
            newmess.className = "others-mess"
            newmess.textContent=message
            outer.append(newmess)
        })
    })
    

  
console.log("chat ka return")
    return(
        <div className="chat-box">
            <div className="group-chat">Group Chat</div>
            <div id="chatbox"></div>
            <div className="outer-form">
               
                    <input type="text" placeholder="message" name="mess" value={data}  onChange={(e)=>{setData(e.target.value)}} className="mess"></input>
                    <button className="chat-button" onClick={submitbutton}><i class="fas fa-location-arrow"></i></button>
                   
               
            </div>
        </div>
    )
}