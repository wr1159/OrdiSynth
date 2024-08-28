"use client";

import { Collection } from "@/components/collection/Collection";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export function Home() {
    return (
        <TooltipProvider>
            <Collection />
        </TooltipProvider>
    );
}
