import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import collectionCover from "@/images/pizzaninja.gif";
import { Stat } from "./Stat";
import { CollectionButton } from "../CollectionButton";
import { MintDialog } from "./MintDialog";

export function CollectionInfo() {
    return (
        <Card className="m-8">
            <CardHeader>
                <CardTitle>Pizza Ninjas</CardTitle>
                <CardDescription>
                    View any Ninja in full size to reveal the secret menu.
                    Featured in Sotheby's.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-16">
                    <img
                        src={collectionCover}
                        alt="Pizza Ninjas"
                        className="w-32 h-32 rounded-lg"
                    />
                    <div className="grid grid-cols-4 gap-4">
                        <Stat heading="Total Supply" amount="1,500" />
                        <Stat heading="Owners" amount="1,234" />
                        <Stat heading="Price" amount="0.15 BTC" />
                        <Stat heading="24H Volume" amount="0.15 BTC" />

                        <Stat heading="W-Pizza Ninja Balance" amount="2" />
                        <Stat
                            heading="Number of Bridged Pizza Ninjas"
                            amount="1,234"
                            className="col-span-3"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
                <TooltipProvider>
                    <MintDialog />
                    <CollectionButton
                        buttonText="Burn"
                        tooltipText="Burn W-Pizza Ninja to get back your Pizza Ninja"
                    />
                    <CollectionButton
                        buttonText="Add LP"
                        tooltipText="Provide liquidity to the W-Pizza Ninja pool"
                    />
                </TooltipProvider>
            </CardFooter>
        </Card>
    );
}
