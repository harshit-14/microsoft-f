import React,{useCallback} from 'react'

import {useHistory} from 'react-router-dom'
import "./landing.css"

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
        <div className="blue">
            <div className="navbar">
            <button className="navbar-span-1">Sign up</button>
            <button className="navbar-span-2">Login</button>
            </div>
            <div className="blue-bottom">
            <img className="blue-img" src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/1132ef5c-7a9a-410d-adfb-bc4cb2e69a18.png"></img>
            <span className="blue-text" id="we-believe">We Believe In</span>
            <br></br>
            <span className="blue-text">Connecting People</span>
            <button onClick={createRoom} className="createroom"> Create Team</button>
            </div>
        </div>
        <div className="one-card">
            <div className="card-1-heading">
                What We Provide?
            </div>
            <div className="card-1-outer">
            <img height="400px"  src="https://www.clipartkey.com/mpngs/m/245-2459856_uncategorized-group-chat-svg.png"></img>   
            <div className="card-1-text">
                <span className="card-1-span"><i class="fas fa-arrow-circle-right"></i>Create Your Team</span>
                <br></br>
                <span>
                <span className="card-1-chat-with">Chat with</span>
                <br></br>
               <div className="card-1-line"><span><i class="fas fa-chevron-circle-right"></i></span>friends</div>
               <div className="card-1-line"><span><i class="fas fa-chevron-circle-right"></i></span>family</div>
               <div className="card-1-line"><span><i class="fas fa-chevron-circle-right"></i></span>coleagues</div>
                </span>
               
            </div>
            </div>  
        </div>
            <div className="card-2-outer">
            <div className="card-2-text">
                <span className="card-2-span"><i class="fas fa-arrow-circle-right"></i>Create Your Team</span>
                <br></br>
                <span>
                <span className="card-2-chat-with">Share Link</span>
                <br></br>
               <div className="card-2-line"><span><i class="fas fa-chevron-circle-right"></i></span>conduct conference</div>
               <div className="card-2-line"><span><i class="fas fa-chevron-circle-right"></i></span>family meeting</div>
               <div className="card-2-line"><span><i class="fas fa-chevron-circle-right"></i></span>share screen</div>
                </span>
            </div>
            <img height="400px" className="img-2" src="https://st3.depositphotos.com/11128870/35827/v/380/depositphotos_358270806-stock-illustration-work-home-illustration-video-call.jpg"></img>   
            </div>  
        </div>
    )
}