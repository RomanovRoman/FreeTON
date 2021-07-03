import { predictAddress, deploy, TDeployParams } from '../utils/deploy';
import { IMultisigWallet } from '../wrappers/multisig';
import pkgCalculator from '../ton-packages/Calculator.package';

import type { KeyPair, TonClient } from '@tonclient/core';
import type { TAddress } from '../types';


export
const deployCalculator = async (
  client: TonClient,
  wallet: IMultisigWallet,
  keys: KeyPair,
) => {
  const deployParams: TDeployParams = {
    keys,
    tonPackage: pkgCalculator,
  };

  const address: TAddress = await predictAddress(client, deployParams);

  await wallet.sendTransaction({
    dest: address,
    value: 1_000_000_000,
    bounce: false,
  })

  await deploy(client, deployParams);

  return address;
}
