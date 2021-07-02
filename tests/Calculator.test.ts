import { expect } from 'chai';

import { configs, networks } from '../configs';
import { createClient } from '../utils/create-client';
import { predictAddress, deploy, TDeployParams } from '../utils/deploy';
import { runMethod } from '../utils/contract';
import { IMultisigWallet, MultisigWalletWrapper } from '../wrappers/multisig';

import pkgCalculator from '../ton-packages/Calculator.package';

import type { KeyPair, TonClient } from '@tonclient/core';
import type { TAddress } from '../types';


describe("Calculator tests", () => {
  let client: TonClient;
  let wallet: IMultisigWallet;
  let addrCalculator: TAddress;
  let keys: KeyPair;

  before(async () => {
    const config = configs[networks.LOCAL];
    client = createClient(config.url);
    wallet = new MultisigWalletWrapper(client, config.multisig);
    keys = await client.crypto.generate_random_sign_keys();
  });

  it("deploy Calculator", async () => {
    const deployParams: TDeployParams = {
      keys,
      tonPackage: pkgCalculator,
    };

    addrCalculator = await predictAddress(client, deployParams);

    await wallet.sendTransaction({
      dest: addrCalculator,
      value: 1_000_000_000,
      bounce: false,
    })

    await deploy(client, deployParams);
  });

  const { abi } = pkgCalculator;

  describe("addition", () => {

    const runAddition = async (x, y) =>
      runMethod(client, abi, addrCalculator, 'addition', { x, y });

    it("should calculate 2 + 3 as 5", async () => {
      const result = await runAddition(2, 3);
      const { value0 } = result.value;
      expect(+value0).to.equal(5);
    });

    it("should not calculate a + b", async () => {
      try {
        await runAddition('a', 'b');
      } catch (ex) {
        expect(ex).to
        .be.an.instanceOf(Error).and
        .have.property('code', 306);
      }
    });
  });

  describe("subtraction", () => {

    const runSubtraction = async (x, y) =>
      runMethod(client, abi, addrCalculator, 'subtraction', { x, y });

    it("should calculate 5 - 3 as 2", async () => {
      const result = await runSubtraction(5, 3);
      const { value0 } = result.value;
      expect(+value0).eq(2);
    });

    it("should not calculate a - 5", async () => {
      try {
        await runSubtraction('a', 3);
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
