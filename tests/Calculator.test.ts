import { TonClient } from "@tonclient/core";
import { libNode } from "@tonclient/lib-node";
import TonContract from "./utils/ton-contract";
import pkgSafeMultisigWallet from "../ton-packages/SafeMultisigWallet.package";
import pkgCalculator from "../ton-packages/Calculator.package";


const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
  
const NETWORK_MAP = {
  LOCAL: "http://0.0.0.0", // localhost
  DEVNET: "https://net.ton.dev",
  MAINNET: "https://main.ton.dev",
};
  
// https://github.com/tonlabs/tonos-se/tree/master/contracts/safe_multisig
const paramsMultisig = {
  address: '0:d5f5cfc4b52d2eb1bd9d3a8e51707872c7ce0c174facddd0e06ae5ffd17d2fcd',
  public: '99c84f920c299b5d80e4fcce2d2054b05466ec9df19532a688c10eb6dd8d6b33',
  secret: '73b60dc6a5b1d30a56a81ea85e0e453f6957dbfbeefb57325ca9f7be96d3fe1a',
};

const createClient = (url) => {
  TonClient.useBinaryLibrary(libNode);
  return new TonClient({
    network: {
      server_address: url,
    },
  });
};
  

describe("Calculator test", () => {
  let client: TonClient;
  let smcSafeMultisigWallet: TonContract;
  let smcCalculator: TonContract;

  before(async () => {
    client = createClient(NETWORK_MAP.LOCAL);
    smcSafeMultisigWallet = new TonContract({
      client,
      name: "SafeMultisigWallet",
      tonPackage: pkgSafeMultisigWallet,
      address: paramsMultisig.address,
      keys: {
        public: paramsMultisig.public,
        secret: paramsMultisig.secret,
      },
    });
  });

  it("deploy Calculator", async () => {
    const keys = await client.crypto.generate_random_sign_keys();
    smcCalculator = new TonContract({
      client,
      name: "Calculator",
      tonPackage: pkgCalculator,
      keys,
    });

    await smcCalculator.calcAddress();

    await smcSafeMultisigWallet.call({
      functionName: "sendTransaction",
      input: {
        dest: smcCalculator.address,
        value: 1_000_000_000,
        bounce: false,
        flags: 2,
        payload: "",
      },
    });

    await smcCalculator.deploy({
      input: {},
    });
  });

  // it("yet another test", async () => {
  // });
});
