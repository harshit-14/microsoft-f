import React,{useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Link,useParams,useHistory} from 'react-router-dom'
import io from 'socket.io-client';
import SigninChat from './signin-chat'
import SignUpChat from './signup-chat'
import {Button,Modal,Form} from 'react-bootstrap'
import {v4 as uuid} from 'uuid'

import './chatbox.css'

export default function Chat(props) {

    const [loginChat,setLoginChat]=useState(true)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showJoin,setShowJoin]=useState(false);
    const close=()=>setShowJoin(false)

    const history=useHistory()
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [login,setLogin]=useState(false)
    const [room,setRoom]=useState([])
    const [currentRoom,setCurrentRoom]=useState('')
    const {roomId}=useParams()
    const socketInstance=useRef()
    const [roomname,setroomName]=useState('')
    const [count,setCount]=useState(0)
      
    //making socket instance
    useEffect(()=>{
        socketInstance.current=io('https://ms-teams-backend-hk.herokuapp.com');
        socketInstance.current.emit('join-room',roomId);

    },[])

    //setting user info in session storage
    useEffect(() => {
            axios.get(`https://ms-teams-backend-hk.herokuapp.com/chatbox/userInfo/${email}`)
            .then(data=>{
                if(data.data)
                {
                    console.log(data.data.rooms)
                    setRoom(data.data.rooms)
                }
                sessionStorage.setItem('name',name)
                sessionStorage.setItem('email',email)
            })
        
        
    }, [login,count])

     //creating new room in chat room 
    const create=(e)=>{
        e.preventDefault()
        const id=uuid();
        const data={
            roomname,
            name,
            email,
            roomId:id
        }
        axios.post('https://ms-teams-backend-hk.herokuapp.com/chatbox/createRoom',data)
            .then(res=>{
                const x={
                    author:props.currentUserId,
                    roomId:id
                }
                axios.post('https://ms-teams-backend-hk.herokuapp.com/rooms',x)
                .then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    console.log(err)
                })
                console.log(res);
                setShow(false)
                setCount(count+1)
                setroomName('')

            })
            .catch(err=>{
                console.log(err)
            })

    }
   
    //joining new room in chat room option
    const join=(e)=>{
        e.preventDefault()

        for(let i=0;i<room.length;i++)
        {
            if(roomname===room[i].roomId)
            {
                setShowJoin(false)
                alert('already a part of this team')
                return;
            }
        }
        const data={
            name,
            email,
            roomId:roomname
        }
        axios.post('https://ms-teams-backend-hk.herokuapp.com/chatbox/joinRoom',data)
            .then(res=>{
                console.log(res)
                setShowJoin(false)
                setCount(count+1);
                setroomName('')
            })
            .catch(err=>{
                console.log(err)
            })

    }
    return (
        <div className="root-chat">
            {
                login
                ?   
                <div className="chatbox-main-div">
                   <div className="chatbox-both-buttons"> 
                    <div>
                        <Button variant="primary" onClick={handleShow} id="chatbox-create-team">
                            Create Team
                        </Button>

                        <Modal show={show} onHide={handleClose}>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Team Name</Form.Label>
                                    <Form.Control type="text" value={roomname} onChange={(e)=>setroomName(e.target.value)} placeholder="Enter Team Name" />
                                </Form.Group>
                                <Modal.Footer>
                                <Button variant="primary" type="submit" onClick={(e)=>{create(e)}}>
                                    Create
                                </Button>
                                <Button variant="primary" onClick={handleClose}>
                                    Close
                                </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                    <div>
                        <Button variant="primary" onClick={()=>{setShowJoin(true)}} id="chatbox-join-room">
                            Join Team
                        </Button>

                        <Modal show={showJoin} onHide={close}>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Team Id</Form.Label>
                                    <Form.Control type="text" value={roomname} onChange={(e)=>setroomName(e.target.value)} placeholder="Team Id"  />
                                </Form.Group>
                                
                                <Button variant="primary" type="submit" onClick={(e)=>{join(e)}}>
                                    Join Meeting
                                </Button>
                            </Form>
                        </Modal>
                    </div>
                   </div>
                   <div className="chatbox-team-name"> 
                   <div className="chatbox-your-team">Your Teams</div>
                    {
                    room.map(r=>(
                        <div className="chatbox-links">
                        <Link key={r.roomId} to={{pathname:"/chatbox/"+r.roomId,key:roomId,socketInstance:socketInstance.current,nameofroom:r.name,loginChat:{loginChat}}}><div className="chatbox-link-name">{r.name}</div></Link>
                        </div>
                    ))
                    }
                    </div>
                </div>
                :
                loginChat
                ?
                <SigninChat setLoginChat={setLoginChat} setLogin={setLogin} setName={setName} setEmail={setEmail} ></SigninChat>
                 :
                 <SignUpChat setLoginChat={setLoginChat}  setLogin={setLogin} setName={setName} setEmail={setEmail} ></SignUpChat>
            }    
        </div>
    )
}