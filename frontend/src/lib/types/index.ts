export type StarterProps = {
    name: string;
    description: string;
    link: string;
};

export type Balance = {
    account: `0x${string}`;
    balance: bigint;
};

export type TokenInfo = {
    balance: Balance;
    currentSupply: bigint;
    defaultMintAmount: bigint;
    maxSupply: bigint;
    name: string;
    symbol: string;
    uri: string;
    id: bigint;
};
