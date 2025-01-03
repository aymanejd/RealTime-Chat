
import { useRef, useState, useEffect } from "react";
import { ChatStore } from "../Store/ChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const Updatemessage = () => {
  const [message, setMessage] = useState("");
  const messageInputRef = useRef("");
  const { updateMessage, messagevaluefroupdate, Messageupdatecancel } = ChatStore();



  useEffect(() => {
    messageInputRef.current.value = messagevaluefroupdate.text;

    messageInputRef.current.focus();
  }, [])
  const Updatemessagestate = (e) => {
    if (e.trim() == "") Messageupdatecancel()
      else{
    setMessage(e)
    }
  }
  const handleupdatedMessage =  (e) => {
    e.preventDefault();
    if (message.trim() !== messagevaluefroupdate.text &&message.trim()!=="") {
        updateMessage(messagevaluefroupdate._id,message)
    }
    else {
      Messageupdatecancel()
    }

  };

  return (
    <div className="p-4 w-full">


      <form onSubmit={handleupdatedMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            ref={messageInputRef}
            onChange={(e) => Updatemessagestate(e.target.value)}
          />



        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle bg-primary/10 hover:bg-primary/20"

        >
          <FontAwesomeIcon icon={faCheck} />        </button>
      </form>
    </div>
  );
};
export default Updatemessage;
