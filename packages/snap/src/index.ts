import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import {
  BIP44CoinTypeNode,
  getBIP44AddressKeyDeriver,
} from '@metamask/key-tree';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  // Get the Dogecoin node, corresponding to the path m/44'/3'
  const dogecoinNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 3,
    },
  });

  /**
   * Creates a function that takes an index and returns an extended private key for m/44'/3'/0'/0/address_index
   * The second parameter to getBIP44AddressKeyDeriver is not passed. This sets account and change to 0
   */
  const deriveDogecoinAddress = await getBIP44AddressKeyDeriver(
    dogecoinNode as BIP44CoinTypeNode, // TODO Check the type rather assume casting would work
  );
  const dogeAccount = await deriveDogecoinAddress(0);

  switch (request.method) {
    case 'hello':
      console.log(`Dogecoin address: ${dogeAccount.address}`);

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
