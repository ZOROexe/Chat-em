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
      await axiosInstance.put(`/messages/mark-as-read/${userId}`);

      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, hasUnreadMessages: false } : user
        ),
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingMessages: false });
    }
  },
  markMessageAsRead: async (userId) => {
    try {
      const { getUsers } = get();
      await axiosInstance.put(`/messages/mark-as-read/${userId}`);
      await getUsers();
    } catch (error) {
      console.error("Error in marking messages as read in frontend", error);
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
    const currUser = useAuth.getState().authUser;

    socket.on("newMessage", (newMessage) => {
      if (
        (newMessage.senderId === selectedUser._id &&
          newMessage.receiverId === currUser._id) ||
        (newMessage.senderId === currUser._id &&
          newMessage.receiverId === senderId)
      ) {
        set({ messages: [...messages, newMessage] });
      }

      set((state) => ({
        users: state.users.map((user) =>
          user._id === newMessage.senderId
            ? { ...user, hasUnreadMessages: true }
            : user
        ),
      }));
    });

    socket.on("messagesRead", ({ userId }) => {
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, hasUnreadMessages: false } : user
        ),
      }));
    });
  },

  disconnectFromMessages: () => {
    const socket = useAuth.getState().socket;
    socket.off("newMessage");
    socket.off("messagesRead");
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}));
