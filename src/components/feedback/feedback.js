import { useState,useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { useHistory} from 'react-router-dom'
import "./feedback.css"
import axios from "axios"
export default function Feedback(){

    let history = useHistory();
    let star=0
    const [myrating,setMyRating] = useState(0)
    const ratingChanged = (newRating) => {
        star=newRating
	  };
      const home=()=>{
        history.push('/')
      }  
      //post request for storing rating from user 
      const rating=()=>{
          if(star===0)
          {
              alert("Please set your rating")
          }
              setMyRating(star)
              const rate={
                  email:sessionStorage.getItem('email'),
                  rating:star
              }
              console.log("star is ",star)
              axios.post("https://ms-teams-backend-hk.herokuapp.com/api/feedback",rate)
              .then((res)=>{
                  console.log("your feedback has been send")
              })
              .catch((err)=>{
                  console.log(err)
              })
              if(star!==0)
              {
                history.push('/')
              }
              
      }
    return (
        <div className="feedback-page">
        <div className="feedback-outer"> 
        <div className="feedback-heading">We will like your feedback to improve our website</div>
        <h1 className="feedback-h1">What is your opinion ?</h1>
            <ReactStars classNames="stars"
    count={5}
    onChange={ratingChanged}
    size={40}
    isHalf={true}
    emptyIcon={<i className="far fa-star"></i>}
    halfIcon={<i className="fa fa-star-half-alt"></i>}
    fullIcon={<i className="fa fa-star"></i>}
    activeColor="#013DC4"
  />
  <button onClick={()=>rating()} className="feedback-submit">SUBMIT</button>
  <button onClick={()=>home()} className="feedback-homepage">Home Page</button>
     </div>
     </div>
    )
}