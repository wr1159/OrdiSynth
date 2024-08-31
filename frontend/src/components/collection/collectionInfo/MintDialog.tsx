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
import { useChainId, useWriteContract } from "wagmi";
import {
    erc1155Abi,
    mockErc1155Address,
    ordiSynthAbi,
    ordiSynthAddress,
} from "@/generated";
import { useToast } from "@/components/ui/use-toast";
import { batchBalanceToId } from "@/lib/utils";

interface MintDialogProps {
    erc1155Balance?: readonly bigint[];
    isApproved: boolean;
}

export function MintDialog({ erc1155Balance, isApproved }: MintDialogProps) {
    const { toast } = useToast();
    const chainId = useChainId();
    const { writeContractAsync } = useWriteContract();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrdinal, setSelectedOrdinal] = useState("");
    const ownedOrdinals = batchBalanceToId(erc1155Balance);

    const handleOpen = () => !isLoading && setIsOpen(!isOpen);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!isApproved) {
                await writeContractAsync({
                    abi: erc1155Abi,
                    address:
                        mockErc1155Address[
                            chainId as keyof typeof mockErc1155Address
                        ],
                    functionName: "setApprovalForAll",
                    args: [
                        ordiSynthAddress[
                            chainId as keyof typeof ordiSynthAddress
                        ],
                        true,
                    ],
                });
            }

            await writeContractAsync({
                abi: ordiSynthAbi,
                address:
                    ordiSynthAddress[chainId as keyof typeof ordiSynthAddress],
                functionName: "depositForSynth",
                args: [
                    mockErc1155Address[
                        chainId as keyof typeof mockErc1155Address
                    ],
                    BigInt(selectedOrdinal),
                    BigInt(1),
                ],
            });

            toast({
                title: "Success",
                description: `Minted 1 W-Pizza Ninja with Pizza Ninja #${selectedOrdinal}`,
            });
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                });
            }
        } finally {
            setIsLoading(false);
            handleOpen();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpen}>
            <CollectionButton
                buttonText="Mint"
                tooltipText="Convert your Pizza Ninja to an W-Pizza Ninja"
                handleOpen={handleOpen}
            />
            <DialogContent
                hideCloseButton={isLoading}
                className="max-w-[90%] md:max-w-[700px]"
            >
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
                            className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6"
                            name="ordinal"
                        >
                            {ownedOrdinals ? (
                                ownedOrdinals.map((item) => (
                                    <div
                                        key={item}
                                        onClick={() => setSelectedOrdinal(item)}
                                    >
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
                                                className="rounded w-24 h-24"
                                            />
                                            Pizza Ninja #{item}
                                        </Label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">
                                    You don't own any Pizza Ninjas
                                </p>
                            )}
                        </RadioGroup>
                        <DialogFooter>
                            <Button type="submit" disabled={!selectedOrdinal}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
