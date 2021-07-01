import { expect } from 'chai';

import { TonClient } from "@tonclient/core";
import { libNode } from "@tonclient/lib-node";
import TonContract from "./utils/ton-contract";
import pkgSafeMultisigWallet from "../ton-packages/SafeMultisigWallet.package";
import pkgCalculator from "../ton-packages/Calculator.package";


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
  

describe("Calculator tests", () => {
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

  describe("addition", () => {
    it("should calculate 2 + 3 as 5", async () => {
      const result = await smcCalculator.run({
        functionName: 'addition',
        input: {
          x: 2,
          y: 3,
        },
      });

      const { value0 } = result.value;

      expect(+value0).to.equal(5);
    });

    it("should not calculate a + b", async () => {
      try {
        await smcCalculator.run({
          functionName: 'addition',
          input: {
            x: 'a',
            y: 'b',
          },
        }); 
      } catch (ex) {
        expect(ex).to
        .be.an.instanceOf(Error).and
        .have.property('code', 306);  
      }
    });
  });


  describe("subtraction", () => {
    it("should calculate 5 - 3 as 2", async () => {
      const result = await smcCalculator.run({
        functionName: 'subtraction',
        input: {
          x: 5,
          y: 3,
        },
      });

      const { value0 } = result.value;

      expect(+value0).eq(2);
    });

    it("should not calculate a - 5", async () => {
      try {
        await smcCalculator.run({
          functionName: 'subtraction',
          input: {
            x: 'a',
            y: 5,
          },
        }); 
      } catch (ex) {
        expect(ex).to
        .be.an.instanceOf(Error).and
        .have.property('code', 306);  
      }
    });

  });

  // it("yet another test", async () => {
  // });
});
