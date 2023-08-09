---
description: Build Your Own Lane
title: 🏗️ Build Your Own Lane
sidebar_position: 3
---

### 🔎 Basic Overview

Each `lane` defines its own:

1. Unique prioritization/ordering mechanism i.e. how will transactions from a given lane be ordered in a block / mempool.
2. Inclusion function to determine what types of transactions belong in the lane.
3. Unique block building/verification mechanism.

<!-- TODO: David update this link -->

The general **interface** that each lane must implement can be found [here](https://github.com/skip-mev/pob/blob/main/blockbuster/lane.go):

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

### 🔀 1. Implement Transaction Ordering Rules for your `Lane`

:::info

Lanes must implement the `sdk.Mempool` interface but are not constrained in the underlying data structure storing transactions. For example, lanes can utilize a priority queue, a queue, or a set to store transactions.

:::

Developers can define a custom `TxPriority` struct that allows the `lane` to determine the priority of a transaction via `GetTxPriority` and relatively order two transactions using `Compare`. For example, the MEV `lane` includes an custom `TxPriority` that orders transactions in the `lane` based on their bid.

<!-- TODO: David update names from Blockbuster -->

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

### 2. 🔬 [Optional] Transaction Information Retrieval

Each lane can define a **factory** with the necessary set of interfaces required for transaction processing, ordering, and validation. `Lanes` are designed such that any chain can adopt upstream lanes if developers implement the specified interface(s) associated with that lane.

For example, the free `lane` defines a `Factory` that includes a single `IsFreeTx` function that determines what transactions are free. The default implementation makes all `delegate` transactions free, which developers can override 👇

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

### 3. 👀 Define Lane Matching Rules

Lanes must implement a `Match` interface which determines if a transaction should be **considered** for inclusion in a `lane`.

Developers are encouraged to use the same interfaces defined in the `Factory` to match transactions to lanes.

<!-- TODO: @David add example -->

### 4. ✅ [Optional] Define Transaction Validation Rules

Transactions are verified for inclusion in a lane using the `lane`’s `VerifyTx` function. This logic can be completely arbitrary.

For example, the default lane verifies transactions using `baseApp`’s `AnteHandler`, while the MEV `lane` verifies transactions by extracting all bundled transactions included in the bid transaction and then verifying the transaction iteratively given the bundle.

<!-- TODO: @David add actual steps here -->

### 5. 🫡 Block Building/Verification Logic

Each `lane` implements unieque block building and verification logic - analogous to `Prepare` and `Process` proposal.

- `PrepareLane` is in charge of building a partial block of transactions for the `lane`.
- `ProcessLaneBasic` ensures that transactions don't get mixed up between `lanes`.
- `ProcessLane` is in charge of verifying the `lane`’s partial block was built correctly.

<!-- TODO: @David add setup instructions here -->

### 6. 👨‍👩‍👧‍👦 [Optional] Lane Inheritance

Lanes can inherit the underlying implementation of other lanes and overwrite any part of the implementation with their own custom functionality. We recommend that userss extend the functionality of the `Base` lane when first exploring the code base.

<!-- TODO: @David add example here -->
