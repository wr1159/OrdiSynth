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
    mockErc1155Address,
    ordiSynthAbi,
    ordiSynthAddress,
} from "@/generated";
import { useToast } from "@/components/ui/use-toast";
import { batchBalanceToId } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatUnits, parseUnits } from "viem";
import { UNISWAP_FACTORY_ADDRESS, WETH_ADDRESS } from "@/lib/constants";

interface AddLiquidityDialogProps {
    erc1155Balance?: readonly bigint[];
    isApproved: boolean;
    synthAddress: `0x${string}`;
}

export function AddLiquidityDialog({
    erc1155Balance,
    isApproved,
    synthAddress,
}: AddLiquidityDialogProps) {
    const { toast } = useToast();
    const chainId = useChainId();
    const { writeContractAsync } = useWriteContract();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrdinal, setSelectedOrdinal] = useState("");
    const ownedOrdinals = batchBalanceToId(erc1155Balance);
    const [btcAmount, setBtcAmount] = useState("");

    const handleOpen = () => !isLoading && setIsOpen(!isOpen);

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
                functionName: "addLiquidityToRouter",
                args: [
                    mockErc1155Address[
                        chainId as keyof typeof mockErc1155Address
                    ],
                    BigInt(selectedOrdinal),
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
                        <RadioGroup
                            defaultValue="1"
                            className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6 max-h-[400px] overflow-y-auto"
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
                        <Input
                            placeholder="Enter amount"
                            className="mb-6"
                            required
                            defaultValue={btcNeeded}
                            disabled={!!btcNeeded}
                            onChange={(e) => setBtcAmount(e.target.value)}
                        />
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
