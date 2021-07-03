import React,{useEffect,useState,useRef,useCallback} from 'react';
import PeerJS from 'peerjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import {v4 as uuidv4} from 'uuid';
import{BrowserRouter,Switch,Route,RouteComponentProps} from 'react-router-dom';
import Landing from './components/landing';
import './App.css';
import Room from './components/room';

function App() {
     
   const peerInstance = useRef();
   const [currentUserId , setCurrentUserID] = useState('');
  
   //useEffect for making peerInstance with the help of uuid and peer.js
  useEffect(()=>{
      const userId = uuidv4();
      peerInstance.current = new PeerJS(userId);
      peerInstance.current.on('open',(id)=>{
      setCurrentUserID(id);
    })
   
  },[])

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
