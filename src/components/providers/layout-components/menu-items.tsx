import { Bell, Home, LogOut, Search, User } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import useUsersStore, { UsersStoreType } from '@/store/users';

const MenuItems = () => {

    const iconSize = 16;
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const { signOut } = useAuth();

    const { loggedInUserData }: UsersStoreType = useUsersStore();

    const menuItems = [
        {
            name: 'Home',
            icon: <Home size={iconSize} />,
            path: '/',
            isActive: pathname === '/',
        },
        {
            name: 'Search',
            icon: <Search size={iconSize} />,
            path: '/search',
            isActive: pathname === '/search',
        },
        {
            name: 'Profile',
            icon: <User size={iconSize} />,
            path: `/profile/${loggedInUserData?._id}`,
            isActive: pathname === `/profile/${params.id}`,
        },
        {
            name: 'Notifications',
            icon: <Bell size={iconSize} />,
            path: '/notifications',
            isActive: pathname === '/notifications',
        },
        {
            name: 'Logout',
            icon: <LogOut size={iconSize} />,
            path: '/logout',
        },
    ];

    const handleLogout = async () => {
        await signOut();
        router.push('/sign-in');
    };

    return (
        <div className='w-56 lg:h-screen lg:bg-secondary p-5'>
            <div className='mt-5 flex flex-col'>
                <span className='text-2xl font-bold text-primary'>
                    <b>BEINCOM</b>
                </span>
                <span className='text-sm text-gray-500'><b>{loggedInUserData?.name}</b></span>
            </div>
            <div className='mt-20 flex flex-col gap-7'>
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer px-5 py-2 flex gap-3 items-center
                        ${item.isActive && 'bg-primary text-white rounded-sm'}`}
                        onClick={() => {
                            if (item.name === 'Logout') {
                                handleLogout();
                            } else {
                                router.push(item.path);
                            }
                        }}
                    >
                        {item.icon}
                        <span className='text-sm'>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MenuItems;