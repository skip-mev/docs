---
description: Chain Configuration
sidebar_position: 3
---
# Chain Configuration

:::tip
All of this information is available and can be accessed programmatically on [github.com/skip-mev/config](http://github.com/skip-mev/config) (Using Github’s raw user content download capabilities)
:::

## Mainnets

| Chain name | Chain ID | Supported Chain Version(s) | relayer_rpc_string (for vals + searchers) | relayer_peer_string (for vals) | MEV-tendermint Version (for vals) | AuctionHouse Address (for searchers) |
| --- | --- | --- | --- | --- | --- | --- |
| JUNO Mainnet | juno-1 | v11.0.3 v11.0.0 | `http://juno-1-api.skip.money` | `8dd5dfefe8959f7186e6c80bdb87dbd919534677@juno-1-sentinel.skip.money:26656` | v0.34.21-mev.12 | juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4 |
| EVMOS Mainnet | evmos_9001-2 | v9.1.0 | `http://evmos_9001-2-api.skip.money` | `c0a2990e2a5dad7f4ace044d2f936de6891c6f0a@evmos_9001-2-sentinel.skip.money:26656` | v0.34.22-mev.12 | evmos17yqtnk08ly94lgz3fzagfu2twsws33z7cpkxa2 |
| Terra 2 Mainnet | phoenix-1 | v2.1.4 | `http://phoenix-1-api.skip.money` | `20a61f70d93af978a3bc1d6be634a57918934f79@phoenix-1-sentinel.skip.money:26656` | v0.34.21-terra.1-mev.13 | terra1d5fzv2y8fpdax4u2nnzrn5uf9ghyu5sxr865uy |

## Testnets

| Chain name | Chain ID | Version Supported | relayer_rpc_string (for vals + searchers) | relayer_peer_string (for vals) | MEV-tendermint Version (for vals) | AuctionHouse Address (for searchers) |
| --- | --- | --- | --- | --- | --- | --- |
| JUNO Testnet | uni-5 | v11.0.0-alpha | `http://uni-5-api.skip.money` | `f18d6e226545b348aa37c86cc735d0620838fcd8@uni-5-sentinel.skip.money:26656` | v0.34.21-mev.13 | juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4 |
| EVMOS Testnet | evmos_9000-4 | v10.0.0-rc4 | `http://evmos_9000-4-api.skip.money` | `4d8990908ae5cbe7783192c0364db4a90af56dbc@evmos_9000-4-sentinel.skip.money:26656` | v0.34.24-mev.13 | evmos17yqtnk08ly94lgz3fzagfu2twsws33z7cpkxa2 |
| Injective Testnet | injective-888 | v1.8  | `http://inective-888-api.skip.money` | `24b0ca5c32b1c90fe7e373075de1d94ddf94c0b3@injective-888-sentinel.skip.money:26656` | v0.34.23-mev.12 | inj1mwj9kxxxuflr233pulfk037lr55jv680wy5sm4 |
| Terra 2 Testnet | pisco-1 | v2.2.0 | `http://pisco-1-api.skip.money` | `5cc5e6506818a113387d92e0b60a7206845b4d7e@pisco-1-sentinel.skip.money:26656` | v0.34.21-terra.1-mev.13 | terra1d5fzv2y8fpdax4u2nnzrn5uf9ghyu5sxr865uy |

:::note
**Peering with Skip if you’re not a validator: **
You should not expect to receive any advantage searching if you peer with Skip’s node. The node will not gossip transactions or bundles to you under any circumstances — either from the chain’s public mempool or from the Skip auction.

:::

