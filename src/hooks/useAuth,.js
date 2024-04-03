import { create } from "zustand";

const useAuthStore = create((set) => ({
  fullName: "",
  email: "",
  id: "",
  setUserName: (name) => set({ fullName: name }),
  setUserEmail: (email) => set({ lastName: email }),
  setId: (userId) => set({ id: userId }),
  logout: () => set({ id: "", fullName: "", email: "" }),
}));

export default useAuthStore;
