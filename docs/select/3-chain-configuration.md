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

| Chain name      | Chain ID    | Supported Chain Version(s) | MEV-tendermint Version (for vals) | Skip Sentinel RPC (`sentinel_rpc_string`) for vals + searchers | `sentinel_peer_string` for vals                                                | Auction House Address (for searchers)            | Skip Sentinel Cosmos-SDK REST / LCD for Skip Secure |
| --------------- | ----------- | -------------------------- | --------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------- |
| Neutron Mainnet | `neutron-1` | v1.0.1                     | `v0.34.27-mev.18`                 | `https://neutron-1-api.skip.money`                             | `08a1653fd6669468f8b9c22d70f476a5b27f576a@neutron-1-sentinel.skip.money:26656` | `neutron123c2jmj5x2uxevjpwv9hllk37cnqsz4tjrn40g` | `https://neutron-1-lcd.skip.money`                  |

## Testnets

| Chain name      | Chain ID  | Version Supported | MEV-tendermint Version (for vals) | Skip Sentinel RPC (`sentinel_rpc_string`) for vals + searchers | `sentinel_peer_string` for vals                                              | Auction House Address (for searchers)            | Skip Sentinel Cosmos-SDK REST / LCD for Skip Secure |
| --------------- | --------- | ----------------- | --------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------- |
| Neutron Testnet | `pion-1`  | v1.0.0-rc1        | `v0.34.27-mev.18`                 | `https://pion-1-api.skip.money`                                | `f44aa4467a5c411f650fd9223644d70afc1eacd1@pion-1-sentinel.skip.money:26656`  | `neutron1ttpzgakdut0wx6erq2lvd5engrgesujzhuacal` | `https://pion-1-lcd.skip.money`                     |

:::caution Peering with Skip Sentinel
You should not expect to receive any advantage searching if you peer with Skip’s node. The node will not gossip transactions or bundles to you under any circumstances — either from the chain’s public mempool or from the Skip auction.
:::

:::caution Skip Sentinel Cosmos REST / LCD intended for Skip Secure users only
These should not be used by developers in production as a general-purpose LCD.
We expose the minimal set of endpoints required to support wallets and users of Skip Secure.
:::
