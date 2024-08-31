# OrdiSynth

Ordisynth is a Ordinal synthetic market based on Rootstock.

## Directory Structure

This monorepo contains the smart contracts and frontend code for our project.

- The `frontend` folder contains code from [rootstock wagmi starter kit](https://github.com/rsksmart/rsk-wagmi-starter-kit)
- The `contracts` folder contains code from [rootstock hardhat starter kit](https://github.com/rsksmart/rootstock-hardhat-starterkit/tree/main)

### Frontend
Before starting the frontend, make sure you have the smart contracts deployed on your local network. You can do this by following the instructions in the `contracts` folder.

Generate the ABI and address files for the smart contracts by running the following command:
    
```bash
npm run generate-contract
```
