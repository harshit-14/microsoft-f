import React,{useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import "./landing.css"
import question from '../images/question.svg'
import chat from '../images/redChat.svg'
import teamlayout from '../images/team layout.svg'
import mail from '../images/mail.svg'
import {createRoomApi} from './api'
import Chatbox from './chatbox'
export default function Landing(props){
     
        const history=useHistory()

        //callback for creating a new room
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
        
        //join with code function
        const joinNow=()=>{
            var x = document.getElementById("joincode")
            if(x.value)
            {
                history.push(`/rooms/${x.value}`)
            }
            else{
                alert("Please fill the code")
            }
        }
    return(
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
                         <button onClick={()=>{history.push("/chatbox")}} className="create-room">chatBox</button>
                        <pre className="last-line">Be  a  Part  of   <i class="fab fa-windows"></i>   Teams </pre>
                     </div>       
                </section> 
                <section className="two" id="two">
                    <div className="two-1">
                        <div className="img-head">Chat</div>
                        <img src={chat}></img>
                        <div className="img-text">Share your opinion and have fun with your team. 
                            Enjoy group chatting.
                        </div>
                    </div>
                    <div className="two-2">
                        <div className="img-head">Video conference</div>
                        <img src={teamlayout} ></img>
                        <div className="img-text">Make and receive calls directly in Microsoft Teams with advanced features like group calling,
                         cloud voicemail, and call transfers.
                        </div>
                        
                    </div>
                    <div className="two-3">
                        <div className="img-head" >Share Screen</div>
                        <img src="https://displaynote.s3.amazonaws.com/images/img-broadcast-content.svg" ></img>
                        <div className="img-text"> This can include all the elements on a screen or simply one window, which allows for complete control over the 
                         visibility of your desktop and guarantees privacy.
                        </div>
                    </div>
                 </section>
                <section className="four">
                    <div className="doubt-img">
                        <img src={question}></img>
                        <div className="doubt-heading"><h2>Have a doubt ?</h2>
                            <pre>Raise Your Hand with hand symbol at bottom .<br></br>
                                Others can see on hovering on top partipants <i class="fas fa-hand-paper"></i> <br></br>icon and 
                                will get a pop up too....
                            </pre>
                        </div>
                    </div>
                    <div className="mail-img">
                    <div className="mail-heading"><h2>Share link via mail ?</h2>
                            <pre>Press share via mail option on top bar .<br></br>
                                Enter your name and email id to which you<br></br> want to share meeting link.
                            </pre>
                        </div>
                        <img src={mail}></img>
                    </div>
                    <div className="credits">
                         Developed By Harshit Kharbanda
                        <div className="email">microsoft.teams.hk@gmail.com</div>
                    </div>
                </section> 
            </div>
        </div>
    )
}