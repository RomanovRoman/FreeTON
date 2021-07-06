import { predictAddress, deploy, TDeployParams } from '../utils/deploy';
import { IMultisigWallet } from '../wrappers/multisig';
import pkgCalculatorDebot2 from '../ton-packages/CalculatorDebot2.package';

import type { KeyPair, TonClient } from '@tonclient/core';
import type { TAddress } from '../types';


export
const deployCalculatorDebot2 = async (
  client: TonClient,
  wallet: IMultisigWallet,
  keys: KeyPair,
  addrCalculator: TAddress,
) => {
  const deployParams: TDeployParams = {
    keys,
    tonPackage: pkgCalculatorDebot2,
    input: { addrCalculator },
  };

  const address: TAddress = await predictAddress(client, deployParams);

  await wallet.sendTransaction({
    dest: address,
    value: 1_000_000_000,
    bounce: false,
  })

  await deploy(client, deployParams);

  // call CalculatorDebot.setABI(pkgCalculatorDebot.abi)
  const strAbi = JSON.stringify(pkgCalculatorDebot2.abi);
  const dabi = Buffer.from(strAbi, 'utf-8').toString('hex');
  await client.processing.process_message({
    message_encode_params: {
      abi: { type: "Contract", value: pkgCalculatorDebot2.abi },
      address,
      signer: { type: 'Keys', keys },
      call_set: { function_name: 'setABI', input: { dabi }},
    },
    send_events: true,
  });

  return address;
}
