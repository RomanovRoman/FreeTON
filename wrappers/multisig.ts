import { ResultOfProcessMessage } from '@tonclient/core';
import { ErrorWithCode } from '../errors';
import pkgSafeMultisigWallet from '../ton-packages/SafeMultisigWallet.package';

import type {
  KeyPair,
  TonClient,
  TAddress,
} from '../types';

export enum MultisigWalletKind {
  SafeMultisigWallet = 'SafeMultisigWallet',
}

export
interface IMultisigWalletSendTransactionParams {
  dest: TAddress;
  value: number;
  bounce?: boolean;
  flags?: number;
  payload?: string;
}

export
interface IMultisigWallet {
  getAddress(): TAddress;
  sendTransaction(
    params: IMultisigWalletSendTransactionParams,
  ): Promise<ResultOfProcessMessage>;
}

export
interface IMultisigWalletParams {
  address: TAddress;
  keys: KeyPair;
}

const packages = {
  [MultisigWalletKind.SafeMultisigWallet]: pkgSafeMultisigWallet,
};

export
class MultisigWalletWrapper implements IMultisigWallet {
  private tonPackage;

  constructor(
    private client: TonClient,
    private params: IMultisigWalletParams,
    private kind: MultisigWalletKind = MultisigWalletKind.SafeMultisigWallet,
  ) {
    this.tonPackage = packages[this.kind];
  }

  public getAddress() {
    return this.params.address;
  }

  public async sendTransaction(
    params: IMultisigWalletSendTransactionParams,
  ): Promise<ResultOfProcessMessage> {
    const { dest, value, bounce, flags, payload } = params;
    const input = {
      dest,
      value,
      bounce: (bounce === false) ? false : true,
      flags: flags || 2,
      payload: payload || '',
    };
    return this.call('sendTransaction', input, this.params.keys);
  }

  private async call(
    function_name: string,
    input: any = {},
    keys: KeyPair,
  ): Promise<ResultOfProcessMessage> {
    try {
      return this.client.processing.process_message({
        message_encode_params: {
          abi: { type: "Contract", value: this.tonPackage.abi },
          address: this.params.address,
          signer: { type: 'Keys', keys },
          call_set: { function_name, input },
        },
        send_events: true,
      });
    } catch (err) {
      // console.error(err);
      const { code, message }: { code: number, message: string } = err;
      throw new ErrorWithCode(code, message);
    }
  }
}
