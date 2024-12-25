import { ChatStore } from "../Store/ChatStore";

import Sidebar from "../components/Sidebar";
import Userheaderbar from "../components/userheaderbar";

import NoChatSelected from "../components/NoChatSelected.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import '../index.css'

const HomePage = () => {
  const { selectedUser } = ChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div  id="homechat"className="flex items-center justify-center  pt-20 sm:px-0 px-4 ">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className=" md:hidden lg:hidden">
          <Userheaderbar />
          </div>
          <div className="flex h-full rounded-lg overflow-hidden">
          <div className=" hidden md:block lg:block">
          <Sidebar />
          </div>

            {!selectedUser ? (<NoChatSelected />) : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;