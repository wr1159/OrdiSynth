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
import { useChainId, useReadContract, useWriteContract } from "wagmi";
import {
    erc1155Abi,
    iUniswapV2FactoryAbi,
    iUniswapV2PairAbi,
    runeTokenAddress,
    ordiSynthAbi,
    ordiSynthAddress,
} from "@/generated";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { formatUnits, parseUnits } from "viem";
import { UNISWAP_FACTORY_ADDRESS, WETH_ADDRESS } from "@/lib/constants";
import { TokenInfo } from "@/lib/types";

interface AddLiquidityDialogProps {
    ownedOrdinals?: TokenInfo[];
    isApproved: boolean;
    synthAddress: `0x${string}`;
}

export function AddLiquidityDialog({
    ownedOrdinals,
    isApproved,
    synthAddress,
}: AddLiquidityDialogProps) {
    const { toast } = useToast();
    const chainId = useChainId();
    const { writeContractAsync } = useWriteContract();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrdinal, setSelectedOrdinal] = useState<bigint>();
    const [btcAmount, setBtcAmount] = useState("");

    const handleOpen = () => {
        if (isLoading) return;
        setIsOpen(!isOpen);
        setSelectedOrdinal(undefined);
    };

    const { data: pairAddress } = useReadContract({
        abi: iUniswapV2FactoryAbi,
        functionName: "getPair",
        address: UNISWAP_FACTORY_ADDRESS,
        args: [WETH_ADDRESS, synthAddress],
    });

    const { data: reserves } = useReadContract({
        abi: iUniswapV2PairAbi,
        functionName: "getReserves",
        address: pairAddress,
    });

    let btcNeeded: number | undefined;
    if (reserves) {
        const [btcReserveWei, synthReserveWei] = reserves;
        const btcReserve = parseFloat(formatUnits(btcReserveWei, 18));
        const synthReserve = parseFloat(formatUnits(synthReserveWei, 18));
        btcNeeded = btcReserve / synthReserve;
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!selectedOrdinal) return;
            if (!isApproved) {
                await writeContractAsync({
                    abi: erc1155Abi,
                    address:
                        runeTokenAddress[
                            chainId as keyof typeof runeTokenAddress
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
                functionName: "addLiquidityToRouter",
                args: [
                    runeTokenAddress[chainId as keyof typeof runeTokenAddress],
                    selectedOrdinal,
                    BigInt(1),
                ],
                value:
                    (btcNeeded && parseUnits(btcNeeded.toString(), 18)) ||
                    parseUnits(btcAmount, 18),
            });

            toast({
                title: "Success",
                description: `You have successfully added liquidity to the pool`,
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
                buttonText="Add LP"
                tooltipText="Provide liquidity to the W-Pizza Ninja pool"
                onClick={handleOpen}
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
                            <DialogTitle>Add Liquidity</DialogTitle>
                            <DialogDescription>
                                Deposit your Pizza Ninja (ERC1155) and RBTC to
                                provide liquidity
                            </DialogDescription>
                        </DialogHeader>

                        {ownedOrdinals ? (
                            <>
                                <RadioGroup
                                    defaultValue="1"
                                    className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6 max-h-[400px] overflow-y-auto"
                                    name="ordinal"
                                >
                                    {ownedOrdinals.map(({ id, name }) => (
                                        <div
                                            key={id}
                                            onClick={() =>
                                                setSelectedOrdinal(id)
                                            }
                                        >
                                            <RadioGroupItem
                                                value={name}
                                                id={name}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={name}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-4 cursor-pointer"
                                            >
                                                <img
                                                    src={ordinal}
                                                    className="rounded w-24 h-24"
                                                />
                                                {name}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                <Input
                                    placeholder="Enter amount"
                                    className="mb-6"
                                    required
                                    defaultValue={btcNeeded}
                                    disabled={!!btcNeeded}
                                    onChange={(e) =>
                                        setBtcAmount(e.target.value)
                                    }
                                />
                            </>
                        ) : (
                            <p className="text-center my-8">
                                You don't own any Pizza Ninjas
                            </p>
                        )}
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={
                                    !selectedOrdinal ||
                                    !(btcNeeded || btcAmount)
                                }
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
