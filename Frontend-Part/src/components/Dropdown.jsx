import React, { useState, useEffect, useRef } from "react";
import { ChatStore } from "../Store/ChatStore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";  // Import the edit and delete icons
import '../index.css'

const DropdownMenu = ({ messageId, receiverId, bubblerf, currentOpenDropdown, setOpenDropdown }) => {
    //const [isOpen, setIsOpen] = useState(false);
    const isOpen = currentOpenDropdown === messageId;
    const dropdownRef = useRef(null);
    const [rightOffset, setRightOffset] = useState(0);

    const {

        deleteMessage,
        subscribeToMessages,
        getMessageforupdate,
        unsubscribeFromMessages,
        updatemessage
    } = ChatStore();

    
    useEffect(() => {
        const updateOffset = () => {
            if (bubblerf.current) {
                setRightOffset(bubblerf.current.offsetWidth);
            }
        };

        updateOffset();

    }, [bubblerf.current?.offsetWidth]);


    useEffect(() => {

        subscribeToMessages();
        return () => { unsubscribeFromMessages() };

    }, [subscribeToMessages]);



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setOpenDropdown]);
    const toggleDropdown = () => {
        setOpenDropdown(isOpen ? null : messageId); // Close if already open, otherwise open
    }; const deletemessage = () => {
        deleteMessage(messageId)
        setOpenDropdown(null)
        subscribeToMessages()
    }
    if (updatemessage) return;
    return (
        (
            <div className="relative inline-block text-left" style={{ right: `${rightOffset}px` }} // Apply dynamic offset
                ref={dropdownRef}>
                <FontAwesomeIcon
                    onClick={toggleDropdown}
                    role="button"
                    className="cursor-pointer text-gray-600 hover:text-gray-900"
                    icon={faEllipsisVertical}
                />

                {isOpen && (
                    <div
                        className="absolute right-0 mb-20 w-40 bg-base-100 border-gray-300 rounded-md shadow-lg"
                        style={{ zIndex: 10 }}
                    >
                        <ul className="py-1">
                            <li>
                                <a
                                    className="block px-4 py-2 text-sm cursor-pointer text-gray-400 hover:bg-primary/10" onClick={() => { setOpenDropdown(null); getMessageforupdate(messageId) }}
                                >
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />

                                    Edit
                                </a>
                            </li>
                            <li>
                                <a
                                    style={{ color: "#f93a37" }}
                                    className="block px-4 py-2 cursor-pointer text-sm hover:bg-primary/10 " onClick={() => { document.getElementById('my_modal_1').showModal() }}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />

                                    UnSent

                                </a>
                                <dialog id="my_modal_1" className="modal">
                                    <div className="modal-box relative">
                                        <h3 className="font-bold text-lg sm:text-sm">Who do you want to unsend this message for?</h3>
                                        <p className="py-4 text-sm sm:text-xs">
                                            This message will be unsent for everyone in the chat.
                                            Unsent messages can't be included .
                                        </p>

                                        <div className="modal-action mt-4 flex justify-end space-x-3" >
                                            <form method="dialog" className="flex items-center space-x-3">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:bg-gray-200 focus:outline-none" onClick={() => setOpenDropdown(null)}>
                                                    ✕
                                                </button>

                                                <button className="btn bg-transparent  hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out" onClick={() => setOpenDropdown(null)}>
                                                    Cancel
                                                </button>
                                                <button onClick={() => deletemessage()} className="btn  btn-error hover:bg-red-600 hover:text-white transition duration-300 ease-in-out">
                                                    Remove
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                </dialog>
                            </li>
                        </ul>
                    </div>
                )}
            </div>


        )
    )
};

export default DropdownMenu;
