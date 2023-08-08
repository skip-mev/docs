---
description: Mempool SDK
title: Mempool SDK
sidebar_position: 1
---

:::info BlockBuster
**`BlockBuster`** is a framework for creating modular, application specific mempools by **separating transactions into “lanes” with custom transaction handling.**
:::

## What is a Mempool?

Mempools are core to the transaction lifecycle. When users broadcast their transactions, they are first validated by applications'
and then temporarily stored in a black-box called the **mempool**. The mempool is a temporary storage space for transactions that have
been validated by the application but have not yet been included in a block.

## Mempool Issues

Most Cosmos chains today utilize the out of the box `CometBFT` mempool - which are too limited.

- The standard `CometBFT` mempool is susceptible to MEV-related issues, such as front-running and sandwich attacks, since proposers have monopolistic rights on ordering and no verification of good behavior. MEV that is created by reordering a block cannot be enforceably extracted and redistributed to the protocol.
- The standard `CometBFT` mempool uses a one-size-fits-all approach, which can result in inefficient transaction processing for specific applications or use cases and create sub-optimal fee markets. A subset of dApps can congest entire blocks during periods of high market volatility.
- Transactions tailored for specific applications may need custom prioritization, ordering or validation rules that the mempool is otherwise unaware of because transactions within a mempool are currently in-differentiable when a blockchain might want them to be.

## BlockBuster Overview

**`BlockBuster`** is a framework for creating modular, application specific
mempools by **separating transactions into “lanes” with custom transaction handling.**

You can think of BlockBuster as a **transaction highway system**, where each
lane on the highway serves a specific purpose and has its own set of rules and
traffic flow.

Similarly, **BlockBuster** redefines block-space into **`lanes`** - where each
`lane` has its own set of rules and transaction flow management systems.

- A lane is what we might traditionally consider to be a standard mempool
  where transaction **_validation_**, **_ordering_** and **_prioritization_** for
  contained transactions are shared.
- Lanes implement a **standard interface** that allows each individual lane to
  propose and validate a portion of a block.
- Lanes are ordered with each other, configurable by developers. All lanes
  together define the desired block structure of a chain.

## BlockBuster Use Cases

A mempool with separate `lanes` can be used for:

1. **MEV mitigation**: a top of block lane could be designed to create an in-protocol top-of-block auction (as we are doing with POB) to recapture MEV in a transparent and governable way.
2. **Free/reduced fee txs**: transactions with certain properties (e.g. from trusted accounts or performing encouraged actions) could leverage a free lane to reward behavior.
3. **Dedicated oracle space** Oracles could be included before other kinds of transactions to ensure that price updates occur first, and are not able to be sandwiched or manipulated.
4. **Orderflow auctions**: an OFA lane could be constructed such that order flow providers can have their submitted transactions bundled with specific backrunners, to guarantee MEV rewards are attributed back to users. Imagine MEV-share but in protocol.
5. **Enhanced and customizable privacy**: privacy-enhancing features could be introduced, such as threshold encrypted lanes, to protect user data and maintain privacy for specific use cases.
6. **Fee market improvements**: one or many fee markets - such as EIP-1559 - could be easily adopted for different lanes (potentially custom for certain dApps). Each smart contract/exchange could have its own fee market or auction for transaction ordering.
7. **Congestion management**: segmentation of transactions to lanes can help mitigate network congestion by capping usage of certain applications and tailoring fee markets.

## BlockBuster Design

BlockBuster is a mempool composed of sub-mempools called **lanes**. All
lanes together define the transaction highway system and BlockBuster mempool.
When instantiating the BlockBuster mempool, developers will define all of the
desired lanes and their configurations (including lane ordering).

Utilizing BlockBuster is a simple three step process:

### 1. Determine the lanes desired

Currently, POB supports three different implementations of lanes: top of block lane, free lane, and a default lane.

1. **Top of block lane** allows the top of every block to be auctioned off
   and constructed using logic defined by the `x/builder` module.
