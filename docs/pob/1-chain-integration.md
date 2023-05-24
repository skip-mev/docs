---
description: Skip POB Quickstart
title: Chain Integration
sidebar_position: 1
---

:::note 📚 **This page is for chain developers.**

For a more in-depth walk through, the POB repository contains an [**installation and set up guide**](https://github.com/skip-mev/pob#readme) alongside a sample integration with a [**basic simulation application**](https://github.com/skip-mev/pob/blob/main/tests/app/app.go).
:::

Please [**reach out to us**](https://skip.money/contact) if you need help!

Skip's POB provides developers with a set of a few core primitives:

- `x/builder`: This Cosmos SDK module gives applications the ability to process
  MEV bundled transactions in addition to having the ability to define how searchers
  and block proposers are rewarded. In addition, the module defines a `AuctionDecorator`,
  which is an AnteHandler decorator that enforces various chain configurable MEV
  rules.
- `ProposalHandler`: This ABCI++ handler defines `PrepareProposal` and `ProcessProposal`
  methods that give applications the ability to perform top-of-block auctions,
  which enables recapturing, redistributing and control over MEV. These methods
  are responsible for block proposal construction and validation.
- `AuctionMempool`: An MEV-aware mempool that enables searchers to submit bundled
  transactions to the mempool and have them bundled into blocks via a top-of-block
  auction. Searchers include a bid in their bundled transactions and the highest
  bid wins the auction. Application devs have control over levers that control
  aspects such as the bid floor and minimum bid increment.
- `CheckTxHandler`: This handler defines a `CheckTx` method that gives
  applications the ability to perform MEV-aware transaction validation. Without
  the ability to validate bids as if they were to be executed first on the latest committed
  state, auctions can be grieved and MEV can be stolen.

**At a high level, to integrate POB chains must:**

1. Be using Cosmos SDK version or higher `v0.47.0`.
2. Add the `x/builder` module to their set of SDK modules.
3. Import and configure the POB mempool into their base app.
4. Import and configure the POB `Prepare` / `Process` proposal handlers into their base app.
5. Import and configure the POB `CheckTx` handler into their base app.
6. Configure the desired auction parameters.
7. **[Optional]** The `AuctionFactory` is in charge of determining how searchers bid for top of block execution and how to extract relevant bid information (transactions, timeout, etc.). Chains can configure their own implementations to have [unique auction flows](https://github.com/skip-mev/pob/blob/main/SPEC.md#configuration).

### Release Compatibility Matrix

| POB Version | Cosmos SDK |
| :---------: | :--------: |
|   v1.x.x    |  v0.47.x   |

**The following sections will walk through each of these steps in detail.**

### Cosmos SDK Version

POB requires Cosmos SDK version `v0.47.0` or higher. This is because POB uses the `ABCI++` interface, which was introduced in `v0.47.0`. If your chain is using a lower version, you will need to upgrade to `v0.47.0` or higher. You can find the latest version of the Cosmos SDK [here](https://github.com/cosmos/cosmos-sdk/releases).

### Base App Configuration

#### Install

```shell
$ go install github.com/skip-mev/pob
```

1. Import the necessary dependencies into your application. This includes the
   proposal + checkTx handlers, mempool, keeper, builder types, and builder module. This
   tutorial will go into more detail into each of the dependencies.

   ```go
   import (
     "github.com/skip-mev/pob/abci"
     "github.com/skip-mev/pob/mempool"
     "github.com/skip-mev/pob/x/builder"
     builderkeeper "github.com/skip-mev/pob/x/builder/keeper"
     buildertypes "github.com/skip-mev/pob/x/builder/types"
     ...
   )
   ```

2. Add your module to the the `AppModuleBasic` manager. This manager is in
   charge of setting up basic, non-dependent module elements such as codec
   registration and genesis verification. This will register the special
   `MsgAuctionBid` message. When users want to bid for top of block execution,
   they will submit a transaction - which we call an **auction transaction** - that
   includes a single `MsgAuctionBid`. We prevent any other messages from being
   included in auction transaction to prevent malicious behavior - such as front
   running or sandwiching.

   ```go
   var (
     ModuleBasics = module.NewBasicManager(
       ...
       builder.AppModuleBasic{},
     )
     ...
   )
   ```

3. The builder `Keeper` is POB's gateway to processing special **auction transactions**
   that allow users to participate in the top of block auction, distribute
   revenue to the auction house, and ensure the validity of auction transactions.

   a. First add the keeper to the app's struct definition alongside the checkTx handler.

   ```go
   type App struct {
     ...
     // BuilderKeeper is the keeper that handles processing auction transactions
     BuilderKeeper         builderkeeper.Keeper

     // Custom checkTx handler
     checkTxHandler abci.CheckTx
   }
   ```

   b. Add the builder module to the list of module account permissions. This will
   instantiate the builder module account on genesis.

   ```go
   maccPerms = map[string][]string{
     builder.ModuleName: nil,
     ...
   }
   ```

   c. Instantiate the builder keeper, store keys, and module manager. Note, be
   sure to do this after all the required keeper dependencies have been instantiated.

   ```go
   keys := storetypes.NewKVStoreKeys(
     buildertypes.StoreKey,
     ...
   )

   ...
   app.BuilderKeeper := builderkeeper.NewKeeper(
     appCodec,
     keys[buildertypes.StoreKey],
     app.AccountKeeper,
     app.BankKeeper,
     app.DistrKeeper,
     app.StakingKeeper,
     authtypes.NewModuleAddress(govv1.ModuleName).String(),
   )


   app.ModuleManager = module.NewManager(
     builder.NewAppModule(appCodec, app.BuilderKeeper),
     ...
   )
   ```

   d. Searchers bid to have their bundles executed at the top of the block
   using `MsgAuctionBid` messages (by default). While the builder `Keeper` is capable of
   tracking valid bids, it is unable to correctly sequence the auction
   transactions alongside the normal transactions without having access to the
   application’s mempool. As such, we have to instantiate POB’s custom
   `AuctionMempool` - a modified version of the SDK’s priority sender-nonce
   mempool - into the application. Note, this should be done after `BaseApp` is
   instantiated.

   Application developers can choose to implement their own `AuctionFactory` implementation
   or use the default implementation provided by POB. The `AuctionFactory` is responsible
   for determining what is an auction bid transaction and how to extract the bid information
   from the transaction. The default implementation provided by POB is `DefaultAuctionFactory`
   which uses the `MsgAuctionBid` message to determine if a transaction is an auction bid
   transaction and extracts the bid information from the message.

   ```go
   config := mempool.NewDefaultAuctionFactory(txDecoder)

   mempool := mempool.NewAuctionMempool(txDecoder, txEncoder, maxTx, config)
   app.SetMempool(mempool)
   ```

   e. With Cosmos SDK version 0.47.0, the process of building blocks has been
   updated and moved from the consensus layer, CometBFT, to the application layer.
   When a new block is requested, the proposer for that height will utilize the
   `PrepareProposal` handler to build a block while the `ProcessProposal` handler
   will verify the contents of the block proposal by all validators. The
   combination of the `AuctionMempool`, `PrepareProposal` and `ProcessProposal`
   handlers allows the application to verifiably build valid blocks with
   top-of-block block space reserved for auctions. Additionally, we override the
   `BaseApp`'s `CheckTx` handler with our own custom `CheckTx` handler that will
   be responsible for checking the validity of transactions. We override the
   `CheckTx` handler so that we can verify auction transactions before they are
   inserted into the mempool on top of the latest commit state. This is important
   because we otherwise there may be discrepencies between the auction transaction
   and the bundled transactions are validated in `CheckTx` and `PrepareProposal` such
   that the auction can be griefed. All other transactions will be executed with base app's `CheckTx`.

   ```go
   // Create the entire chain of AnteDecorators for the application.
   anteDecorators := []sdk.AnteDecorator{
     auction.NewAuctionDecorator(
       app.BuilderKeeper,
       txConfig.TxEncoder(),
       mempool,
     ),
     ...,
   }

   // Create the antehandler that will be used to check transactions throughout the lifecycle
   // of the application.
   anteHandler := sdk.ChainAnteDecorators(anteDecorators...)
   app.SetAnteHandler(anteHandler)

   // Create the proposal handler that will be used to build and validate blocks.
   handler := proposalhandler.NewProposalHandler(
     mempool,
     bApp.Logger(),
     anteHandler,
     txConfig.TxEncoder(),
     txConfig.TxDecoder(),
   )
   app.SetPrepareProposal(handler.PrepareProposalHandler())
   app.SetProcessProposal(handler.ProcessProposalHandler())

   // Set the custom CheckTx handler on BaseApp.
   checkTxHandler := pobabci.CheckTxHandler(
     app.App,
     app.TxDecoder,
     mempool,
     anteHandler,
     chainID,
   )
   app.SetCheckTx(checkTxHandler)

   ...

   // CheckTx will check the transaction with the provided checkTxHandler. We override the default
   // handler so that we can verify bid transactions before they are inserted into the mempool.
   // With the POB CheckTx, we can verify the bid transaction and all of the bundled transactions
   // before inserting the bid transaction into the mempool.
   func (app *TestApp) CheckTx(req cometabci.RequestCheckTx) cometabci.ResponseCheckTx {
     return app.checkTxHandler(req)
   }

   // SetCheckTx sets the checkTxHandler for the app.
   func (app *TestApp) SetCheckTx(handler abci.CheckTx) {
     app.checkTxHandler = handler
   }
   ```

   f. Finally, update the app's `InitGenesis` order.

   ```go
   genesisModuleOrder := []string{
     buildertypes.ModuleName,
     ...,
   }
   ```
