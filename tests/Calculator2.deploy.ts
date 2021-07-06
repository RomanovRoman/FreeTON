import { predictAddress, deploy, TDeployParams } from '../utils/deploy';
import { IMultisigWallet } from '../wrappers/multisig';
import pkgCalculator2 from '../ton-packages/Calculator2.package';

import type { KeyPair, TonClient } from '@tonclient/core';
import type { TAddress } from '../types';


export
const deployCalculator2 = async (
  client: TonClient,
  wallet: IMultisigWallet,
  keys: KeyPair,
) => {
  const deployParams: TDeployParams = {
    keys,
    tonPackage: pkgCalculator2,
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
