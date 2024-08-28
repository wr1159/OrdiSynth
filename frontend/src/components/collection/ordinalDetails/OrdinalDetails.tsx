import ordinal from "@/images/ordinal.svg";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LoaderIcon } from "lucide-react";
import { CollectionButton } from "../CollectionButton";
import { TraitsTable } from "./TraitsTable";

interface OrdinalDetailsProps {
    showOrdinal: string;
}

export function OrdinalDetails({ showOrdinal }: OrdinalDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpen = () => setIsOpen(!isOpen);
    const traits = [
        {
            name: "NINJALERTS HEAD",
            value: "Ninjalerts Head Black",
        },
        {
            name: "STOIC BODY",
            value: "Stoic Body Black",
        },
        {
            name: "NINJALERTS FACE",
            value: "Classic",
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={handleOpen}>
            <div
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground gap-4 cursor-pointer"
                onClick={handleOpen}
            >
                <img src={ordinal} className="rounded w-32" />
                Pizza Ninja #{showOrdinal}
            </div>
            <DialogContent
                hideCloseButton={isLoading}
                className="min-w-[800px]"
            >
                {isLoading ? (
                    <div className="mx-auto">
                        <LoaderIcon className="animate-spin" />
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>
                                Pizza Ninja #{showOrdinal}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-8 min-h-96">
                            <div className="flex gap-4 flex-col">
                                <img src={ordinal} className="rounded w-96" />
                                <div>
                                    <h4 className="font-semibold">Standard</h4>
                                    <p className="text-muted-foreground">
                                        ERC1155
                                    </p>
                                </div>
                            </div>
                            <div className="w-full flex gap-4 flex-col">
                                <div>
                                    <p className="text-2xl font-semibold">
                                        Price
                                    </p>
                                    <p className="text-muted-foreground">
                                        0.15 RBTC
                                    </p>
                                </div>
                                <CollectionButton
                                    buttonText="Purchase"
                                    tooltipText="Purchase this Pizza Ninja with RBTC"
                                    buttonClassName="w-full"
                                />
                                <CollectionButton
                                    buttonText="Redeem"
                                    tooltipText="Redeem 1 W-Pizza Ninja to get this Pizza Ninja"
                                    buttonClassName="w-full"
                                />
                                <TraitsTable traits={traits} />
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
