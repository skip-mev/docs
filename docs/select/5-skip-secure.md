---
description: Skip Secure
title: Skip Secure
sidebar_position: 5
---

# Skip Secure

Skip Secure is a private transaction system that enables users, frontends, and blockchain clients to submit transactions without exposing them to the public mempool. Skip Secure supports submitting transactions over [Cosmos-SDK REST Server / LCD](https://docs.cosmos.network/main/core/grpc_rest#rest-server) and [Tendermint RPC](https://docs.cosmos.network/main/core/grpc_rest#tendermint-rpc)

## Skip Secure Functionality

- Transactions submitted to the Skip Secure endpoints are sent directly to the Skip Sentinel, which privately holds the transaction for up to 5 minutes.
- Each time the proposer of a block is a Skip validator, the Sentinel attempts to privately broadcast the transaction only to that validator through the Skip Select sidecar (not the normal mempool).
  This means that even if the proposer does not include the transaction in their block, they do not gossip the transaction to other nodes in the chain.
- If the transaction is included in a block OR the transaction has been held by the Sentinel for 5 minutes, the transaction expires and the Sentinel no longer attempts to broadcast the transaction.

<iframe className="video" src="https://www.youtube.com/embed/GDxaLOljqyo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## How To Use Skip Secure RPC

### Developers

- Skip Secure RPC can be invoked in two ways:

  - Calling the regular transaction broadcast methods on the Tendermint RPC (`broadcast_tx_sync`, `broadcast_tx_async`) provided by the Skip Sentinel -- [Documented here](https://docs.tendermint.com/v0.34/rpc/)
    ```bash
    curl -X POST --data '{"jsonrpc":"2.0","method":"broadcast_tx_sync","params":["<base64_encoded_tx_hash>"],"id":1}' -H "Content-Type: application/json" http://pisco-1-api.skip.money/
    ```
  - Calling the the Cosmos-SDK REST server / LCD broadcast tx method (`POST /cosmos/tx/v1beta1/txs`) -- [Documented here](https://docs.figment.io/api-reference/node-api/cosmos-lcd/#/txs)
    ```bash
    curl -X POST "http://pisco-1-lcd.skip.money/cosmos/tx/v1beta1/txs" -H "accept: application/json" -H "Content-Type: application/json" -d '{ "tx": { "msg": [ "string" ], "fee": { "gas": "5000", "amount": [ { "denom\": "uluna", "amount": "50" } ] }, "memo": "memo_here", "signature": { "signature": "MEUCIQD02fsDPra8MtbRsyB1w7bqTM55Wu138zQbFcWx4+CFyAIge5WNPfKIuvzBZ69MyqHsqD8S1IwiEp+iUb6VSdtlpgY=", "pub_key": { "type": "tendermint/PubKeySecp256k1", "value": "Avz04VhtKJh8ACCVzlI8aTosGy0ikFXKIVHQ3jKMrosH" }, "account_number": "0", "sequence": "0" } }, "mode": "sync", "sequences": [ "1" ], "fee_granter": "terra1wg2mlrxdmnnkkykgqg4znky86nyrtc45q336yv"}'
    ```

- Please find the Skip Sentinel's RPC and Cosmos-SDK REST / LCD endpoints [here](/docs/select/3-chain-configuration.md)
- Transactions sent through Skip Secure RPC **MUST** have the `memo` field of the transaction exactly equal to the sender address.
- For convenience, the `skipjs` and `skip-py` libraries also expose helper functions for developers to easily integrate with Skip Secure.
  For example usage, see the [skipjs GitHub Repo](https://github.com/skip-mev/skipjs) and [skip-py GitHub Repo](https://github.com/skip-mev/skip-py).

### Wallet Users

Skip Secure can be used directly with Keplr wallet, Terra Station, and other wallets by changing the wallet's LCD endpoint to the Skip Sentinel LCD endpoint.

After this configuration, all transactions sent by the wallet:

- Will be routed privately through Skip Secure
- **MUST** have the transaction `memo` field set exactly to the sender address.

:::tip Sentinel LCD Endpoints
You can find the Sentinel LCD endpoints for all chains Skip Secure supports in [this table](/docs/select/3-chain-configuration.md) under the column labeled "Skip Sentinel Cosmos-SDK REST / LCD for Skip Secure".
:::

#### Keplr

- Navigate to **Settings -> Endpoints**
- Replace the LCD endpoint with the corresponding Sentinel LCD endpoint for the chain used
- Transactions you send **MUST** have the transaction `memo` field set exactly to the sender address

<iframe className="video" src="https://www.youtube.com/embed/-MnIJlP0bC0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
