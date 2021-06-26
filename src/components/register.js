import avatar from './avatar.svg'
import bg from './bg.svg'
import './login.css'
import wave from './wave.png'
import { useState } from 'react'
import  axios from 'axios'

export default function Register(props)
{
 
    const[name,setName] = useState('');
	const[email,setEmail] = useState('');
	const[password,setPassword] = useState('');

    const userregister =async(e)=>{
		e.preventDefault();
		const data={
            name:name,
			email:email,
			password:password

		}
        console.log("register new user")
		axios.post('http://localhost:5000/api/auth/register',(data))
		.then((res)=>{
			props.setName(res.data.user.name)
			props.setToken(res.data.token);
			sessionStorage.setItem('token',res.data.token)
		}) 
		.catch(err=>{
			console.log(err)
		})
	}
    return(
        <div className="login-outer">
        <img class="wave" src={wave}/>
        <div class="login-container">
            <div class="img">
                <img src={bg}/>
            </div>
            <div class="login-content">
                <form>
                    <img src={avatar}/>
                    <h2 class="title-1">Welcome</h2>
                       <div class="input-div one"> 
                          <div class="i">
                                  <i class="fas fa-user"></i>
                          </div>
                          <div class="div">
                                  
                                  <input placeholder="Name" type="text" class="input" onChange={(e)=>{setName(e.target.value)}}/>
                          </div>
                       </div>
                       <div class="input-div one"> 
                          <div class="i">
                                  <i class="fas fa-user"></i>
                          </div>
                          <div class="div">
                                  
                                  <input placeholder="Email" type="email" class="input" onChange={(e)=>{setEmail(e.target.value)}}/>
                          </div>
                       </div>
                       <div class="input-div pass">
                          <div class="i"> 
                               <i class="fas fa-lock"></i>
                          </div>
                          <div class="div">
                               <input placeholder="Password" type="password" class="input" onChange={(e)=>{setPassword(e.target.value)}}/>
                       </div>
                    </div>
                	<button  className="login-button" onClick={()=>{props.setLogin(true)}}>Already have an account ?</button>
                    <input type="submit" class="btn" value="Register" onClick={(e)=>userregister(e)}/>
                </form>
            </div>
        </div>
            </div>
    )
}