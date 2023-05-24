---
description: Skip POB Quickstart
title: Overview
sidebar_position: 0
---

### 🤔 What is the Protocol-Owned Builder (POB)?

Protocol-Owned Builder (POB) is a set of Cosmos SDK and ABCI++ primitives that capture MEV in-protocol via an auction of **bundles** (i.e. a set of transactions). It is a **fair, permissionless** way to capture MEV in the Cosmos ecosystem.

Blockspace is valuable, and MEV bots find arbitrage opportunities to capture value. POB provides a fair auction for these opportunities so that protocols are rewarded while ensuring that users are not front-run or sandwiched in the process.

Additionally, POB can be extended to add **custom lanes to the mempool**, which allow for a host of functionality like free transactions, custom gas markets (e.g. EIP 1559), dedicated oracle space, and more!

:::note 🌐 **POB is open-source software licensed under MIT**

It is free to use, takes less than [20 mins to set up](https://github.com/skip-mev/pob#protocol-owned-builder), and immediately adds a healthy MEV market to your network with no extra work!
:::

### 🧱 How does POB work?

POB uses the app-side mempool and `PrepareProposal` / `ProcessProposal` to create an MEV marketplace inside the protocol. It introduces a new message type, called a `MsgAuctionBid`, that allows the submitter to execute multiple transactions at the **top of the block atomically** (atomically = directly next to each other).

This means that ‘searchers’ can find opportunities in the mempool, backrun them, and submit them at the top of the block. This covers most MEV recapture via arbitrage and liquidations. It can be configured to **not allow** for sandwich attacks or harmful MEV.

### 💰 What chains will POB work for?

POB only requires supporting `ABCI++` (Cosmos-SDK version of `0.47` or higher). If your chain supports this, POB is ready to go. There are no other dependencies required.

However, chains will benefit differently from POB. Chains with DeFi activity or smart contracts will benefit more from the auction implementation. Chains that don’t focus on DeFi will benefit more from the other extensions POB has, like a free transactions lane.

### 🔓 What are the use cases for POB?

Besides MEV, POB can be used to:

- Set rules around what transactions are “free” and where they appear, such as free transactions for long-term stakers
- Provide dedicated space for application-critical transactions like oracle updates
- Define custom gas markets for certain transactions, like EIP-1559
- Have an encrypted transaction lane for user privacy
- Limit blockspace of certain protocols or transactions to prevent congestion
- … Much, much more!
