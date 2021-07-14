import './login.css'
import avatar from '../svg/avatar.svg'
import bg from '../svg/bg.svg'
import wave from '../svg/wave.png'
import { useState } from 'react'
import  axios from 'axios'
export default function SignIn(props)
{
	
	const[email,setEmail] = useState('');
	const[password,setPassword] = useState('');
    const userlogin =async(e)=>{
		e.preventDefault();
		const data={
			email:email,
			password:password
		}
		//post request for user login
         //https://ms-teams-backend-hk.herokuapp.com/api/auth/login
		axios.post('https://ms-team-backend-hk.herokuapp.com/login',(data))
		.then((res)=>{
			props.setName(res.data.user.name)
			props.setToken(res.data.token);
			sessionStorage.setItem('token',res.data.token)
			sessionStorage.setItem('email',data.email)
		}) 
		.catch(err=>{
			console.log(err)
			alert("-> "+err.response.data.msg)
		})
	}
	
    return(
        <div className="login-outer">
			<div>
			
			</div>
	<img class="wave" src={wave} alt="img-login"/>
	<div class="login-container">
		<div class="img">
			<img src={bg} alt="img-login"/>
		</div>
		<div class="login-content">
			<form >
				<img src={avatar} alt="img-login"/>
				<h2 class="title-1">Welcome</h2>
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
            	<button  className="login-button" onClick={()=>{props.setLogin(false)}}>New User ?</button>
            	<input type="submit" class="btn" value="Login" onClick={(e)=>userlogin(e)}/>
            </form>
        </div>
    </div>
        </div>
    )
}









