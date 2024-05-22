import { useState } from "react";
import NarbarItems from "./navbar-items";
import { Menu } from "lucide-react";
import { Drawer } from "antd";
import SidebarItems from "./sidebar-items";

const Header = () => {
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    return (
        <div className="overflow-hidden">
            <div className="bg-primary px-5 py-2 lg:hidden">
                <Menu
                    size={24}
                    color="white"
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="cursor-pointer"
                />
                <Drawer
                    open={showMobileSidebar}
                    placement="left"
                    onClose={() => setShowMobileSidebar(false)}
                >
                    <SidebarItems />
                </Drawer>
            </div>
            <div className="hidden lg:flex justify-between h-15">
                <NarbarItems />
            </div>
        </div>

    )
}

export default Header;