import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CollectionButton } from "../CollectionButton";
import { useState } from "react";
import ordinal from "@/images/ordinal.svg";
import { LoaderIcon } from "lucide-react";

export function MintDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ownedOrdinals = ["1", "2", "3"];

    const handleOpen = () => !isLoading && setIsOpen(!isOpen);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const selectedOrdinal = formData.get("ordinal") as string;
        console.log(selectedOrdinal);
        setIsLoading(true);
        // TODO: Mint W-Pizza Ninja
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpen}>
            <CollectionButton
                buttonText="Mint"
                tooltipText="Convert your Pizza Ninja to an W-Pizza Ninja"
                handleOpen={handleOpen}
            />
            <DialogContent hideCloseButton={isLoading}>
                {isLoading ? (
                    <div className="mx-auto">
                        <LoaderIcon className="animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Mint W-Pizza Ninja</DialogTitle>
                            <DialogDescription>
                                Your Pizza Ninja (ERC1155) will be converted to
                                a W-Pizza Ninja (ERC20) that can be traded on
                                exchanges.
                            </DialogDescription>
                        </DialogHeader>
                        <RadioGroup
                            defaultValue="1"
                            className="grid grid-cols-3 gap-4 my-6"
                            name="ordinal"
                        >
                            {ownedOrdinals.map((item) => (
                                <div>
                                    <RadioGroupItem
                                        value={item}
                                        id={item}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={item}
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-4 cursor-pointer"
                                    >
                                        <img
                                            src={ordinal}
                                            className="rounded"
                                        />
                                        Pizza Ninja #{item}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <DialogFooter>
                            <Button type="submit">Confirm</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
