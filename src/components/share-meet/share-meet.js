import { useState } from 'react'
import './share-meet.css'

export default function ShareMeet(props) {

    const [to,setTo] = useState('')
    const [from,setFrom] = useState('')
    
    const submit = async(e)=>{
        e.preventDefault();
        console.log("submit from")
        alert("Mail Send")
      
        const data={
            from:from,
            to:to,
            url:window.location.href
        }
         const res  = await fetch(`https://ms-teams-backend-hk.herokuapp.com/api/send`,{
             method:'POST',
             headers:{
                 'Accept':'application/json',
                 'content-type':'application/json'
             },
             body:JSON.stringify(data)
         })
      

    }
 
    return(
        <div className="share-meet-outer">
          <form className="form">
            <div className="from-text">FROM</div>
              <input className="from" type="email" placeholder="Type Your Name..." onChange={(e)=>setFrom(e.target.value)}></input>
              <br></br>
              <div className="from-text">TO</div>
              <input className="to" type="text" placeholder="example_1.com,example_2.com" onChange={(e)=>setTo(e.target.value)}></input>
              <br></br>
              <input className="submit" type="submit" value="SEND" onClick={(e)=>submit(e)}></input>
          </form>
        </div>
    )    
}