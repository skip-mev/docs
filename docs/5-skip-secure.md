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

## How To Use Skip Secure RPC

### For Developers

- Skip Secure RPC can be invoked in two ways: 
  - Calling the regular transaction broadcast methods on the Tendermint RPC provided by the Skip Sentinel -- [Documented here](https://docs.tendermint.com/v0.34/rpc/)
    EXAMPLE HERE
  - Calling the the Cosmos REST server broadcast tx method (`POST /cosmos/tx/v1beta1/txs`) -- [Documented here](https://docs.figment.io/api-reference/node-api/cosmos-lcd/#/txs)
    EXAMPLE HERE
- Please find Skip's RPC and Cosmos REST / LCD endpoints [here](3-chain-configuration.md)
- Transactions sent through Skip Secure RPC **MUST** have the `memo` field of the transaction exactly equal to the sender address.
- For convenience, the `skipjs` and `skip-py` libraries also expose helper functions for developers to easily integrate with Skip Secure.
  For example usage, see the [skipjs GitHub Repo](https://github.com/skip-mev/skipjs) and [skip-py GitHub Repo](https://github.com/skip-mev/skip-py).
