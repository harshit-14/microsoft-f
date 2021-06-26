import { useState } from 'react'
import './share-meet.css'

export default function ShareMeet() {

    const [to,setTo] = useState('')
    const [from,setFrom] = useState('')
    
    const submit = async(e)=>{
        e.preventDefault();
        console.log("submit firom")
        const data={
            from:from,
            to:to,
            url:window.location.href
        }
         const res  = await fetch(`http://localhost:5000/api/send`,{
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
              <input className="from" type="email" placeholder="abc@abc.com" onChange={(e)=>setFrom(e.target.value)}></input>
              <br></br>
              <div className="from-text">TO</div>
              <input className="to" type="text" placeholder="eg xyz.xyz.com,abc.abc.com" onChange={(e)=>setTo(e.target.value)}></input>
              <br></br>
              <input className="submit" type="submit" value="SEND" onClick={(e)=>submit(e)}></input>
          </form>
        </div>
    )    
}