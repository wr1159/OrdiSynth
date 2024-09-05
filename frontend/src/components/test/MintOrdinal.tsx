import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
    useAccount,
    useChainId,
    useReadContract,
    useReadContracts,
    useWriteContract,
} from "wagmi";
import { runeTokenAbi, runeTokenAddress } from "@/generated";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";
import { tokensInfoToOwnedOrdinals } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function MintOrdinal() {
    const account = useAccount();
    const { writeContractAsync } = useWriteContract();
    const chainId = useChainId();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

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

    const name = `Pizza Ninjas #${Math.floor(Math.random() * 1500)}`;
    const symbol = "PizzaNinjas";
    const baseURI = "ipfs://base-uri/";
    const mintOrdinal = async () => {
        setIsLoading(true);
        if (!account.address) {
            toast({
                title: "Error",
                description: "Please connect your wallet",
            });
            return;
        }
        try {
            await writeContractAsync({
                abi: runeTokenAbi,
                address:
                    runeTokenAddress[chainId as keyof typeof runeTokenAddress],
                functionName: "mintNonFungible",
                args: [baseURI, name, symbol, account.address],
            });
            toast({
                title: "Success",
                description: `Minted a bridged Pizza Ninja with name: ${name}`,
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
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Mint Bridged Pizza Ninja</CardTitle>
                <CardDescription>
                    Mint a bridged Pizza Ninja on the RSK Testnet
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col aspect-square items-center justify-center p-6 h-[500px] w-full gap-4">
                {isLoading ? (
                    <div className="mx-auto">
                        <LoaderIcon className="animate-spin" />
                    </div>
                ) : (
                    <Button onClick={mintOrdinal}>
                        Mint Bridged Pizza Ninja
                    </Button>
                )}
                Number of Bridged Pizza Ninjas: {ownedOrdinals?.length || 0}
            </CardContent>
        </Card>
    );
}
