import {
    LucideIcon,
    User,
    Image,
    ArrowLeftRight,
    Workflow,
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/",
                    label: "Profile",
                    active: false,
                    icon: User,
                    submenus: [],
                },
                {
                    href: "/",
                    label: "Collections",
                    active: pathname === "/",
                    icon: Image,
                    submenus: [],
                },
                {
                    href: "https://www.sushi.com/swap?chainId=30",
                    label: "Swap",
                    active: false,
                    icon: ArrowLeftRight,
                    submenus: [],
                },
                {
                    href: "https://github.com/rsksmart/rsk-runes",
                    label: "Bridge",
                    active: false,
                    icon: Workflow,
                    submenus: [],
                },
                {
                    href: "test",
                    label: "Test",
                    active: pathname === "/test",
                    icon: User,
                    submenus: [],
                },
            ],
        },
    ];
}
