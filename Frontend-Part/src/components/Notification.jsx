import React, { useEffect, useState } from "react";
import { NotificationStore } from "../Store/NotificationStore";
import axios from "axios";
import { ChatStore } from "../Store/ChatStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { AuthStore } from "../Store/AuthStore";
import { axiosInstance } from "../configue/axios";
import { useLocation ,useNavigate } from "react-router-dom"; 

const Notifications = () => {
  const { notificationget, notificationdata, notificationread } = NotificationStore();
  const { authUser } = AuthStore();
  const [shownotification, setshownotification] = useState(false);
    const { setSelectedUser } = ChatStore();
  
    const location = useLocation(); 
    const navigate = useNavigate();
    useEffect(() => {
      notificationdata
    notificationget(authUser?._id);
  }, []);
 const readnotif= async(notifiid,userdenderid)=>{
    try {
      const userId=userdenderid;

      if (location.pathname==='/profile'){
        navigate('/');
      }
      const response = await axiosInstance.post(`/notifications/getuser/${userId}`);
      notificationread(notifiid);
      setshownotification(!shownotification)
      setSelectedUser(response.data)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  ;
 }
  return (
    <div className="relative">
      <button className="relative" onClick={() => setshownotification(!shownotification)}>
        <FontAwesomeIcon icon={faBell} className="text-xl" />

        {Array.isArray(notificationdata) && notificationdata.some(n => !n.isRead) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      {shownotification && <div id="notif" className="  absolute right-0 mt-2 bg-base-100 shadow-lg rounded-lg w-80 max-h-80 overflow-auto z-50">
        <ul className="divide-y divide-gray-200">
          {Array.isArray(notificationdata) && notificationdata.length ? (
            notificationdata.map((notification) => (
              <li key={notification._id} onClick={()=>readnotif(notification._id, notification.senderId)} className={`cursor-pointer p-4 ${
                !notification.isRead ? "bg-primary/10" : ""
              } hover:bg-primary/20 transition-colors duration-200`}>
                <p className="text-sm font-medium">{notification.message}         <span className=" text-primary">{notification.senderName ? notification.senderName : 'Unknown Sender'}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}                </p>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">
              No notifications
            </li>
          )}
        </ul>
      </div>}

    </div>
  );

};

export default Notifications;
