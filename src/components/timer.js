import { useEffect, useState } from "react"
 // video duration
export default function Timer(){
    const [timer,setTimer] = useState("")
    const [second,setSecond] = useState(0)
    useEffect(()=>{
        let interval = setInterval(() => {
       setSecond(second + 1);
       let sec = second%60
       let min = Math.floor(second/60)
       let hr = Math.floor(second/3600)
       if(sec<10)
       {
         sec='0'+sec
       }
       if(hr<10)
       {
         hr='0'+hr
       }
       if(min<10)
       {
         min='0'+min
       }
       setTimer(hr+':'+min+':'+sec)
     }, 1000);
     return () => clearInterval(interval);
   })
    return(
        <div>{timer}</div>
    )
}