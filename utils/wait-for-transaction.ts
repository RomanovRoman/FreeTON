
import { TonClient } from '../types';

export
const waitForTransaction = async (
  client: TonClient,
  filter: any,
  fields: string
) => {
  try {
    const { result } = await client.net.wait_for_collection({
      collection: "transactions",
      filter: filter,
      result: fields,
      timeout: 10000,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};
