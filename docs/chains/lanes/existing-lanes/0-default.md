---
description: Default Lane
title: Default Lane
sidebar_position: 2
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

### Release Compatibility Matrix

| Block SDK Version | Cosmos SDK |
| :---------------: | :--------: |
|      v2.x.x       |  v0.47.x   |
|      v2.x.x       |  v0.48.x   |
|      v2.x.x       |  v0.49.x   |
|      v2.x.x       |  v0.50.x   |

### 🚀 Quick Start

**The following sections will walk through each of these steps in detail.**

#### Cosmos SDK Version

Block SDK requires Cosmos SDK version `v0.47.0` or higher. This is because the Block SDK uses the `ABCI++` interface, which was introduced in `v0.47.0`. If your chain is using a lower version, you will need to upgrade to `v0.47.0` or higher. You can find the latest version of the Cosmos SDK [here](https://github.com/cosmos/cosmos-sdk/releases).

### Base App Configuration

#### Install

<!-- # TODO: Update once we rename the repo -->

```shell
$ go install github.com/skip-mev/pob
```

1. Import the necessary dependencies into your application. This includes the Block SDK's proposal handlers, default lane, and mempool.

   ```go
   import (
     "github.com/skip-mev/pob/block-sdk"
     "github.com/skip-mev/pob/block-sdk/abci"
     "github.com/skip-mev/pob/block-sdk/lanes/default"
     ...
   )
   ```

2. Configure the lane with the desired properties. We recommend setting the `MaxBlockSpace` to `sdk.ZeroDec()` to ensure that the lane consumes all block space that is not consumed by the other lanes. Additionally, if you want to have each lane be mutually exclusive in the transactions that they accept, you can update the `IgnoreList` on the `BaseLaneConfig` to include the other lanes that should not send transactions to the default lane. Alternatively, you can set the `mutualExclusion` field when initializing the mempool to be true. This will automagically set the `IgnoreList` to include all other lanes for every single lane.

<!-- TODO: Does this make sense? @Mag -->

```go
// All of this configuration needs to be done where
// the initial app is created (i.e. app.go).
func NewApp() {
     // Configure any other desired lanes.
     ...
     defaultConfig := block.BaseLaneConfig{
         Logger:        app.Logger(),
         TxEncoder:     app.txConfig.TxEncoder(),
         TxDecoder:     app.txConfig.TxDecoder(),
         MaxBlockSpace: sdk.ZeroDec(),
     }
     defaultLane := base.NewDefaultLane(defaultConfig)
     ...

     // Set the lanes into the mempool.
     lanes := []block.Lane{
         ...
         defaultLane,
         ...
     }

     // Set the lane antehandlers on the lanes.
     for _, lane := range lanes {
         lane.SetAnteHandler(anteHandler)
     }
     app.App.SetAnteHandler(anteHandler)

     // Init the Block SDK mempool.
     mempool := block.NewMempool(lanes...)
     app.App.SetMempool(mempool)

     // Init the Block SDK proposal handlers and set them on the app.
     proposalHandlers := abci.NewProposalHandler(
         app.Logger(),
         app.txConfig.TxDecoder(),
         mempool, // Block SDK mempool
     )
     app.App.SetPrepareProposal(proposalHandlers.PrepareProposalHandler())
     app.App.SetProcessProposal(proposalHandlers.ProcessProposalHandler())
}
```
