

//https://ms-teams-backend-hk.herokuapp.com/rooms/${roomId}
//https://localhost:5000/rooms/${roomId}
//fetching all participants in that room
export const fetchRoomAPI=async(roomId)=>{
   const response=await fetch(`https://ms-team-backend-hk.herokuapp.com/rooms/${roomId}`,{
   method:'GET'
})

 const data=await response.json()
 //console.log("server data",data)
return data;
}

//https://ms-teams-backend-hk.herokuapp.com/rooms/${roomId}/join
//https://https://localhost:5000/rooms/${roomId}/join
//joining the room
export const joinRoomAPI=async(roomId,participant)=>{
  const response=await fetch(`https://ms-team-backend-hk.herokuapp.com/rooms/${roomId}/join`,{
  method:'POST',
  headers:{
      'Accept':'application/json',
      'Content-type':'application/json'
  },
  body:JSON.stringify({participant})
})

const data=response.json()
return data;
}

//https://ms-teams-backend-hk.herokuapp.com/rooms
//https://localhost:5000/rooms
//creating new room for instant meeting
export const createRoomApi=async(main)=>{
  const response=await fetch(`https://ms-team-backend-hk.herokuapp.com/rooms`,{
      method:'POST',
      headers:{
          'Accept':'application/json',
          'Content-type':'application/json'
      },
      body:JSON.stringify({main})
  })

  const data=await response.json()
  return data;
}
