import { Bell, Home, LogOut, Search, User } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose, AiFillHome, AiOutlineSearch, AiOutlineUser, AiFillBell, AiOutlineLogout } from "react-icons/ai";
import { useAuth } from "@clerk/nextjs";
import useUsersStore, { UsersStoreType } from "@/store/users";
import Logo from '../../../../public/images/logo.png';
import Image from "next/image";

const NavbarItems = () => {

    const iconSize = 16;
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const { signOut } = useAuth();

    const { loggedInUserData }: UsersStoreType = useUsersStore();

    const menuItems = [
        {
            //name: "Home",
            icon: <AiFillHome size={iconSize} />,
            path: "/",
            isActive: pathname === "/",
        },
        {
            //name: "Profile",
            icon: <AiOutlineUser size={iconSize} />,
            path: `/profile/${loggedInUserData?._id}`,
            isActive: pathname === `/profile/${params.id}`,
        },
        {
            //name: "Notifications",
            icon: <AiFillBell size={iconSize} />,
            path: "/notifications",
            isActive: pathname === "/notifications",
        },
        {
            name: "Logout",
            icon: <AiOutlineLogout size={iconSize} />,
            path: "/logout",
        },
    ];

    const handleLogout = async () => {
        await signOut();
        router.push("/sign-in");
    };

    return (
        <div className='bg-white shadow-sm w-full fixed'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-15'>
                    <div className='flex items-center'>
                        <Link href="/">
                            <Image src={Logo} alt="logo" height={45} className="cursor-pointer" priority />
                        </Link>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <span><AiOutlineSearch size={25} /></span>
                        <span>Search component</span>
                    </div>
                    <div>
                        <div>
                            <div className='ml-4 flex items-center'>
                                {menuItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer px-3 py-2 flex gap-[5px] items-center ${item.isActive && "bg-primary text-white rounded-sm"}`}
                                        onClick={() => {
                                            if (item.name === "Logout") {
                                                handleLogout();
                                            } else {
                                                router.push(item.path);
                                            }
                                        }}
                                    >
                                        {item.icon}
                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavbarItems;