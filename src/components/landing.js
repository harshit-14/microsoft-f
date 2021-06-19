import React,{useCallback} from 'react'
import image from './landing_image.jpg'
import {useHistory} from 'react-router-dom'
import "./landing.css"
import meet_img from "./meet_img.png"
import {createRoomApi} from './api'
console.log("harshit")
export default function Landing(props) {
     
  console.log("i am landing.js");
    console.log("Landing me props ka currentUserId -->",props.currentUserId);
  //console.log(props)
    const history=useHistory()
    const createRoom=useCallback(async()=>{
        console.log("i am landing ka hook create room");
        try
        {
            const roomInformation=await createRoomApi(props.currentUserId)
            console.log('landing me fetch ke bad roominformation',roomInformation )
            history.push(`/rooms/${roomInformation.roomId}`)
        }
        catch(err)
        {
            console.log(err)
        }

    },[props.currentUserId])
    console.log("landing page ka return ")
    return (
        <div className="landing">
        
        <div class="outer">
        <div id="nav">
            
             <div class="heading">
                <a href="#s">Connection Beyond Imagination</a> 
             </div>
             
        </div>
        <div class="container">
              <div class="card">
                <div class="content">
                 <p class=" para">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero et iste non rem fugit cum, ut quasi optio. Repellat quo praesentium fugiat maiores aperiam dicta nisi iste earum voluptas molestiae. </p>
            </div>
        </div>
        </div>
        
        <div className="r">
            <div className="content">
                Join Meet
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. In, nemo. At quibusdam omnis necessitatibus corrupti velit, neque eos harum perferendis tempora autem iste voluptates esse quae maxime distinctio in fugiat!</p>
               <img className="landing_img"  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXyrIeAHVpXF5sfyHdA1jGAMY5KTSFD6ks8rzGUUhfiWWZ8GhDWJL0MNlVeKfEVHfcwbQ&usqp=CAU"></img>
             <br></br>
             <button onClick={createRoom} className="createroom"> Create Room</button>
            </div>
        </div>
         </div>
         
        </div>
    )
}