import { create } from "zustand";
import { axiosInstance } from "../configue/axios";
import { AuthStore } from "./AuthStore";
import { ChatStore } from "./ChatStore";


export const NotificationStore = create((set, get) => ({
  notificationdata: [],
  isgettingNotification: false,
 

  notificationget: async (userId) => {
    try {
      const res = await axiosInstance.get(`/notifications/get/${userId}`);
      set({ isgettingNotification: true });

      set({ notificationdata: res.data });
    } catch (error) {
      console.log("Error in Authacheck:", error);
    } finally {
        set({ isgettingNotification: false });
    }
  },
  notificationread: async (notificationId) => {
    try {
      await axiosInstance.post('/notifications/read',{notificationId});
      set({ isgettingNotification: true });

      set((state) => ({
        notificationdata: state.notificationdata.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        ),
      }));      
    } catch (error) {
      console.log("Error in Authacheck:", error);
    } finally {
        set({ isgettingNotification: false });
    }
  },
subscribeToMNotification: () => {
    const  selectedUser = ChatStore.getState().selectedUser;
    if (!selectedUser) return;
    const socket = AuthStore.getState().socket;
    socket.on("newNotification", (newNotification) => {
     set({
        notificationdata: [...get().notificationdata, newNotification],
      });
    });
  },
  unsubscribeFromNotification: () => {
    const socket = AuthStore.getState().socket;
    socket.off("newNotification");
  },
}))