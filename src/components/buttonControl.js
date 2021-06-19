import React from 'react'

const style = {
    position : 'fixed',
    width: '100%',
    padding :20,
    bottom:0
}

export default function ButtonControl(props)
{

return(
<div className="has-text-centered mt-5" style={style}>
            <button className="button is-danger mr-2" onClick={props.onLeave}>
                <span className="icon">
                    <i className="fas fa-phone-slash"/>
                </span>
                <span>Leave call</span>
            </button>
            <button className={`button is-${props.muted ? 'danger' : 'primary' } mr-2`} onClick={props.toggleMute}>
                <span className="icon">
                    <i className={`fas ${props.muted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                </span>
                <span>{props.muted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button className={`button is-${props.videoMuted ? 'danger' : 'primary' } mr-2`} onClick={props.toggleVideoMute}>
                <span className="icon">
                    <i className={`fas ${props.videoMuted ? 'fa-video-slash' : 'fa-video'}`}></i>
                </span>
                <span>{props.videoMuted ? 'Turn video on' : 'Turn video off'}</span>
            </button>
        </div>
)
}