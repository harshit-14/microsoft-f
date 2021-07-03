import React,{useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import "./landing.css"
import undrawone from '../images/connect to world.svg'
import imgtwo from '../images/connection.svg'
import chat from '../images/redChat.svg'
import teamlayout from '../images/team layout.svg'
import {createRoomApi} from './api'

export default function Landing(props) {
     
    const history=useHistory()
    const createRoom=useCallback(async()=>{
        try
        {
            const roomInformation=await createRoomApi(props.currentUserId)
            history.push(`/rooms/${roomInformation.roomId}`)
        }
        catch(err)
        {
            console.log(err)
        }

    },[props.currentUserId])

    const joinNow=()=>{
        var x = document.getElementById("joincode")
        if(x.value)
        {
            history.push(`/rooms/${x.value}`)
        }
        else{
            alert("Please Fill The Code")
        }
       
    }
    console.log("landing page ka return ")
    return (
        <div className="landing">
            <div className="main-container">
          

                <section className="three">
                  <div>
                      <div className="microsoft-team"><i class="fab fa-windows"></i>   Microsoft team</div>
                      
                      <div className="three-img">
                        
                          <div className="all-icons"> 
                           <div style={{textAlign:"center",marginLeft:"12px"}}>
                            <div className="icon-mic"><i class="fas fa-microphone-alt"></i></div>
                            <div className="icon-text">Interact with Audio</div>
                            </div>
                            
                           
                          <div style={{textAlign:"center",marginLeft:"15px"}}>  
                           <div className="icon-screen"><i class="fas fa-share"></i></div>
                           <div  className="icon-text">Share Your Screen</div>
                           </div>
                           <div style={{textAlign:"center",marginLeft:"25px"}}>
                           <div className="icon-people"><i class="fas fa-users"></i></div>
                           <div  className="icon-text">Facecam</div>
                           </div>
                           <div style={{textAlign:"center",marginLeft:"38px"}}>
                           <div className="icon-chat"><i class="fas fa-comments"></i></div>
                           <div  className="icon-text">Let's Chat</div>
                           </div>
                          </div>
                      </div>
                  </div>
                  <div style={{background:"#085F63",borderRadius:"50px 0 0 0",marginLeft:"20px"}}>
                <div className="join-meet">Join a meeting</div>

                <div className="join-div">
                    <input type="text" id="joincode" placeholder="Code XXXX-XXXX-XXX"></input>
                    <button className="join-button" onClick={joinNow}>Join Now</button>
                </div>

                   <div className="create-text">Create Your Team</div> 
                   <button onClick={createRoom} className="create-room">Create Now</button>
                   <pre className="last-line">Be  a  Part  of   <i class="fab fa-windows"></i>   Teams </pre>
                  </div>
                
                </section> 
                <section className="two" id="two">
  <div className="two-1">
      <div className="img-head">Chat</div>
      <img src={chat}></img>
      <div className="img-text">Share your opinion and have fun with your team. 
         Enjoy group chatting.</div>
  </div>
  <div className="two-2">
     <div className="img-head">Video conference</div>
      <img src={teamlayout} ></img>
      <div className="img-text">Make and receive calls directly in Microsoft Teams with advanced features like group calling, cloud voicemail, and call transfers.</div>
    
  </div>
  <div className="two-3">
      <div className="img-head" >Share Screen</div>
      <img src="https://displaynote.s3.amazonaws.com/images/img-broadcast-content.svg" ></img>
      <div className="img-text"> This can include all the elements on a screen or simply one window, which allows for complete control over the visibility of your desktop and guarantees privacy.</div>
  </div>
</section>
                <section className="four">
                  <h1>Fourth page</h1>
                </section> 
                
 
             
            </div>
        
        
        
        
        
        
        
        
        
        
        
        
          
        </div>
    )
}