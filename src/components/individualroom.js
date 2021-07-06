import React,{useState,useEffect,useRef} from 'react'
import Chat from './chat'
import {useParams,useLocation,useHistory} from 'react-router-dom'
import axios from 'axios'
import io from 'socket.io-client';
import {Button} from 'react-bootstrap'
import './chatbox.css'

export default function ParticularRoom(props) {
    
    const [storedMessages,setStoredMessages]=useState([])
    const location=useLocation()
    const {roomId}=useParams()
    const history=useHistory()
    const socketInstance=useRef(location.socketInstance)
    const [mess,setMess]=useState()
    const [name,setName]=useState(sessionStorage.getItem('name'))
    const [email,setEmail]=useState(sessionStorage.getItem('email'))


    //console.log(location.socketInstance)
    console.log(props)
    useEffect(() => {
        
        axios.get(`https://ms-teams-backend-hk.herokuapp.com/allMess/${roomId}`)
            .then(data=>{
                console.log(data)
                if(data.data)
                {
                    setStoredMessages(data.data.message)
                }
        })
    },[roomId])

    useEffect(()=>{
        socketInstance.current?.off('recieve-mess').on('recieve-mess',(data)=>{
            if(roomId===data.roomId)
            {
                const outer=document.getElementById(roomId)
                if(outer)
                {   
                    const newDiv=document.createElement('div')
                    newDiv.className="indiv-whole-mess"
                    const nameDiv=document.createElement('div')
                    nameDiv.textContent=data.name;
                    nameDiv.className="indiv-name"
                    const messDiv=document.createElement('div')
                    messDiv.textContent=data.mess;
                    messDiv.className="indiv-message"
                    newDiv.appendChild(nameDiv)
                    newDiv.appendChild(messDiv)
                    outer.appendChild(newDiv)
                }
            }
        })
    })

    const sendMess=(e)=>{
        e.preventDefault()
        //socket emit
        const data={
            roomId,
            name,
            email,
            mess
        }
        socketInstance.current.emit('send',data)
        //post req
        axios.post('https://ms-teams-backend-hk.herokuapp.com/newMess',data)
            .then(user=>{
                console.log(user)
            })
            .catch(err=>{
                console.log(err)
            })

        //display
        const outer=document.getElementById(roomId)
        if(outer)
        {
            const newDiv=document.createElement('div')
            newDiv.className="indiv-whole-mess"
            const nameDiv=document.createElement('div')
            nameDiv.textContent="~"+name;
            nameDiv.className="indiv-name"
            const messDiv=document.createElement('div')
            messDiv.className="indiv-message"
            messDiv.textContent=mess;
            newDiv.appendChild(nameDiv)
            newDiv.appendChild(messDiv)
            outer.appendChild(newDiv)
        }
        setMess('')
    }

    const joinRoom=()=>{
        history.push(`/rooms/${roomId}`)
            
    }

    return (
        <div className="indiv-outer">
            <div className="indiv-mess">
            <div style={{display:"flex"}}>
            <div className="indiv-room-name">{location.nameofroom}</div>
             <div><Button variant="primary" onClick={()=>joinRoom()} className="chatbox-join">Join</Button></div>
            </div>
            <div id={roomId} className="indiv-mess-append" style={{color:"black"}}>
            {
                storedMessages.map(x=>(
                    <div className="indiv-whole-mess">
                        <div className="indiv-name">~{x.name}</div>
                        <div className="indiv-messages">{x.mess}</div>
                        <div>{x?.time?.substr(8,17)}</div>
                        <br></br>
                    </div>
                ))
            }
            </div>
             <form className="indiv-form">
                <input type="text" name={props.location.key} value={mess} onChange={(e)=>{setMess(e.target.value)}} className="indiv-input"></input>
                <input type="submit" value="send" onClick={(e)=>{sendMess(e)}}  className="indiv-send"></input>
            </form>
            </div>
        </div>
    )
}