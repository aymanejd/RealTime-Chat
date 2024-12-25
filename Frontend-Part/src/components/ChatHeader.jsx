import { X } from "lucide-react";
import { AuthStore } from "../Store/AuthStore";
import { ChatStore } from "../Store/ChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = ChatStore();
  const { onlineUsers } = AuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
             
            </div>
          </div>

          <div >
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p style={{marginRight:"66%"}} className={onlineUsers.includes(selectedUser._id) ? "text-green-500 ":"text-sm text-base-content/70"}>
           
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;