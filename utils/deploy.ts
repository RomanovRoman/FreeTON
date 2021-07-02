import { Abi, CallSet, DeploySet, ParamsOfEncodeMessage, Signer } from '@tonclient/core';

import type {
  KeyPair,
  TonClient,
  TAddress,
} from '../types';


const signerExternal: Signer = {
  type: "External",
  public_key: '0000000000000000000000000000000000000000000000000000000000000000',
};

export type TDeployParams = {
  keys: KeyPair;
  tonPackage: any;
  initialData?: any;
  input?: any;
};

const buildEncodeMessageParams = ({
  keys,
  tonPackage,
  initialData,
  input,
}: TDeployParams): ParamsOfEncodeMessage => {
  const _keys = keys || undefined;
  const signer: Signer = _keys ? { type: 'Keys', keys: _keys } : signerExternal;
  const abi: Abi = { type: 'Contract', value: tonPackage.abi };
  const deploy_set: DeploySet = { tvc: tonPackage.image, initial_data: initialData || {} };
  const call_set: CallSet = { function_name: "constructor", input: input || {} };

  const params: ParamsOfEncodeMessage = { abi, signer, deploy_set, call_set };
  return params;
};

export
const predictAddress = async (
  client: TonClient,
  deployParams: TDeployParams,
): Promise<TAddress> => {
  const params = buildEncodeMessageParams(deployParams);
  const deployMsg = await client.abi.encode_message(params);
  return deployMsg.address;
};

export
const deploy = async (
  client: TonClient,
  deployParams: TDeployParams,
) => {
  const message_encode_params = buildEncodeMessageParams(deployParams);
  try {
    return client.processing.process_message({
      message_encode_params,
      send_events: false,
    });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
