import { runeTokenAbi, runeTokenAddress, ordiSynthAddress } from "@/generated";
import { CollectionInfo } from "./collectionInfo/CollectionInfo";
import { OrdinalDetails } from "./ordinalDetails/OrdinalDetails";
import { useChainId, useReadContract, useReadContracts } from "wagmi";
import { tokensInfoToOwnedOrdinals } from "@/lib/utils";

export function Collection() {
    const chainId = useChainId();

    const runeTokenContract = {
        address: runeTokenAddress[chainId as keyof typeof runeTokenAddress],
        abi: runeTokenAbi,
    };
    const ordiSynthAddressResolved =
        ordiSynthAddress[chainId as keyof typeof ordiSynthAddress];

    const { data: erc1155Balance } = useReadContract({
        ...runeTokenContract,
        functionName: "getUserTokens",
        args: [ordiSynthAddressResolved],
        query: { refetchInterval: 10000 },
    });

    const { data: tokensInfoArray } = useReadContracts({
        contracts: erc1155Balance?.map((id) => ({
            ...runeTokenContract,
            functionName: "getTokenInfo",
            args: [id, ordiSynthAddressResolved],
        })),
        query: { refetchInterval: 10000 },
    });

    const ordinalsInLp = tokensInfoToOwnedOrdinals(
        tokensInfoArray,
        erc1155Balance
    );

    return (
        <div className="w-full max-w-[1400px]">
            <CollectionInfo />
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 m-8">
                {ordinalsInLp?.map((item) => (
                    <OrdinalDetails showOrdinal={item} key={item.id} />
                ))}
            </div>
        </div>
    );
}
