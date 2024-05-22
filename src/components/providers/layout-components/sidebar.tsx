import { useState } from 'react';
import MenuItems from '@/components/providers/layout-components/menu-items';
import { Menu } from 'lucide-react';
import { Drawer } from 'antd';

const Sidebar = () => {
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    return (
        <div className='overflow-hidden'>
            <div className='bg-primary px-5 py-2 lg:hidden'>
                <Menu
                    size={24}
                    color='white'
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className='cursor-pointer'
                />
                <Drawer
                    open={showMobileSidebar}
                    placement='left'
                    onClose={() => setShowMobileSidebar(false)}
                >
                    <MenuItems />
                </Drawer>
            </div>
            <div className='hidden lg:flex'>
                <MenuItems />
            </div>
        </div>

    )
}

export default Sidebar;