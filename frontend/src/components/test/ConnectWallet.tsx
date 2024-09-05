import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useChainId, useSwitchChain } from "wagmi";
import { rsktestnet } from "@/lib/utils/RootstockTestnet";
import { Check } from "lucide-react";

export function ConnectWallet() {
    const { switchChain } = useSwitchChain();
    const chainId = useChainId();
    const rskChainId = rsktestnet.id;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Connect to RSK Testnet</CardTitle>
                <CardDescription>
                    Connect your wallet to the RSK Testnet to interact with
                    OrdiSynth
                </CardDescription>
            </CardHeader>
            <CardContent className="flex aspect-square items-center justify-center p-6 h-[500px] w-full gap-4">
                {chainId === rskChainId ? (
                    <>
                        <Check />
                        Connected to RSK Testnet
                    </>
                ) : (
                    <Button
                        onClick={() => switchChain({ chainId: rskChainId })}
                    >
                        Connect to RSK Testnet
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
