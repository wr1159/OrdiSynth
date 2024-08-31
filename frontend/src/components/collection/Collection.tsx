import {
    erc1155SupplyAbi,
    mockErc1155Address,
    ordiSynthAddress,
} from "@/generated";
import { CollectionInfo } from "./collectionInfo/CollectionInfo";
import { OrdinalDetails } from "./ordinalDetails/OrdinalDetails";
import { useChainId, useReadContract } from "wagmi";
import { batchBalanceToId } from "@/lib/utils";

export function Collection() {
    const chainId = useChainId();

    const { data: totalSupply } = useReadContract({
        abi: erc1155SupplyAbi,
        functionName: "totalSupply",
        address: mockErc1155Address[chainId as keyof typeof mockErc1155Address],
    });

    const { data: ordinalsBatchBalance } = useReadContract({
        abi: erc1155SupplyAbi,
        functionName: "balanceOfBatch",
        address: mockErc1155Address[chainId as keyof typeof mockErc1155Address],
        args: [
            Array.from(
                { length: Number(totalSupply) },
                () => ordiSynthAddress[chainId as keyof typeof ordiSynthAddress]
            ),
            Array.from({ length: Number(totalSupply) }, (_, i) => BigInt(i)),
        ],
        query: { refetchInterval: 10000 },
    });

    const ordinalsInLp = batchBalanceToId(ordinalsBatchBalance);

    return (
        <div className="w-full max-w-[1400px]">
            <CollectionInfo totalSupply={totalSupply || BigInt(0)} />
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 m-8">
                {ordinalsInLp?.map((item) => (
                    <OrdinalDetails showOrdinal={item.toString()} key={item} />
                ))}
            </div>
        </div>
    );
}
