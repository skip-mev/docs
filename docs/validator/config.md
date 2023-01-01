---
description: Validator Config Reference Docs
---

# Config

:::note
This page gives more detail about the purpose and meaning of the new config `mev-tendermint` adds in your node’s `config.toml` file

:::

| Name                  | Meaning                                                                                                                                                  | When to set                                                                                                                                                                                                                                             | Example value                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `api_key`             | Unique string Skip uses to ensure a node establishing a connection with our relay actually belongs to you                                                | On nodes that peer directly with Skip’s relayer (optional)                                                                                                                                                                                              | `2314ajinashg2389jfjap`                                                             |
| `relayer_peer_string` | Tendermint connection string (p2pid@ip:port ) for the Skip relayer that allows your node to peer with Skip                                               | On nodes that peer directly with Skip’s relayer (optional)                                                                                                                                                                                              | `d1463b730c6e0dcea59db726836aeaff13a8119f@chain-id-sentinel.skip.money:26656`       |
| `relayer_rpc_string`  | Address of Skip RPC where your node registers (Should include “http://” prefix) to tell Skip’s relayer it’s live and ready to receive bundles            | On nodes that peer directly with Skip’s relayer (optional)                                                                                                                                                                                              | `http://chain-id-api.skip.money`                                                    |
| `personal_peer_ids`   | Comma-separated of Tendermint P2P node ids where your node should gossip transactions (Set to validator node on sentries, and sentry nodes on validator) | <ul><li>On validators / private nodes when they can only receive transactions from your sentries</li><li>On sentry nodes when they need to relay transactions to other a private node or validator for them to reach the validator (optional)</li></ul> | `557611c7a7307ce023a7d13486b570282521296d,5740acbf39a9ae59953801fe4997421b6736e091` |

## Example Config

```toml
# EXAMPLE below (please use the correct values)
[sidecar]
api_key = "2314ajinashg2389jfjap"
relayer_peer_string = "d1463b730c6e0dcea59db726836aeaff13a8119f@chain-id-sentinel.skip.money:26656"
relayer_rpc_string = "http://chain-id-api.skip.money"
personal_peer_ids = "557611c7a7307ce023a7d13486b570282521296d,5740acbf39a9ae59953801fe4997421b6736e091"
```
