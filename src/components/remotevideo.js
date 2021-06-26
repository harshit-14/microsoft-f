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

    const userVideoRef = useRef()
   // console.log('remote video stream function')
   // console.log(props)
    useEffect(() => {
        if (userVideoRef.current && props.remoteStream) {
            userVideoRef.current.srcObject = props.remoteStream
            userVideoRef.current.play()
        }
    }, [props.remoteStream])

    return (
        <div>
            <video width={640} height={480} ref={userVideoRef} id="video" />
            <div  style={style}>{props.name}</div>
        </div>
    )
}