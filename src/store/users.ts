
import { create } from "zustand";

//create hook useUsersStore
const useUsersStore = create((set: any) => ({
    loggedInUserData: null,
    setLoggedInUserData: (data: UserType) => set({ loggedInUserData: data }),
    currentProfile: null,
    setCurrentProfile: (data: UserType) => set({ currentProfile: data }),
})) as any;

export default useUsersStore;

export interface UsersStoreType {
    loggedInUserData: UserType | null;
    setLoggedInUserData: (data: UserType) => void;
    currentProfile: UserType | null;
    setCurrentProfile: (data: UserType) => void;
}
