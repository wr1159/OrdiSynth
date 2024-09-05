import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";

export function Claim() {
    const account = useAccount();
    const { data } = useBalance({ address: account.address });

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Claim TRBTC</CardTitle>
                <CardDescription>Claim TRBTC from the faucet</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col aspect-square items-center justify-center p-6 h-[500px] w-full">
                <a href="https://faucet.rootstock.io/" target="_blank">
                    <Button>Claim TRBTC</Button>
                </a>
                <p className="mt-4 text-center">
                    Your TRBTC balance:{" "}
                    {formatUnits(data?.value || BigInt(0), 18)} TRBTC
                </p>
            </CardContent>
        </Card>
    );
}
