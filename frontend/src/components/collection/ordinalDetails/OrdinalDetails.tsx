import ordinal from "@/images/ordinal.svg";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LoaderIcon } from "lucide-react";
import { TraitsTable } from "./TraitsTable";
import { RedeemButton } from "./RedeemButton";
import { PurchaseButton } from "./PurchaseButton";
import { TokenInfo } from "@/lib/types";

interface OrdinalDetailsProps {
    showOrdinal: TokenInfo;
}

export function OrdinalDetails({ showOrdinal }: OrdinalDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpen = () => !isLoading && setIsOpen(!isOpen);
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
                {showOrdinal.name}
            </div>
            <DialogContent
                hideCloseButton={isLoading}
                className="max-w-[90%] max-h-[90%] md:min-w-[800px] md:max-w-[1000px] overflow-auto"
            >
                {isLoading ? (
                    <div className="mx-auto">
                        <LoaderIcon className="animate-spin" />
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>{showOrdinal.name}</DialogTitle>
                            <DialogDescription />
                        </DialogHeader>
                        <div className="flex gap-8 min-h-96 flex-col md:flex-row">
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
                                <PurchaseButton
                                    showOrdinal={showOrdinal}
                                    setIsLoading={setIsLoading}
                                    handleOpen={handleOpen}
                                />
                                <RedeemButton
                                    showOrdinal={showOrdinal}
                                    setIsLoading={setIsLoading}
                                    handleOpen={handleOpen}
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
