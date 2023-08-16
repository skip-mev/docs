---
description: MEV Lane
title: 2️⃣ MEV Lane
sidebar_position: 1
---

:::info TLDR

The `MEV Lane` hosts top of block auctions in protocol and verifiably builds blocks with top-of-block block space reserved for auction winners, with auction revenue being redistributed to chains.

:::

### 💰 Overview

Blockspace is valuable, and MEV bots find arbitrage opportunities to capture value. The Block SDK provides a fair auction for these opportunities via the `x/builder` module inside the Block SDK so that protocols are rewarded while ensuring that users are not front-run or sandwiched in the process.

The Block SDK uses the app-side `LanedMempool`, `PrepareLane` / `ProcessLane`, and `CheckTx` to create an MEV marketplace inside the protocol. It introduces a new message type, called a `MsgAuctionBid`, that allows the submitter to execute multiple transactions at the **top of the block atomically** (atomically = directly next to each other).

<!-- TODO: What do we do about searcher docs @mag -->

This means that ‘searchers’ can find opportunities in the mempool, backrun them, and submit them at the top of the block. This covers most MEV recapture via arbitrage and liquidations. It can be configured to **not allow** for sandwich attacks or harmful MEV.

:::note 📚 **This page is for chain developers.**

For a more in-depth walk through, the Block SDK repository contains an [**installation and set up guide**](https://github.com/skip-mev/pob#readme) alongside a sample integration with a [**basic simulation application**](https://github.com/skip-mev/pob/blob/main/tests/app/app.go).

Please [**reach out to us**](https://skip.money/contact) if you need help!

:::

**At a high level, to integrate the MEV Lane chains must:**

1. Be using Cosmos SDK version or higher `v0.47.0`.
2. Import and configure the `MEV Lane` (alongside any other desired lanes) into their base app.
3. Import and configure the Block SDK mempool into their base app.
4. Import and configure the Block SDK `Prepare` / `Process` proposal handlers into their base app.
5. Import and instantiate the `x/builder` module into their base app.

{{ readme }}
