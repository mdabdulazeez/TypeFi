import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    somniaTestnet: {
      url: "https://dream-rpc.somnia.network/",
      chainId: 50312,
      accounts: {
        mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk"
      }
    }
  }
};
