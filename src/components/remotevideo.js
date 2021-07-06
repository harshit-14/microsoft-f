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
   const video_more={
    height: "230px",
    width: "300px",
    boxShadow: "0 0 7px red",
    marginTop: "30px",
    borderRadius: "3%",
    marginLeft: "30px"
   }
   const video_3={
    height: "260px",
    width: "345px",
    boxShadow: "0 0 7px black",
    marginTop: "30px",
    borderRadius: "3%",
    marginLeft: "30px"
   }
   const video_2={
    height: "300px",
    width: "400px",
    boxShadow: "0 0 7px black",
    marginTop: "30px",
    borderRadius: "3%",
    marginLeft: "30px"
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
 // console.log("------------------------------------------------------",props.len)
    return (
        <div>
            <video ref={userVideoRef} id="video" style={props.len<2?video_2:props.len===2?video_3:video_more} />
            <div  style={style}>{props.name}</div>
        </div>
    )
}