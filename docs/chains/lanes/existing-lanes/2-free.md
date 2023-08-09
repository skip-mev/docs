---
description: Free Lane
title: Free Lane
sidebar_position: 1
---

:::info TLDR

The `Free Lane` is purposefully built to allow certain transactions to be included in a block without paying fees. This lane can be used to encourage certain behaviors on the chain, such as staking, governance, or other actions that are beneficial to the chain.
:::

### 📖 Overview

The free lane closely follows the block building logic of the default lane, with exception for the following:

- Transactions can only be included in the free lane if they are considered free (as defined by the free lane's factory).
- By default, the ordering of transactions in the free lane is based on the transaction's fee amount (highest to lowest). However, this can be overridden to support ordering mechanisms that are not based on fee amount (e.g. ordering based on the user's stake amount).

The free lane implements the same `ABCI++` interface as the other lanes, and does the same verification logic as the [default lane](default). The free lane's `PrepareLane` handler will reap transactions from the lane up to the `MaxBlockSpace` limit, and the `ProcessLane` handler will ensure that the transactions are ordered based on their fee amount (by default) and pass the same checks done in `PrepareLane`.

:::note 📚 **This page is for chain developers.**

For a more in-depth walk through, the Block SDK repository contains an [**installation and set up guide**](https://github.com/skip-mev/pob#readme) alongside a sample integration with a [**basic simulation application**](https://github.com/skip-mev/pob/blob/main/tests/app/app.go).

Please [**reach out to us**](https://skip.money/contact) if you need help!

:::

**At a high level, to integrate MEV chains must:**

1. Be using Cosmos SDK version or higher `v0.47.0`.
2. Import and configure the `Free Lane` into their base app.
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
$ go install github.com/skip-mev/block-sdk
```

1. Import the necessary dependencies into your application. This includes the Block SDK's proposal handlers, free lane, and mempool.

   ```go
   import (
     "github.com/skip-mev/pob/block-sdk"
     "github.com/skip-mev/pob/block-sdk/abci"
     "github.com/skip-mev/pob/block-sdk/lanes/default"
     ...
   )
   ```

<!-- TODO: what do you think percentages for free txs should be @mag -->

2. [OPTIONAL] Determine what types of transactions you want to qualify as free. By default, transactions that include `MsgDelegate`, `MsgBeginRedelegate` and `MsgCancelUnbondingDelegation`. Developers must implement a single `IsFreeTx` function that returns a boolean indicating whether or not a transaction is free. This function is passed into the free lane's factory. Below is the sample implementation of the `IsFreeTx` function.

   ```go
   type (
       // Factory defines the interface for processing free transactions. It is
       // a wrapper around all of the functionality that each application chain must implement
       // in order for free processing to work.
       Factory interface {
           // IsFreeTx defines a function that checks if a transaction qualifies as free.
           IsFreeTx(tx sdk.Tx) bool
       }

       // DefaultFreeFactory defines a default implmentation for the free factory interface for processing free transactions.
       DefaultFreeFactory struct {
           txDecoder sdk.TxDecoder
       }
   )

   var _ Factory = (*DefaultFreeFactory)(nil)

   // NewDefaultFreeFactory returns a default free factory interface implementation.
   func NewDefaultFreeFactory(txDecoder sdk.TxDecoder) Factory {
       return &DefaultFreeFactory{
           txDecoder: txDecoder,
       }
   }

   // IsFreeTx defines a default function that checks if a transaction is free. In this case,
   // any transaction that is a delegation/redelegation transaction is free.
   func (config *DefaultFreeFactory) IsFreeTx(tx sdk.Tx) bool {
       for _, msg := range tx.GetMsgs() {
           switch msg.(type) {
           case *types.MsgDelegate:
               return true
           case *types.MsgBeginRedelegate:
               return true
           case *types.MsgCancelUnbondingDelegation:
               return true
           }
       }

       return false
   }
   ```

3. Configure the lane with the desired properties. We recommend setting the `MaxBlockSpace` to less than < 10% to ensure that users do not spam the chain.

   ```go
   // All of this configuration needs to be done where
   // the initial app is created (i.e. app.go).
   func NewApp() {
       // Configure any other desired lanes.
       ...
       freeConfig := block.BaseLaneConfig{
           Logger:        app.Logger(),
           TxEncoder:     app.txConfig.TxEncoder(),
           TxDecoder:     app.txConfig.TxDecoder(),
           MaxBlockSpace: math.LegacyMustNewDecFromStr("0.1"),
       }
       freeLane := free.NewFreeLane(
           freeConfig,
           free.NewDefaultFreeFactory(app.txConfig.TxDecoder()), // Replace with your own implementation if desired
       )
       ...

       // Set the lanes into the mempool.
       lanes := []block.Lane{
           ...
           freeLane,
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
