import { ChatStore } from "../Store/ChatStore";
import { useState, useEffect, useRef } from "react";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import { AuthStore } from "../Store/AuthStore";
import ChatHeader from "./ChatHeader";
import {  Mail } from "lucide-react";
import '../index.css'
import DropdownMenu from "./Dropdown";
import { NotificationStore } from "../Store/NotificationStore";
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Updatemessage from "./Updatemessage"
const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    updatemessage,
  } = ChatStore();
  const [currentOpenDropdown, setOpenDropdown] = useState(null);

  const {subscribeToMNotification,unsubscribeFromNotification}= NotificationStore();
  const { authUser } = AuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    
    subscribeToMessages();
    subscribeToMNotification();
    return () => {unsubscribeFromMessages() , unsubscribeFromNotification()} ;

  }, [selectedUser._id, getMessages,unsubscribeFromMessages,subscribeToMessages]);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
   function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }


  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div id="chatcontainer" className="flex-1 overflow-y-auto p-4   space-y-4">
        {messages.map((message) => (
          
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            {message.senderId === authUser._id ? ( 
              <DropdownMenu key={message._id}
              messageId={message._id}  currentOpenDropdown={currentOpenDropdown}
              setOpenDropdown={setOpenDropdown}/>) 
 :''}
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
              
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
{updatemessage?<Updatemessage/>:<MessageInput />
}
    </div>
  );
};
export default ChatContainer;