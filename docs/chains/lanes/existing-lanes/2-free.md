---
description: Free Lane
title: 3️⃣ Free Lane
sidebar_position: 2
---

:::info TLDR

The `Free Lane` allows certain transactions to be included in a block without paying fees. This lane can be used to encourage certain behaviors on the chain, such as staking, governance, or others.

If you have not already, this assumes you have completed the [General Setup](chains/integrate-the-sdk) guide first!

Please [**reach out to us**](https://skip.money/contact) if you need help!
:::

### 📖 Overview

The free lane closely follows the block building logic of the default lane, with exception for the following:

- Transactions can only be included in the free lane if they are considered free (as defined by the lane's `MatchHandler`). The default implementation matches transactions to the free lane iff the transaction is staking related (e.g. stake, re-delegate, etc.).
- By default, the ordering of transactions in the free lane is based on the transaction's fee amount (highest to lowest). However, this can be overridden to support ordering mechanisms that are not based on fee amount (e.g. ordering based on the user's on-chain stake amount).

The free lane implements the same `ABCI++` interface as the other lanes, and does the same verification logic as the [default lane](default). The free lane's `PrepareLane` handler will reap transactions from the lane up to the `MaxBlockSpace` limit, and the `ProcessLane` handler will ensure that the transactions are ordered based on their fee amount (by default) and pass the same checks done in `PrepareLane`.

### 📖 Set Up [10 mins]

**At a high level, to integrate the MEV Lane, chains must:**

1. Be using Cosmos SDK version or higher `v0.47.0`.
2. Import and configure the `Free Lane` (alongside any other desired lanes) into their base app.
3. Import and configure the Block SDK mempool into their base app.
4. Import and configure the Block SDK `Prepare` / `Process` proposal handlers into their base app.

{{ readme_free_lane }}
