"use client";

import { Claim } from "@/components/test/Claim";
import { ConnectWallet } from "@/components/test/ConnectWallet";
import { MintOrdinal } from "@/components/test/MintOrdinal";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export function Test() {
    return (
        <>
            <Card className="w-full max-w-[1400px] m-8">
                <CardHeader>
                    <CardTitle>Testing Instructions</CardTitle>
                    <CardDescription>
                        This page will help you set up so that you can test in
                        the collections page
                    </CardDescription>
                </CardHeader>
            </Card>
            <Carousel className="w-3/4">
                <CarouselContent>
                    <CarouselItem>
                        <ConnectWallet />
                    </CarouselItem>
                    <CarouselItem>
                        <Claim />
                    </CarouselItem>
                    <CarouselItem>
                        <MintOrdinal />
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </>
    );
}
