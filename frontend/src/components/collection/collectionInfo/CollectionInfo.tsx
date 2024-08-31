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
import { useAccount, useChainId, useReadContract } from "wagmi";
import {
    erc1155SupplyAbi,
    mockErc1155Address,
    ordiSynthAbi,
    ordiSynthAddress,
} from "@/generated";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { AddLiquidityDialog } from "./AddLiquidityDialog";
import { iUniswapV2Router02Abi } from "@/generated";
import { UNISWAP_ROUTER_ADDRESS, WETH_ADDRESS } from "@/lib/constants";

interface CollectionInfoProps {
    totalSupply: bigint;
}

export function CollectionInfo({ totalSupply }: CollectionInfoProps) {
    const chainId = useChainId();
    const account = useAccount();

    const { data: erc1155Balance } = useReadContract({
        abi: erc1155SupplyAbi,
        functionName: "balanceOfBatch",
        address: mockErc1155Address[chainId as keyof typeof mockErc1155Address],
        args: [
            Array.from(
                { length: Number(totalSupply) },
                () => account.address || "0x"
            ),
            Array.from({ length: Number(totalSupply) }, (_, i) => BigInt(i)),
        ],
        query: { enabled: !!account.address, refetchInterval: 10000 },
    });

    const { data: isApproved } = useReadContract({
        abi: erc1155SupplyAbi,
        functionName: "isApprovedForAll",
        address: mockErc1155Address[chainId as keyof typeof mockErc1155Address],
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
        args: [mockErc1155Address[chainId as keyof typeof mockErc1155Address]],
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
        functionName: "getAmountsOut",
        address: UNISWAP_ROUTER_ADDRESS,
        args: [parseUnits("1", 18), [synthAddress || "0x", WETH_ADDRESS]],
        query: { enabled: !!synthAddress, refetchInterval: 10000 },
    });

    const price = pricePath?.[1] && formatUnits(pricePath[1], 18);

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
                        <Stat
                            heading="Total Supply"
                            amount={totalSupply?.toString()}
                        />
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
                                    amount={erc1155Balance
                                        ?.reduce(
                                            (acc, curr) => acc + Number(curr),
                                            0
                                        )
                                        .toString()}
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
                        erc1155Balance={erc1155Balance}
                        isApproved={!!isApproved}
                    />
                    <AddLiquidityDialog
                        erc1155Balance={erc1155Balance}
                        isApproved={!!isApproved}
                        synthAddress={synthAddress || "0x"}
                    />
                </TooltipProvider>
            </CardFooter>
        </Card>
    );
}
