import React,{useEffect,useRef} from 'react'


export default function RemoteStreamVideo(props) {

    const style={
        backgroundColor:"black",
        textAlign:"center",
        height:30,
        width:150,
        marginLeft:150,
        color:"white",
        borderRadius:10
    } 
   const mystyle={
       width:130,
       height:130
   }
    const userVideoRef = useRef()
   // console.log('remote video stream function')
   // console.log(props)
    useEffect(() => {
        if (userVideoRef.current && props.remoteStream) {
            userVideoRef.current.srcObject = props.remoteStream
            userVideoRef.current.play()
        }
    }, [props.remoteStream])
  console.log("------------------------------------------------------",props.len)
    return (
        <div>
            <video ref={userVideoRef} id="video" style={props.len>2?{mystyle}:null}/>
            <div  style={style}>{props.name}</div>
        </div>
    )
}