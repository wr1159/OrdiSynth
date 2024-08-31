import { CollectionButton } from "../CollectionButton";
import { useToast } from "@/components/ui/use-toast";
import {
    useAccount,
    useChainId,
    useReadContract,
    useWriteContract,
} from "wagmi";
import {
    mockErc1155Address,
    ordiSynthAbi,
    ordiSynthAddress,
} from "@/generated";
import { erc20Abi, parseUnits } from "viem";

interface RedeemButtonProps {
    showOrdinal: string;
    setIsLoading: (isLoading: boolean) => void;
    handleOpen: () => void;
}

export function RedeemButton({
    showOrdinal,
    setIsLoading,
    handleOpen,
}: RedeemButtonProps) {
    const { toast } = useToast();
    const chainId = useChainId();
    const account = useAccount();
    const { writeContractAsync } = useWriteContract();

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

    const { data: erc20Allowance } = useReadContract({
        abi: erc20Abi,
        address: synthAddress,
        functionName: "allowance",
        args: [
            account.address || "0x",
            ordiSynthAddress[chainId as keyof typeof ordiSynthAddress],
        ],
        query: { enabled: !!account.address },
    });

    const redeem = async () => {
        setIsLoading(true);
        try {
            if (erc20Allowance == undefined || !synthAddress) return;
            if (erc20Allowance < BigInt(1)) {
                await writeContractAsync({
                    abi: erc20Abi,
                    address: synthAddress,
                    functionName: "approve",
                    args: [
                        ordiSynthAddress[
                            chainId as keyof typeof ordiSynthAddress
                        ],
                        parseUnits("1", 18),
                    ],
                });
            }

            await writeContractAsync({
                abi: ordiSynthAbi,
                address:
                    ordiSynthAddress[chainId as keyof typeof ordiSynthAddress],
                functionName: "redeemSynth",
                args: [
                    mockErc1155Address[
                        chainId as keyof typeof mockErc1155Address
                    ],
                    BigInt(showOrdinal),
                    BigInt(1),
                ],
            });
            toast({
                title: "Success",
                description: `Redeemed 1 W-Pizza Ninja to get Pizza Ninja #${showOrdinal}`,
            });
        } catch (error) {
            console.log(error);
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
        <CollectionButton
            buttonText="Redeem"
            tooltipText="Redeem 1 W-Pizza Ninja to get this Pizza Ninja"
            buttonProps={{
                className: "w-full",
                disabled: !synthBalance || synthBalance < BigInt(1),
            }}
            onClick={redeem}
        />
    );
}
