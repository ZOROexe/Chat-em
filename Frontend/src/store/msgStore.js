import { create } from "zustand";
import { axiosInstance } from "../lib/axiosConfig";
import { useAuth } from "./authStore.js";
import toast from "react-hot-toast";

export const useMsgStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isGettingUsers: false,
  isGettingMessages: false,

  getUsers: async () => {
    set({ isGettingUsers: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingUsers: false });
    }
  },
  getMessages: async (userId) => {
    set({ isGettingMessages: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingMessages: false });
    }
  },
  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log("Error in msgStore");
      toast.error(error.response.data.message);
    }
  },

  connectToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuth.getState().socket;
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  disconnectFromMessages: () => {
    const socket = useAuth.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}));
