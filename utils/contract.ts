import { ErrorWithCode } from '../errors';

import type {
  // KeyPair,
  TonClient,
  TAddress,
} from '../types';


const fetchBoc = async (
  client: TonClient,
  address: TAddress,
) => {
  let response
  try {
    response = await client.net.query_collection({
      collection: "accounts",
      filter: { id: { eq: address } },
      result: "boc data",
    });
  } catch (ex) {
    throw ex;
  }
  if (!response.result[0]) {
    throw new Error("account not found");
  }

  return response.result[0].boc;
};

export
const runMethod = async (
  client: TonClient,
  abi,
  address: TAddress,
  function_name: string,
  input = {},
) => {
  try {
    const { message } = await client.abi.encode_message({
      signer: { type: "None" },
      abi: { type: "Contract", value: abi },
      call_set: { function_name, input },
      address,
    });
    const account = await fetchBoc(client, address);
    const messageResult = await client.tvm.run_tvm({
      message,
      account,
      abi: { type: "Contract", value: abi },
    });
    // @ts-ignore
    return messageResult.decoded.out_messages[0] as DecodedMessageBody;
  } catch (err) {
    // console.error(err);
    const { code, message }: { code: number, message: string } = err;
    throw new ErrorWithCode(code, message);
  }
}

export
const buildCall = async (client, abi, function_name, input) => {
  try {
    const { body } = await client.abi.encode_message_body({
      abi: { type: "Contract", value: abi },
      signer: { type: "None" },
      is_internal: true,
      call_set: { function_name, input },
    });
    return body;
  } catch (ex) {
    const { code, message }: { code: number, message: string } = ex;
    throw new ErrorWithCode(code, message);
  }
}
