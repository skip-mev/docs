---
description: Watch a Lane Get Built
title: 🎥 Watch a Lane Get Built
sidebar_position: 3
---

:::info

📹 Walkthrough the process of building a new demo `Priority` lane! **_We recommend you follow along this doc with the video that pairs with this found [here](https://www.loom.com/share/8ffb9e048a064f6387cdd4f719c96925?sid=a9d4b707-d218-4270-8ab4-925d8e0c02b3)._** This lane requires less than 150 lines of code!

:::

## High Level Overview

We want to demo building a **_priority_** lane for chains. The purpose of this lane is to allow delegators priority access to block-space before transactions from non-delegators. The criteria for the lane is the following:

1. _You must have some amount staked to the network. This is a configurable threshold._
2. _If accepted, your transactions will be ordered by the stake of every user in that lane._

# Steps

### High Level

There are two things we care about for our lane.

1. First, how we match transactions to the `Priority` lane.
2. Second, how we order transactions in the lane. Thankfully, we can extend the functionality of the base lane (found in `block-sdk/block/base`) to accomplish this. Let’s take a look.

```go
func NewBaseLane(
	cfg LaneConfig,
	laneName string,
	laneMempool block.LaneMempool,
	matchHandlerFn MatchHandler,
) *BaseLane {
	lane := &BaseLane{
		cfg:          cfg,
		laneName:     laneName,
		LaneMempool:  laneMempool,
		matchHandler: matchHandlerFn,
	}

	return lane
}
```

There are 4 things needed to extend it.

1. The `LaneConfig` which defines how much blockspace the lane can consume in blocks, maximum number of transactions it can store, and more. This should be initialized wherever the application is created. We will come back to this later.
2. The `LaneName` which is the name of our lane - `Priority`.
3. The `LaneMempool` which stores our transactions and orders them into proposals.
4. The `MatchHandler` which is what determines whether a transaction should belong to this lane.

Let’s go into these in more detail!

### 1. Set up

1. Clone the `[github.com/skip-mev/block-sdk](http://github.com/skip-mev/block-sdk)` repository.
2. Create the a new subdirectory in `block-sdk/lanes/{lane_name}`. For the purposes of this demo, we want to make a new `block-sdk/lanes/priority` subdirectory.
3. Create a new `lane.go` file within that subdirectory.

### 2. Modifying `LaneMempool`

There exists a default `LaneMempool` implementation found in `block-sdk/block/base/mempool.go`.

```go
// NewMempool returns a new Mempool.
func NewMempool[C comparable](txPriority TxPriority[C], txEncoder sdk.TxEncoder, maxTx int) *Mempool[C] {
	return &Mempool[C]{
		index: NewPriorityMempool(
			PriorityNonceMempoolConfig[C]{
				TxPriority: txPriority,
				MaxTx:      maxTx,
			},
		),
		txPriority: txPriority,
		txEncoder:  txEncoder,
		txCache:    make(map[string]struct{}),
	}
}
```

To utilize this implementation, we need to create a `TxPriority[C]`. This is composed of a few things,

```go
// TxPriority defines a type that is used to retrieve and compare transaction
// priorities. Priorities must be comparable.
TxPriority[C comparable] struct {
	// GetTxPriority returns the priority of the transaction. A priority must be
	// comparable via Compare.
	GetTxPriority func(ctx context.Context, tx sdk.Tx) C

	// CompareTxPriority compares two transaction priorities. The result should be
	// 0 if a == b, -1 if a < b, and +1 if a > b.
	Compare func(a, b C) int

	// MinValue defines the minimum priority value, e.g. MinInt64. This value is
	// used when instantiating a new iterator and comparing weights.
	MinValue C
}
```

1. The type (`C`) that we want to utilize as our priority type. In our case, this is going to be `math.LegacyDec` which is going to correspond to the delegation shares of a user.
2. The way we can determine the priority of a transaction `GetTxPriority`. In our case, we want to be able to query the amount the user has staked to the network.
3. The way we determine the priority between two transactions `Compare`. In our case, transactions from users that have more staked will be prioritized over those that have less.
4. The `MinValue` that we want to utilize in the case where we cannot determine the priority. In our case, this should be `math.LegacyZeroDec` which means we did not find any stake for the user.

Great! Now that we understand how to order transactions within our lane, lets actually implement this functionality.

```go
// TxPriority returns the default priority function for the priority lane.
// It orders transactions based on the total amount of tokens that the
// account has delegated to the network.
func TxPriority(sk StakingKeeper) base.TxPriority[math.LegacyDec] {
	return base.TxPriority[math.LegacyDec]{
		GetTxPriority: func(goCtx context.Context, tx sdk.Tx) math.LegacyDec {
			unwrappedCtx := sdk.UnwrapSDKContext(goCtx)
			return getTotalDelegation(unwrappedCtx, tx, sk)
		},
		Compare: func(a, b math.LegacyDec) int {
			switch {
			case a.GT(b):
				return 1
			case a.LT(b):
				return -1
			default:
				return 0
			}
		},
		MinValue: math.LegacyZeroDec(),
	}
}

// getTotalDelegation returns the total amount of tokens that
// the signer has delegated to the network.
func getTotalDelegation(
	ctx sdk.Context,
	tx sdk.Tx,
	sk StakingKeeper,
) math.LegacyDec {
	signer, err := getTxSigner(tx)
	if err != nil {
		return math.LegacyZeroDec()
	}

	// The signer has delegated some tokens to the network.
	// TODO: Ensure that this is deterministic
	delegations := sk.GetDelegatorDelegations(ctx, signer, 100)

	totalDelegations := sdk.ZeroDec()
	for _, delegation := range delegations {
		totalDelegations = totalDelegations.Add(delegation.GetShares())
	}

	return totalDelegations
}

// getTxSigner is a helper function that retrieves the signer of a transaction.
func getTxSigner(tx sdk.Tx) (sdk.AccAddress, error) {
	sigTx, ok := tx.(signing.SigVerifiableTx)
	if !ok {
		return nil, fmt.Errorf("tx does not implement SigVerifiableTx")
	}

	signers := sigTx.GetSigners()
	if len(signers) == 0 {
		return nil, fmt.Errorf("tx does not have any signers")
	}

	return signers[0], nil
}
```

### 3. Adding a `MatchHandler`

Let’s take a look at what we need to implement to match transactions to our lane.

```go
// MatchHandler is utilized to determine if a transaction should be included in the lane. This
// function can be a stateless or stateful check on the transaction.
MatchHandler func(ctx sdk.Context, tx sdk.Tx) bool
```

Given a transaction, our match handler should check if the signers stake to the network is greater than our configured amount. Let’s implement this utilizing the same helper functions above.

```go
// PriorityMatchHandler returns the default match handler for the priority lane. It
// returns true iff the validator has delegated some tokens to the network.
func PriorityMatchHandler(sk StakingKeeper, threshold math.LegacyDec) base.MatchHandler {
	return func(ctx sdk.Context, tx sdk.Tx) bool {
		return getTotalDelegation(ctx, tx, sk).GT(threshold)
	}
}
```

### 4. Putting it all together

Now that we have finished putting together all the pieces need for a lane, let’s put it all together. In `block-sdk/lanes/priority/lane.go` we can write the following.

```go
package priority

import (
	"context"
	"fmt"

	"cosmossdk.io/math"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/auth/signing"
	stakingtypes "github.com/cosmos/cosmos-sdk/x/staking/types"
	"github.com/skip-mev/block-sdk/block/base"
)

const (
	// LaneName defines the name of the priority lane.
	LaneName = "priority"
)

type (
	// PriorityLane allows stakers to prioritize transactions for inclusion in the next block.
	// If you are a staker, you will have transactions executed before transactions of users
	// that are not stakers. Transactions within the priority lane are ordered by the
	// user's delegation.
	PriorityLane struct {
		*base.BaseLane
	}

	// StakingKeeper defines the expected API for the staking keeper.
	StakingKeeper interface {
		// GetDelegatorDelegations returns the list of all delegations for the given delegator
		// address.
		GetDelegatorDelegations(ctx sdk.Context, delegator sdk.AccAddress, maxRetrieve uint16) (delegations []stakingtypes.Delegation)
	}
)

// NewPriorityLane returns a new priority lane.
func NewPriorityLane(
	cfg base.LaneConfig,
	sk StakingKeeper,
	threshold math.LegacyDec,
) *PriorityLane {
	lane := base.NewBaseLane(
		cfg,
		LaneName,
		base.NewMempool[math.LegacyDec](
			TxPriority(sk),
			cfg.TxEncoder,
			cfg.MaxTxs,
		),
		PriorityMatchHandler(sk, threshold),
	)

	if err := lane.ValidateBasic(); err != nil {
		panic(err)
	}

	return &PriorityLane{
		BaseLane: lane,
	}
}

// TxPriority returns the default priority function for the priority lane.
// It orders transactions based on the total amount of tokens that the
// account has delegated to the network.
func TxPriority(sk StakingKeeper) base.TxPriority[math.LegacyDec] {
	return base.TxPriority[math.LegacyDec]{
		GetTxPriority: func(goCtx context.Context, tx sdk.Tx) math.LegacyDec {
			unwrappedCtx := sdk.UnwrapSDKContext(goCtx)
			return getTotalDelegation(unwrappedCtx, tx, sk)
		},
		Compare: func(a, b math.LegacyDec) int {
			switch {
			case a.GT(b):
				return 1
			case a.LT(b):
				return -1
			default:
				return 0
			}
		},
		MinValue: math.LegacyZeroDec(),
	}
}

// PriorityMatchHandler returns the default match handler for the priority lane. It
// returns true iff the validator has delegated some tokens to the network.
func PriorityMatchHandler(sk StakingKeeper, threshold math.LegacyDec) base.MatchHandler {
	return func(ctx sdk.Context, tx sdk.Tx) bool {
		return getTotalDelegation(ctx, tx, sk).GT(threshold)
	}
}

// getTotalDelegation returns the total amount of tokens that
// the signer has delegated to the network.
func getTotalDelegation(
	ctx sdk.Context,
	tx sdk.Tx,
	sk StakingKeeper,
) math.LegacyDec {
	signer, err := getTxSigner(tx)
	if err != nil {
		return math.LegacyZeroDec()
	}

	// The signer has delegated some tokens to the network.
	// TODO: Ensure that this is deterministic
	delegations := sk.GetDelegatorDelegations(ctx, signer, 100)

	totalDelegations := sdk.ZeroDec()
	for _, delegation := range delegations {
		totalDelegations = totalDelegations.Add(delegation.GetShares())
	}

	return totalDelegations
}

// getTxSigner is a helper function that retrieves the signer of a transaction.
func getTxSigner(tx sdk.Tx) (sdk.AccAddress, error) {
	sigTx, ok := tx.(signing.SigVerifiableTx)
	if !ok {
		return nil, fmt.Errorf("tx does not implement SigVerifiableTx")
	}

	signers := sigTx.GetSigners()
	if len(signers) == 0 {
		return nil, fmt.Errorf("tx does not have any signers")
	}

	return signers[0], nil
}
```

In just under _125 lines of code_, we have successfully created our own `Priority` lane!!

### 5. `BaseApp` Set Up

Okay, now that we have our lane let’s set it up in our application. Go to `block-sdk/tests/app/app.go` and add our lane to the lanes already configured. At the time of writing, our application has 3 lanes already built in:

1. [MEV lane](/docs/chains/lanes/existing-lanes/1-mev.md)
2. [Free Lane](/docs/chains/lanes/existing-lanes/2-free.md)
3. [Default Lane](/docs/chains/0-integrate-the-sdk.md)

Let’s say we want our lane to be placed right after the `MEV` lane.

1. Set up the configuration of the lane and initialize our lane

```go
...
// MEV lane allows transactions to bid for inclusion at the top of the next block.
mevConfig := base.LaneConfig{
	Logger:        app.Logger(),
	TxEncoder:     app.txConfig.TxEncoder(),
	TxDecoder:     app.txConfig.TxDecoder(),
	MaxBlockSpace: sdk.ZeroDec(),
}
mevLane := mev.NewMEVLane(
	mevConfig,
	mev.NewDefaultAuctionFactory(app.txConfig.TxDecoder()),
)

// Priority lane allows for super users to be included in blocks before other users.
priorityConfig := base.LaneConfig{
	Logger:        app.Logger(),
	TxEncoder:     app.txConfig.TxEncoder(),
	TxDecoder:     app.txConfig.TxDecoder(),
	MaxBlockSpace: sdk.ZeroDec(),
}
priorityLane := priority.NewPriorityLane(priorityConfig, app.StakingKeeper, math.LegacyMustNewDecFromStr("10"))

...
```

1. Set this order in the `lanes` list.

```go
lanes := []block.Lane{
	mevLane,
	priorityLane,
	freeLane,
	defaultLane,
}
```

Thats it!!!

### 6. Testing

In the video demo [here](https://www.loom.com/share/8ffb9e048a064f6387cdd4f719c96925?sid=a9d4b707-d218-4270-8ab4-925d8e0c02b3), we want through this demo and demonstrate it working on a live node! Here are the logs for what this looks like IRL.

![Logs](/img/block-sdk/demo_logs.png)

What is being demonstrated here? As we can see from the logs, the Block SDK’s mempool currently contains 11 transactions, 10 from the default lane and 1 from the priority lane. When the proposal is constructed, the priority transaction (from the priority lane) will be selected first and then the rest of the block will be constructed from the transactions in the default lane.

---

## Overview

In this demo we created a new Priority lane that allows chain delegators to have priority for their transactions over any other user. We configured a base application that has 4 distinct lanes and are ready to start encouraging users to delegate to the chain!
