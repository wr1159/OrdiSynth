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
import { MintDialog } from "./MintDialog";
import {
    useAccount,
    useChainId,
    useReadContract,
    useReadContracts,
} from "wagmi";
import {
    runeTokenAbi,
    runeTokenAddress,
    ordiSynthAbi,
    ordiSynthAddress,
} from "@/generated";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { AddLiquidityDialog } from "./AddLiquidityDialog";
import { iUniswapV2Router02Abi } from "@/generated";
import { UNISWAP_ROUTER_ADDRESS, WETH_ADDRESS } from "@/lib/constants";
import { tokensInfoToOwnedOrdinals } from "@/lib/utils";

export function CollectionInfo() {
    const chainId = useChainId();
    const account = useAccount();

    const runeTokenContract = {
        address: runeTokenAddress[chainId as keyof typeof runeTokenAddress],
        abi: runeTokenAbi,
    };

    const { data: erc1155Balance } = useReadContract({
        ...runeTokenContract,
        functionName: "getUserTokens",
        args: [account.address || "0x"],
        query: { enabled: !!account.address, refetchInterval: 10000 },
    });

    const { data: tokensInfoArray } = useReadContracts({
        contracts: erc1155Balance?.map((id) => ({
            ...runeTokenContract,
            functionName: "getTokenInfo",
            args: [id, account.address || "0x"],
        })),
        query: { enabled: !!account.address, refetchInterval: 10000 },
    });

    const ownedOrdinals = tokensInfoToOwnedOrdinals(
        tokensInfoArray,
        erc1155Balance
    );

    const { data: isApproved } = useReadContract({
        ...runeTokenContract,
        functionName: "isApprovedForAll",
        args: [
            account.address || "0x",
            ordiSynthAddress[chainId as keyof typeof ordiSynthAddress],
        ],
        query: { enabled: !!account.address },
    });

    const { data: synthAddress } = useReadContract({
        abi: ordiSynthAbi,
        functionName: "synthAddressByContractAddress",
        address: ordiSynthAddress[chainId as keyof typeof ordiSynthAddress],
        args: [runeTokenAddress[chainId as keyof typeof runeTokenAddress]],
    });

    const { data: synthBalance } = useReadContract({
        abi: erc20Abi,
        functionName: "balanceOf",
        address: synthAddress,
        args: [account.address || "0x"],
        query: { enabled: !!account.address, refetchInterval: 10000 },
    });

    const { data: pricePath } = useReadContract({
        abi: iUniswapV2Router02Abi,
        functionName: "getAmountsIn",
        address: UNISWAP_ROUTER_ADDRESS,
        args: [parseUnits("1", 18), [WETH_ADDRESS, synthAddress || "0x"]],
        query: { enabled: !!synthAddress, refetchInterval: 10000 },
    });

    const price = pricePath?.[0] && formatUnits(pricePath[0], 18);

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
                <div className="flex gap-4 md:gap-16 flex-col md:flex-row items-center">
                    <img
                        src={collectionCover}
                        alt="Pizza Ninjas"
                        className="w-48 h-48 rounded-lg"
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Stat heading="Owners" amount="1,234" />
                        <Stat
                            heading="Price"
                            amount={`${
                                price
                                    ? parseFloat(price.toString()).toPrecision(
                                          5
                                      ) + " RBTC"
                                    : "-"
                            }`}
                        />
                        <Stat heading="24H Volume" amount="0.15 RBTC" />
                        {account.address && (
                            <>
                                <Stat
                                    heading="W-Pizza Ninja Balance"
                                    amount={formatUnits(
                                        synthBalance || BigInt(0),
                                        18
                                    )}
                                    className="col-span-2"
                                />
                                <Stat
                                    heading="Number of Bridged Pizza Ninjas"
                                    amount={ownedOrdinals?.length || 0}
                                    className="col-span-2"
                                />
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
                <TooltipProvider>
                    <MintDialog
                        ownedOrdinals={ownedOrdinals}
                        isApproved={!!isApproved}
                    />
                    <AddLiquidityDialog
                        ownedOrdinals={ownedOrdinals}
                        isApproved={!!isApproved}
                        synthAddress={synthAddress || "0x"}
                    />
                </TooltipProvider>
            </CardFooter>
        </Card>
    );
}
