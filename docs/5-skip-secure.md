---
description: Skip Secure
title: Skip Secure
sidebar_position: 5
---

# Skip Secure

Skip Secure is a private transaction system that enables users, frontends, and blockchain clients to submit transactions without exposing them to the public mempool.

## How Skip Secure Works

Skip Secure exposes a single RPC method that allows submission of a single transaction.

Transactions submitted to the Skip Secure endpoint are sent directly to the Skip Sentinel, which privately holds the transaction for up to 5 minutes.
Each time the proposer of a block is a Skip validator, the Sentinel attempts to privately broadcast the transaction only to that validator through the Skip Select sidecar (not the normal mempool).
This means that even if the proposer does not include the transaction in their block, they do not gossip the transaction to other nodes in the chain.
If the transaction is included in a block OR the transaction has been held by the Sentinel for 5 minutes, the transaction expires and the Sentinel no longer attempts to broadcast the transaction.

## How To Use Skip Secure

Skip Secure exposes an RPC function, `send_secure_transaction`, with the same signature as the native Tendermint transaction broadcast methods.

Transactions sent through Skip Secure **MUST** have the `memo` field of the transaction exactly equal to the sender address. This is to prevent abuse, by enforcing that transactions sent through Skip Secure must have been created with the express intent of being sent through Skip Secure.

RPC method calls can be sent directly via the command line:

```
curl -X POST --data '{"jsonrpc":"2.0","method":"send_secure_transaction", "params":{"tx": <base64 encoded tx>} ,"id":1}'  -H "Content-Type: application/json" <Sentinel RPC URL>
```

For convenience, the `skipjs` and `skip-py` libraries also expose helper functions for developers to easily integrate with Skip Secure.
For example usage, see the [skipjs GitHub Repo](https://github.com/skip-mev/skipjs) and [skip-py GitHub Repo](https://github.com/skip-mev/skip-py).
