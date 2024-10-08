import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";
import path from "path";

export default defineConfig({
    out: "src/generated.ts",
    contracts: [],
    plugins: [
        hardhat({
            project: path.resolve(__dirname, "../contracts"),
            deployments: {
                RuneToken: {
                    31: "0xF4A48a6DbCfC9547A1661cF8B5762d2A7451AeE5",
                    31337: "0x6d041EF9096F7013d27fF7a41c17971201499879",
                },
                OrdiSynth: {
                    31: "0x6d601b3a60Ec0a08e61dC7084C7EDAa457E77476",
                    31337: "0x2142B5F919A67fa421d118D626A9Ee889D4a5422",
                },
            },
        }),
    ],
});
