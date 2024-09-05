import { useChainId, useReadContract, useWriteContract } from "wagmi";
import { CollectionButton } from "../CollectionButton";
import {
    iUniswapV2Router02Abi,
    runeTokenAddress,
    ordiSynthAbi,
    ordiSynthAddress,
} from "@/generated";
import { UNISWAP_ROUTER_ADDRESS, WETH_ADDRESS } from "@/lib/constants";
import { formatUnits, parseUnits } from "viem";
import { useToast } from "@/hooks/use-toast";
import { TokenInfo } from "@/lib/types";

interface PurchaseButtonProps {
    showOrdinal: TokenInfo;
    setIsLoading: (isLoading: boolean) => void;
    handleOpen: () => void;
}

export function PurchaseButton({
    showOrdinal,
    setIsLoading,
    handleOpen,
}: PurchaseButtonProps) {
    const { toast } = useToast();
    const chainId = useChainId();
    const { writeContractAsync } = useWriteContract();

    const { data: synthAddress } = useReadContract({
        abi: ordiSynthAbi,
        functionName: "synthAddressByContractAddress",
        address: ordiSynthAddress[chainId as keyof typeof ordiSynthAddress],
        args: [runeTokenAddress[chainId as keyof typeof runeTokenAddress]],
    });

    const { data: pricePath } = useReadContract({
        abi: iUniswapV2Router02Abi,
        functionName: "getAmountsIn",
        address: UNISWAP_ROUTER_ADDRESS,
        args: [parseUnits("1", 18), [WETH_ADDRESS, synthAddress || "0x"]],
        query: { enabled: !!synthAddress, refetchInterval: 10000 },
    });

    const price = pricePath?.[0] && formatUnits(pricePath[0], 18);

    const purchase = async () => {
        if (!price) return;
        setIsLoading(true);
        try {
            await writeContractAsync({
                abi: ordiSynthAbi,
                address:
                    ordiSynthAddress[chainId as keyof typeof ordiSynthAddress],
                functionName: "swapTokenForRune",
                args: [
                    runeTokenAddress[chainId as keyof typeof runeTokenAddress],
                    showOrdinal.id,
                    BigInt(1),
                ],
                value: parseUnits(price, 18),
            });
            toast({
                title: "Success",
                description: `Swapped ${price} RBTC for ${showOrdinal.name}`,
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

    if (price)
        return (
            <>
                <div>
                    <p className="text-2xl font-semibold">Price</p>
                    <p className="text-muted-foreground">
                        {parseFloat(price.toString()).toPrecision(5)} RBTC
                    </p>
                </div>
                <CollectionButton
                    buttonText="Purchase"
                    tooltipText="Purchase this Pizza Ninja with RBTC"
                    buttonProps={{ className: "w-full" }}
                    onClick={purchase}
                />
            </>
        );
}
