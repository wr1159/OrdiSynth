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
                    31337: "0x10855D02C07758d7A9F822d2F15a41f228eC81Dc",
                },
                OrdiSynth: {
                    31337: "0x2142B5F919A67fa421d118D626A9Ee889D4a5422",
                },
            },
        }),
    ],
});
