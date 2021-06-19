import React,{useEffect,useState,useRef,useCallback} from 'react';
import PeerJS from 'peerjs';
import {v4 as uuidv4} from 'uuid';
import{BrowserRouter,Switch,Route,RouteComponentProps} from 'react-router-dom';
import Landing from './components/landing';
import './App.css';
import Room from './components/room';
function App() {
     
    console.log("i am app.js")
   const peerInstance = useRef();
   const [currentUserId , setCurrentUserID] = useState('');
  
  useEffect(()=>{
    console.log("app ka useeffect for new peer instance and set current user id")
    const userId = uuidv4();
    peerInstance.current = new PeerJS(userId);
    //console.log("userID",userId)
     // console.log("app me peerinstance",peerInstance.current)
    peerInstance.current.on('open',(id)=>{
      
      console.log("current user id from app.js-->",userId);
      setCurrentUserID(id);
    //  console.log("currrentUserid",currentUserId);
      console.log("fir sse checking")
    })
   
  },[])

  
  console.log("app ka return");
  return (
    <BrowserRouter>
    
    <Route exact path='/'> <Landing currentUserId={currentUserId}></Landing></Route>

    <Route path="/rooms/:roomId">
    <Room currentUserId={currentUserId} peerInstance={peerInstance.current}></Room>
   </Route>
   </BrowserRouter>
  );
}
 
export default App;
