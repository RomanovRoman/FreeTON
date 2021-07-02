import { libNode } from "@tonclient/lib-node";
import { TonClient } from "@tonclient/core";

export
const createClient = (server_address: string): TonClient => {
  TonClient.useBinaryLibrary(libNode);
  return new TonClient({ network: { server_address }});
};
