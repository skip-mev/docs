---
description: 🔎 Example
title: 🔎 How it Works
sidebar_position: 1
---

### 🔁 Transaction Lifecycle

The best way to understand how lanes work is to first understand the lifecycle of a transaction. A transaction begins its lifecycle when it is first signed and broadcasted to a chain. After it is broadcasted to a validator, it will be verified by the base application. If the transaction is valid, it will be inserted into the application's mempool. The mempool is a storage area for transactions that have been verified by the application but have not yet been included in a block.

The transaction then waits in the mempool until a new block needs to be proposed. When a new block needs to be proposed, the application will call `PrepareProposal` (which is a new ABCI++ addition) to request a new block from the current proposer. The proposer will look at what transactions currently waiting to be included in a block by looking at their mempool. The proposer will then iteratively select transactions until the block is full. The proposer will then send the block to other validators in the network.

When a validator receives a proposed block, the validator will first want to verify the contents of the block before signing off on it. The validator will call `ProcessProposal` to verify the contents of the block. If the block is valid, the validator will sign off on the block and broadcast their vote to the network. If the block is invalid, the validator will reject the block. Once a block is accepted by the network, it is committed and the transactions that were included in the block are removed from the validator's mempool (as they no longer need to be considered).

### 🛣️ Lane X Transaction Lifecycle

After a transaction is verified by the base application, it will attempt to be inserted into the Block SDK's `LanedMempool`. A LanedMempool is composed of several distinct `Lanes` that have the ability to store their own transactions. The LanedMempool will insert the transaction into all lanes that accept it. The criteria for whether a lane will accept a transaction is defined by the lane's `MatchHandler`. The default implementation of a MatchHandler will accept all transactions. However, lane's can be configured to only accept transactions that match a certain criteria. For example, a lane could be configured to only accept transactions that are staking related (such as the free lane).

When a new block is proposed, the `PrepareProposalHandler` of the application will iteratively call `PrepareLane` on each lane (in the order in which they are defined in the application). The PrepareLane method is anaolgous to PrepareProposal. Calling PrepareLane on a lane will trigger the lane to reap transactions from its mempool and add them to the proposal (given they are valid respecting the verification rules
of the lane).

When proposals need to be verified in `ProcessProposal`, the `ProcessProposalHandler` will call `ProcessLane` on each lane in the same order as they were called in the PrepareProposalHandler. Each subsequent call to ProcessLane will filter out transactions that belong to previous lanes. **A given lane's ProcessLane will only verify transactions that belong to that lane.**

:::info **Scenario**

Let's say we have a LanedMempool composed of two lanes: `LaneA` and `LaneB`.
LaneA is defined first in the LanedMempool and LaneB is defined second.
LaneA contains transactions Tx1 and Tx2 and LaneB contains transactions
Tx3 and Tx4.
:::

When a new block needs to be proposed, the PrepareProposalHandler will call PrepareLane on LaneA first and LaneB second. When PrepareLane is called on LaneA, LaneA will reap transactions from its mempool and add them to the proposal. Same applies for LaneB. Say LaneA reaps transactions Tx1 and Tx2 and LaneB reaps transactions Tx3 and Tx4. This gives us a proposal composed of the following:

- `Tx1`, `Tx2`, `Tx3`, `Tx4`

When the ProcessProposalHandler is called, it will call ProcessLane on LaneA with the proposal composed of Tx1, Tx2, Tx3, and Tx4. LaneA will then verify Tx1 and Tx2 and return the remaining transactions - Tx3 and Tx4. The ProcessProposalHandler will then call ProcessLane on LaneB with the remaining transactions - Tx3 and Tx4. LaneB will then verify Tx3 and Tx4 and return no remaining transactions.

### Summary

Using the Block SDK, blocks are broken up into smaller partial blocks called `lanes`. Each lane has its own custom block building logic and stores distinct types of transactions. Each lane can only consume a portion of the block as defined on the lane's configuration (`MaxBlockSpace`). When a block proposal is requested, a block will be filled up with transactions from each lane, iteratively in the order in which they are defined in the application. When a block proposal is processed, each lane will verify its portion of the block, iteratively in the order in which they are defined in the application. **Transactions in blocks MUST respect the ordering of lanes.**
