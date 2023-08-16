---
description: Default Lane
title: 1️⃣ Default Lane
sidebar_position: 0
---

<!-- TODO: Idk what other information we might want here @mag -->

:::info TLDR

The `Default Lane` is the **most general and least restrictive** lane. The Default Lane accepts all transactions that are not accepted by the other lanes, is generally the lowest priority lane, and consumes all blockspace that is
not consumed by the other lanes.

:::

### 📖 Overview

The default lane mirrors how CometBFT/Tendermint creates proposals today.

- Does a basic check to ensure that the transaction is valid (using baseapp's CheckTx).
- Orders the transactions based on tx fee amount (highest to lowest).

The default lane implements the same `ABCI++` interface as the other lanes, however it does no special processing of transactions (outside of a basic `AnteHandler` check) and orders the transactions based on their fee amount in its partial block. The `PrepareLane` handler will reap transactions from the lane up to the `MaxBlockSpace` limit, and the `ProcessLane` handler will ensure that the transactions are ordered based on their fee amount and pass the same checks done in `PrepareLane`.

:::note 📚 **This page is for chain developers.**

For a more in-depth walk through, the Block SDK repository contains an [**installation and set up guide**](https://github.com/skip-mev/pob#readme) alongside a sample integration with a [**basic simulation application**](https://github.com/skip-mev/pob/blob/main/tests/app/app.go).

Please [**reach out to us**](https://skip.money/contact) if you need help!

:::

**At a high level, to integrate MEV chains must:**

1. Be using Cosmos SDK version or higher `v0.47.0`.
2. Import and configure the `Default Lane` into their base app.
3. Import and configure the Block SDK mempool into their base app.
4. Import and configure the Block SDK `Prepare` / `Process` proposal handlers into their base app.

{{ readme }}
