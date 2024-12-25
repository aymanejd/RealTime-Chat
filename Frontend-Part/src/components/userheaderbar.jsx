import { useEffect, useState } from "react";
import { ChatStore } from "../Store/ChatStore";
import { AuthStore } from "../Store/AuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Userheaderbar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = ChatStore();
    const { onlineUsers } = AuthStore();

    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [showOnlineInput, setShowOnlineInput] = useState(true);
    const [filteredSearchUsers, setFilteredSearchUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filteredUsers = showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user._id))
        : users;

    const handleUserSearch = (e) => {

        const searchValue = e.target.value;
        setSearchTerm(searchValue);
        setShowOnlineInput(false);

        const matchingUsers = filteredUsers.filter((user) =>
            user.fullName.toLowerCase().startsWith(searchValue.toLowerCase())
        );

        if (matchingUsers.length > 0) {
            setFilteredSearchUsers(matchingUsers);
            setMessage("");
        } else {
            setFilteredSearchUsers([]);
            setMessage(`No users found with the name "${searchValue}".`);
        }
        if (searchValue.trim() === '') {
            setShowOnlineInput(true);
            return
        }
    };
    function setSelectedUserfunction(e) {
        setSearchTerm('');
        setShowOnlineInput(true);

        setFilteredSearchUsers([]);

        setSelectedUser(e);
    }
    if (isUsersLoading) return <SidebarSkeleton />;
    return (
        <header className="w-full bg-base-100 p-4 border-b border-base-300">
            <input
                type="text"
                style={{ marginTop: "12px" }}
                className="input input-bordered w-full pl-10"
                placeholder="Search For User"
                value={searchTerm}
                onChange={handleUserSearch}
            />{showOnlineInput && (
                <div className="mt-3 flex flex-col items-start   gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            onClick={()=>setFilteredSearchUsers([])}
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500 text-start" style={onlineUsers.length - 1 > 0 ? { color: "rgb(34 197 94)" } : {}}>({onlineUsers.length - 1} online)</span>
                </div>
            )}
            <h2 className="text-lg font-medium mb-3 text-start">Recents</h2>
            <div className="flex overflow-x-auto gap-4 pt-2 px-1">
                {message ? (<p className="text-center text-zinc-500 py-4 ">{message}</p>
                ) : (
                    (filteredSearchUsers.length > 0 ? filteredSearchUsers : filteredUsers).map((user) => (  <button
                        key={user._id}
                        onClick={() => setSelectedUserfunction(user)}
                        className="flex flex-col items-center"
                    >
                        <div className="relative" style={{ flexShrink: 0, maxWidth: "64px"}}>
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.fullName}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/avatar.png";
                                }}
                                style={{
                                    minWidth:"64px",
                                    maxWidth:"64px",
                                    minHeight:"64px"
                                    }}
                                loading="lazy"
                                className={` rounded-full object-cover ${selectedUser?._id === user._id ? "ring-2 ring-blue-500" : ""
                                    }`}
                            />

                            {onlineUsers.includes(user._id) && (
                                <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                            )}
                        </div>

                        <span className="mt-2 text-sm text-center font-medium">{user.fullName}</span>
                    </button>)

                    ))}
            </div>
        </header>
    );

};

export default Userheaderbar;
