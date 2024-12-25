import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../configue/axios";
import { AuthStore } from "./AuthStore";
export const ChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  updatemessage: false,
  messagevaluefroupdate: '',
  isMessagesLoading: false,
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  getMessageforupdate: (messageid) => {
    const message = get().messages.find(el => el._id == messageid)
    if (message) {
      set({ updatemessage: true })
      set({ messagevaluefroupdate: message })

    }
  },
  Messageupdatecancel: () => {
    set({ updatemessage: false })



  },
  updateMessage: async (messageId, updatedMessageValue) => {
    try {
      const res = await axiosInstance.put('/messages/update', {
        messageId,
        updatedMessageValue,
      });

      if (res.data.newmessage) {
        const updatedMessages = get().messages.map((message) =>
          message._id === messageId ? { ...message, text: res.data.newmessage.text } : message
        );

        set({ messages: updatedMessages, updatemessage: false, messagevaluefroupdate: "" });
       
      }


    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating message");
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data], updatemessage: false, messagevaluefroupdate: "" });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  deleteMessage: async (messageId) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.delete(`/messages/delete/${selectedUser._id}`, { data: { messageId } });
      set({ messages: res.data })

    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = AuthStore.getState().socket;

    socket.off("newMessage"); 
    socket.off("messageDeleted");

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId === selectedUser._id) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }
    });

    socket.on("messageDeleted", (messageId) => {
      set((state) => ({
        messages: state.messages.filter((message) => message._id !== messageId),
      }));
    });
    socket.on("messageUpdate", (updatedMessage) => {
      set((state) => ({
        messages: state.messages.map((message) =>
          message._id === updatedMessage._id ? updatedMessage : message
      ),
      }));

    });
  },

  unsubscribeFromdeleteMessages: () => {
    const socket = AuthStore.getState().socket;
    socket.off("messageDeleted");

  },
  subscribeFromdeleteMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = AuthStore.getState().socket;



    socket.on("messageDeleted", (messageId) => {
      set({
        messages: get().messages.filter((message) => message._id !== messageId),
      });
    });

  },
  unsubscribeFromMessages: () => {
    const socket = AuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("messageUpdate");

  },
}));