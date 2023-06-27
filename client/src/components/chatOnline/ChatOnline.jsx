import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + currentId);
      setFriends(res.data);
    };

    getFriends();
  }, [currentId]);
  // console.log(friends);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    const chat=async ()=>{
      try {
      const res = await axios.get(
        `/conversations/find/${currentId}/${user._id}`
        );
        console.log(res.data)
        setCurrentChat(res.data);
      if(res.data === null){
        const members={
          "senderId":user._id,
          "receiverId":currentId
        }
        const res=await axios.post(`/conversations/`,members);
        // setCurrentChat(res.data);
        console.log(res.data)
        chat();
        
      }
    }
    
    // console.log(res.data)
    
    catch (err) {
      console.log(err);
    }}
    
    chat();
  };
  
  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)} key={o._id}>
          {/* {console.log(o)} */}
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? PF + o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
