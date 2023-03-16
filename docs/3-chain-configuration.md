---
description: Chain Configuration
title: Chain Configuration Settings
sidebar_position: 3
---

# Chain Configuration

:::tip Config Github Repo

All of this information is available and can be accessed programmatically on <a hef="http://github.com/skip-mev/config" target="_blank">github.com/skip-mev/config</a> (Using Github’s raw user content download capabilities)
:::

## Mainnets

| Chain name        | Chain ID       | Supported Chain Version(s) | MEV-tendermint Version (for vals) | Skip Sentinel RPC (`sentinel_rpc_string`) for vals + searchers | `sentinel_peer_string` for vals                                                   | Auction House Address (for searchers)           | Skip Sentinel Cosmos-SDK REST / LCD for Skip Secure |
| ----------------- | -------------- | -------------------------- | --------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| JUNO Mainnet      | `juno-1`       | v13.0.0                    | `v0.34.26-mev.16`                 | `https://juno-1-api.skip.money`                                | `8dd5dfefe8959f7186e6c80bdb87dbd919534677@juno-1-sentinel.skip.money:26656`       | `juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4`   | `https://juno-1-lcd.skip.money`                     |
| Terra 2 Mainnet   | `phoenix-1`    | v2.1.4                     | `v0.34.21-terra.1-mev.16`         | `https://phoenix-1-api.skip.money`                             | `20a61f70d93af978a3bc1d6be634a57918934f79@phoenix-1-sentinel.skip.money:26656`    | `terra1d5fzv2y8fpdax4u2nnzrn5uf9ghyu5sxr865uy`  | `https://phoenix-1-lcd.skip.money`                  |
| EVMOS Mainnet     | `evmos_9001-2` | v11.0.1 v11.0.2            | `v0.34.26-mev.16`                 | `https://evmos-9001-2-api.skip.money`                          | `c0a2990e2a5dad7f4ace044d2f936de6891c6f0a@evmos-9001-2-sentinel.skip.money:26656` | `evmos17yqtnk08ly94lgz3fzagfu2twsws33z7cpkxa2`  | `https://evmos-9001-2-lcd.skip.money`               |
| Injective Mainnet | `injective-1`  | v1.10.0                    | `v0.34.23-mev.16`                 | `https://injective-1-api.skip.money`                           | `6f3b548716049d83ab701a1eddef56bd202c09db@injective-1-sentinel.skip.money:26656`  | `inj1mwj9kxxxuflr233pulfk037lr55jv680wy5sm4`    | `https://injective-1-lcd.skip.money`                |
| Comdex Mainnet    | `comdex-1`     | v7.0.0                     | `v0.34.22-mev.16`                 | `https://comdex-1-api.skip.money`                              | `79505b5fb2782acbea09059abde58e7bca76c8e1@comdex-1-sentinel.skip.money:26656`     | `comdex1ga2mjs4gxn8xudxmrrp8s2q35rqhg4xafnn5gr` | `https://comdex-1-lcd.skip.money`                   |

## Testnets

| Chain name        | Chain ID        | Version Supported | MEV-tendermint Version (for vals) | Skip Sentinel RPC (`sentinel_rpc_string`) for vals + searchers | `sentinel_peer_string` for vals                                                    | Auction House Address (for searchers)           | Skip Sentinel Cosmos-SDK REST / LCD for Skip Secure |
| ----------------- | --------------- | ----------------- | --------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| JUNO Testnet      | `uni-6`         | v13.0.0-beta.2    | `v0.34.26-mev.16`                 | `https://uni-6-api.skip.money`                                 | `f18d6e226545b348aa37c86cc735d0620838fcd8@uni-6-sentinel.skip.money:26656`         | `juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4`   | `https://uni-6-lcd.skip.money`                      |
| Terra 2 Testnet   | `pisco-1`       | v2.2.0            | `v0.34.21-terra.1-mev.16`         | `https://pisco-1-api.skip.money`                               | `5cc5e6506818a113387d92e0b60a7206845b4d7e@pisco-1-sentinel.skip.money:26656`       | `terra1d5fzv2y8fpdax4u2nnzrn5uf9ghyu5sxr865uy`  | `https://pisco-1-lcd.skip.money`                    |
| EVMOS Testnet     | `evmos_9000-4`  | v12.0.0-rc4       | `v0.34.24-mev.16`                 | `https://evmos-9000-4-api.skip.money`                          | `4d8990908ae5cbe7783192c0364db4a90af56dbc@evmos-9000-4-sentinel.skip.money:26656`  | `evmos17yqtnk08ly94lgz3fzagfu2twsws33z7cpkxa2`  | `https://evmos-9000-4-lcd.skip.money`               |
| Injective Testnet | `injective-888` | v1.10.2           | `v0.34.23-mev.16`                 | `https://inective-888-api.skip.money`                          | `24b0ca5c32b1c90fe7e373075de1d94ddf94c0b3@injective-888-sentinel.skip.money:26656` | `inj1mwj9kxxxuflr233pulfk037lr55jv680wy5sm4`    | `https://injective-888-lcd.skip.money`              |
| Comdex Testnet    | `comdex-test2`  | v9.0.0            | `v0.34.24-mev.16`                 | `https://comdex-test2-api.skip.money`                          | `0ef2b039f0f370be9c5f39924923e96ef94bc87f@comdex-test2-sentinel.skip.money:26656`  | `comdex1ga2mjs4gxn8xudxmrrp8s2q35rqhg4xafnn5gr` | `https://comdex-test2-lcd.skip.money`               |

:::caution Peering with Skip Sentinel
You should not expect to receive any advantage searching if you peer with Skip’s node. The node will not gossip transactions or bundles to you under any circumstances — either from the chain’s public mempool or from the Skip auction.
:::

:::caution Skip Sentinel Cosmos REST / LCD intended for Skip Secure users only
These should not be used by developers in production as a general-purpose LCD.
We expose the minimal set of endpoints required to support wallets and users of Skip Secure.
:::
