import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TokenInfo } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function tokensInfoToOwnedOrdinals(
    tokensInfoArray: any,
    erc1155Balance: readonly bigint[] | undefined
) {
    const tokensInfoMapped = tokensInfoArray?.map(
        (res: { result: unknown }, index: number) => ({
            ...(res.result as unknown as object),
            id: erc1155Balance?.[index],
        })
    ) as unknown as TokenInfo[] | undefined;
    return tokensInfoMapped?.filter(
        (token) => token.balance.balance > BigInt(0)
    );
}
