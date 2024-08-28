import Logo from "@/components/ui/logo";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";

export default function Navbar(): JSX.Element {
    return (
        <nav className="sticky top-4 flex items-center justify-between py-3 px-5 rounded-full mt-4 max-w-[1200px] w-[90%] bg-gray-600/20 backdrop-blur-lg">
            <div className="flex gap-2">
                <div className="flex items-center space-x-4 lg:space-x-0">
                    <SheetMenu />
                </div>
                <Link to="/">
                    <Logo className="w-[150px] h-[50px]" />
                </Link>
            </div>
            <ConnectButton
                showBalance={false}
                chainStatus={{ smallScreen: "none", largeScreen: "icon" }}
            />
        </nav>
    );
}
