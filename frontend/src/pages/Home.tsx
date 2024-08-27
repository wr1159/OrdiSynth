"use client";

import * as React from "react";
import { User, Image, ArrowLeftRight, Workflow } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidenav } from "@/components/Sidenav";

export function Home() {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const defaultLayout = [20, 80];

    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes: number[]) => {
                    document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
                        sizes
                    )}`;
                }}
                className="grow items-stretch"
            >
                <ResizablePanel
                    defaultSize={defaultLayout[0]}
                    collapsible={true}
                    minSize={15}
                    maxSize={20}
                    onCollapse={() => {
                        setIsCollapsed(true);
                        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                            true
                        )}`;
                    }}
                    onResize={() => {
                        setIsCollapsed(false);
                        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                            false
                        )}`;
                    }}
                    className={cn(
                        isCollapsed &&
                            "min-w-[50px] transition-all duration-300 ease-in-out"
                    )}
                >
                    <Sidenav
                        isCollapsed={isCollapsed}
                        links={[
                            {
                                title: "Profile",
                                label: "",
                                icon: User,
                                variant: "ghost",
                            },
                            {
                                title: "Collections",
                                label: "",
                                icon: Image,
                                variant: "default",
                            },
                            {
                                title: "Swap",
                                label: "",
                                icon: ArrowLeftRight,
                                variant: "ghost",
                            },
                            {
                                title: "Bridge",
                                label: "",
                                icon: Workflow,
                                variant: "ghost",
                            },
                        ]}
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                    Ordinal Page
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    );
}
