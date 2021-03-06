import avatar from '../svg/avatar.svg'
import bg from '../svg/bg.svg'
import './login.css'
import wave from '../svg/wave.png'
import { useState } from 'react'
import  axios from 'axios'
const  nodemailer = require('nodemailer')
export default function SignUp(props)
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
        //post request for user regiester
       //https://ms-teams-backend-hk.herokuapp.com/api/auth/register
		axios.post('https://ms-team-backend-hk.herokuapp.com/register',(data))
		.then((res)=>{
			props.setName(res.data.user.name)
			props.setToken(res.data.token);
			sessionStorage.setItem('token',res.data.token)
		}) 
		.catch(err=>{
			console.log(err)
            alert("User already exist")
		})
	}
    return(
        <div className="login-outer">
        <img class="wave" src={wave} alt="img-register"/>
        <div class="login-container">
            <div class="img">
                <img src={bg} alt="img-register"/>
            </div>
            <div class="login-content">
                <form>
                    <img src={avatar} alt="img-register"/>
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
