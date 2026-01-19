import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  messages: [],
  setMessages: (messages) => set({ messages }),

  chatUsers: [],
  setChatUsers: (users) => set({ chatUsers: users }),

  addOrMoveChatUser: (user) =>
    set((state) => {
      const filtered = state.chatUsers.filter(
        (u) => u._id !== user._id
      );
      return { chatUsers: [user, ...filtered] };
    }),
}));

export default useConversation;
