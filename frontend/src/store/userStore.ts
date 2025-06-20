// src/store/userStore.ts
import { create } from 'zustand';

type User = {
  email: string;
  token?: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const useUserStore = create<UserStore>((set) => ({
  user: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null,
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

export default useUserStore;