2. **Free lane** allows base app to not charge certain types of transactions
   any fees. For example, delegations and/or re-delegations might be charged no
   fees. What qualifies as a free transaction is determined
   [here](https://github.com/skip-mev/pob/blob/main/blockbuster/lanes/free/factory.go).
3. **Default lane** accepts all other transactions and is considered to be
   analogous to how mempools and proposals are constructed today.

### 2. Instantiate the mempool in base app

The lanes are ordered by priority and are configurable by developers. The first lane is the highest priority lane and the last lane is the lowest priority lane.

```go
// Set the blockbuster mempool into the app.
// Create the lanes.
//
// NOTE: The lanes are ordered by priority. The first lane is the highest priority
// lane and the last lane is the lowest priority lane.
// Top of block lane allows transactions to bid for inclusion at the top of the next block.
//
// blockbuster.BaseLaneConfig is utilized for basic encoding/decoding of transactions.
tobConfig := blockbuster.BaseLaneConfig{
    Logger:        app.Logger(),
    TxEncoder:     app.txConfig.TxEncoder(),
    TxDecoder:     app.txConfig.TxDecoder(),
    // the desired portion of total block space to be reserved for the lane. a value of 0
    // indicates that the lane can use all available block space.
    MaxBlockSpace: sdk.ZeroDec(),
}
tobLane := auction.NewTOBLane(
    tobConfig,
    // the maximum number of transactions that the mempool can store. a value of 0 indicates
    // that the mempool can store an unlimited number of transactions.
    0,
    // AuctionFactory is responsible for determining what is an auction bid transaction and
    // how to extract the bid information from the transaction. There is a default implementation
    // that can be used or application developers can implement their own.
    auction.NewDefaultAuctionFactory(app.txConfig.TxDecoder()),
)

// Free lane allows transactions to be included in the next block for free.
freeConfig := blockbuster.BaseLaneConfig{
    Logger:        app.Logger(),
    TxEncoder:     app.txConfig.TxEncoder(),
    TxDecoder:     app.txConfig.TxDecoder(),
    MaxBlockSpace: sdk.ZeroDec(),
    // IgnoreList is a list of lanes that if a transaction should be included in, it will be
    // ignored by the lane. For example, if a transaction should belong to the tob lane, it
    // will be ignored by the free lane.
    IgnoreList: []blockbuster.Lane{
    tobLane,
    },
}
freeLane := free.NewFreeLane(
    freeConfig,
    free.NewDefaultFreeFactory(app.txConfig.TxDecoder()),
)

// Default lane accepts all other transactions.
defaultConfig := blockbuster.BaseLaneConfig{
    Logger:        app.Logger(),
    TxEncoder:     app.txConfig.TxEncoder(),
    TxDecoder:     app.txConfig.TxDecoder(),
    MaxBlockSpace: sdk.ZeroDec(),
    IgnoreList: []blockbuster.Lane{
        tobLane,
        freeLane,
    },
}
defaultLane := base.NewDefaultLane(defaultConfig)

// Set the lanes into the mempool.
lanes := []blockbuster.Lane{
    tobLane,
    freeLane,
    defaultLane,
}
mempool := blockbuster.NewMempool(lanes...)
app.App.SetMempool(mempool)
```

### 3. Instantiate the BlockBuster Proposal Handlers

```go
proposalHandlers := abci.NewProposalHandler(
    app.Logger(),
    app.txConfig.TxDecoder(),
    mempool, // BlockBuster mempool
)
app.App.SetPrepareProposal(proposalHandlers.PrepareProposalHandler())
app.App.SetProcessProposal(proposalHandlers.ProcessProposalHandler())
```

:::info Transaction to Lane Matching

Transactions are inserted into all lanes the transaction matches to. However, if developers want transactions to match to a single lane, they should utilize
the `IgnoreList` field on the lane’s `Config` to ignore lanes that the transaction should not be included in.

:::

Every application utilizing BlockBuster should configure a `DefaultLane` that accepts transactions that do not belong to any other lane. This is analogous to how transactions are handled today in the standard `CometBFT` mempool.

### Block Proposals

:::info Block Proposal Example
The ordering of lanes when initializing BlockBuster in base app will determine the ordering of how proposals are built. For example, say that we instantiate three lanes:

1. Top of block lane
2. Free lane
3. Default lane

:::

### Preparing Proposals

When the current proposer starts building a block, it will first populate the proposal with transactions from the top of block lane, followed by free and default lane. Each lane proposes its own set of transactions using the lane’s `PrepareLane` (analogous to `PrepareProposal`). Each lane has a limit on the relative percentage of total block space (`MaxBlockSpace`) that the lane can consume. For example, the free lane might be configured to only make up 10% of any block. This is defined on each lane’s `Config` when it is instantiated.

In the case when any lane fails to propose its portion of the block, it will be skipped and the next lane in the set of lanes will propose its portion of the block. Failures of partial block proposals are independent of one another.

### Processing Proposals

Block proposals are validated iteratively following the exact ordering of lanes defined on base app. Transactions included in block proposals must respect the ordering of lanes. Any proposal that includes transactions that are out of order relative to the ordering of lanes will be rejected. Following the example defined above, if a proposal contains the following transactions:

1. Default transaction (belonging to the default lane)
2. Top of block transaction (belonging to the top of block lane)
3. Free transaction (belonging to the free lane)

It will be rejected because it does not respect the lane ordering.

The BlockBuster `ProcessProposalHandler` processes the proposal by verifying all transactions in the proposal according to each lane's verification logic in a greedy fashion. If a lane's portion of the proposal is invalid, we reject the proposal. After a lane's portion of the proposal is verified, we pass the remaining transactions to the next lane in the chain.

#### Coming Soon

BlockBuster will have its own dedicated gRPC service for searchers, wallets, and users that allows them to query what lane their transaction might belong in, what fees they might have to pay for a given transaction, and the general state of the BlockBuster mempool.

### Lanes

Each lane will define its own:

1. Unique prioritization/ordering mechanism i.e. how will transactions from a given lane be ordered in a block / mempool.
2. Inclusion function to determine what types of transactions belong in the lane.
3. Unique block building/verification mechanism.

The general interface that each lane must implement can be found [here](https://github.com/skip-mev/pob/blob/main/blockbuster/lane.go):

```go
// Lane defines an interface used for block construction
Lane interface {
    sdkmempool.Mempool

    // Name returns the name of the lane.
    Name() string

    // Match determines if a transaction belongs to this lane.
    Match(ctx sdk.Context, tx sdk.Tx) bool

    // VerifyTx verifies the transaction belonging to this lane.
    VerifyTx(ctx sdk.Context, tx sdk.Tx) error

    // Contains returns true if the mempool/lane contains the given transaction.
    Contains(tx sdk.Tx) bool

    // PrepareLane builds a portion of the block. It inputs the maxTxBytes that
    // can be included in the proposal for the given lane, the partial proposal,
    // and a function to call the next lane in the chain. The next lane in the
    // chain will be called with the updated proposal and context.
    PrepareLane(
        ctx sdk.Context,
        proposal BlockProposal,
        maxTxBytes int64,
        next PrepareLanesHandler
    ) (BlockProposal, error)

    // ProcessLaneBasic validates that transactions belonging to this lane
    // are not misplaced in the block proposal.
    ProcessLaneBasic(ctx sdk.Context, txs []sdk.Tx) error

    // ProcessLane verifies this lane's portion of a proposed block. It inputs
    // the transactions that may belong to this lane and a function to call the
    // next lane in the chain. The next lane in the chain will be called with
    // the updated context and filtered down transactions.
    ProcessLane(
        ctx sdk.Context,
        proposalTxs []sdk.Tx,
        next ProcessLanesHandler,
    ) (sdk.Context, error)

    // SetAnteHandler sets the lane's antehandler.
    SetAnteHandler(antehander sdk.AnteHandler)

    // Logger returns the lane's logger.
    Logger() log.Logger

    // GetMaxBlockSpace returns the max block space for the lane as a relative percentage.
    GetMaxBlockSpace() math.LegacyDec
}
```

### 1. Intra-lane Transaction Ordering

:::info

Lanes must implement the `sdk.Mempool` interface but are not constrained in the underlying data structure storing transactions. For example, lanes can utilize a priority queue, a queue, or a set to store transactions.

:::

Transactions within a lane are ordered in a proposal respecting the ordering defined on the lane’s mempool. Developers can define their own custom ordering by implementing a custom `TxPriority` struct that allows the lane’s mempool to determine the priority of a transaction `GetTxPriority` and relatively order two transactions given the priority `Compare`. The top of block lane includes an custom `TxPriority` that orders transactions in the mempool based on their bid.

```go
func TxPriority(config Factory) blockbuster.TxPriority[string] {
    return blockbuster.TxPriority[string]{
        GetTxPriority: func(goCtx context.Context, tx sdk.Tx) string {
            bidInfo, err := config.GetAuctionBidInfo(tx)
            if err != nil {
                panic(err)
            }

            return bidInfo.Bid.String()
        },
        Compare: func(a, b string) int {
            aCoins, _ := sdk.ParseCoinsNormalized(a)
            bCoins, _ := sdk.ParseCoinsNormalized(b)

            switch {
            case aCoins == nil && bCoins == nil:
                return 0

            case aCoins == nil:
                return -1

            case bCoins == nil:
                return 1

            default:
                switch {
                case aCoins.IsAllGT(bCoins):
                        return 1

                case aCoins.IsAllLT(bCoins):
                        return -1

                default:
                        return 0
                }
            }
        },
        MinValue: "",
    }
}

// NewMempool returns a new auction mempool.
func NewMempool(txEncoder sdk.TxEncoder, maxTx int, config Factory) *TOBMempool {
    return &TOBMempool{
        index: blockbuster.NewPriorityMempool(
            blockbuster.PriorityNonceMempoolConfig[string]{
                TxPriority: TxPriority(config),
                MaxTx:      maxTx,
            },
        ),
        txEncoder: txEncoder,
        txIndex:   make(map[string]struct{}),
        Factory:   config,
    }
}
```

### 2. [Optional] Transaction Information Retrieval

Each lane can define a factory that configures the necessary set of interfaces required for transaction processing, ordering, and validation. Lanes are designed such that any given chain can adopt upstream `POB` lanes as long as developers implement the specified interface(s) associated with transaction information retrieval for that lane.

**_A standard cosmos chain or EVM chain can then implement their own versions of these interfaces and automatically utilize the lane with no changes upstream!_**

For example, the free lane defines an `Factory` that includes a single `IsFreeTx` function that allows developers to configure what is a free transaction. The default implementation categorizes free transactions as any transaction that includes a delegate type message. Developers can implement this interface to define their own custom free transaction logic. For example, a chain might want to define a free transaction as any transaction that includes a `MsgSend` message.

```go
// IsFreeTx defines a default function that checks if a transaction is free. In
// this case, any transaction that is a delegation/redelegation transaction is free.
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

### 3. Lane Inclusion Functionality

Lanes must implement a `Match` interface which determines whether a transaction should be considered for a given lane. Developer’s are encouraged to utilize the same interfaces defined in the `Factory` to match transactions to lanes. For example, developers might configure a top of block auction lane to accept transactions if they contain a single `MsgAuctionBid` message in the transaction. That same factory might be able to retrieve bid information from the transaction. We can then consider any transaction that does not include this bid info to not belong to the top of block lane.

### 4.1. [Optional] Transaction Validation

Transactions will be verified the lane’s `VerifyTx` function. This logic can be completely arbitrary. For example, the default lane verifies transactions using base app’s `AnteHandler` while the top of block lane verifies transactions by extracting all bundled transactions included in the bid transaction and then verifying the transaction iteratively given the bundle.

### 4.2. Block Building/Verification Logic

Each lane will implement block building and verification logic - analogous to `Prepare` and `Process` proposal - that is unique to itself.

- `PrepareLane` will be in charge of building a partial block given the transactions in the lane.
- `ProcessLaneBasic` ensures that transactions that should be included in the current lane are not interleaved with other lanes i.e. transactions in proposals are ordered respecting the ordering of lanes.
- `ProcessLane` will be in charge of verifying the lane’s partial block.

### Inheritance

Lanes can inherit the underlying implementation of other lanes and overwrite any part of the implementation with their own custom functionality. We recommend that user’s extend the functionality of the `Base` lane when first exploring the code base.
