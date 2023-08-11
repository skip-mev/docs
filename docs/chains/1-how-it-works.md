---
description: 🔎 Example
title: 🔎 How it Works
sidebar_position: 1
---

:::info An example Block SDK integration

Let's say we have a chain that has integrated a:

1. Top of block lane
2. Free lane
3. Default lane

:::

### Preparing Proposals

The ordering of lanes when initializing the Block SDK in base app will determines their order for the block proposal. When the current proposer starts building a block, it will populate with transactions from the top of block `lane`, followed by the free and default `lane`.

- Each `lane` proposes its own set of transactions using the lane’s `PrepareLane` (analogous to `PrepareProposal`).
- Each `lane` has a limit on the percentage of total block space (`MaxBlockSpace`) it can consume. For example, the free `lane` might be configured to only make up 10% of any block. This is defined on each `lane`’s `Config` when it is instantiated.
- If a `lane` fails to propose its portion of the block, it will be skipped and the next `lane` will propose its portion of the block.

### Processing Proposals

Block proposals are validated lane-by-lane iteratively in order. Transactions must respect the ordering of `lanes`. Any proposal that includes transactions that are out of order relative to `lane` ordering will be rejected.

Following the example defined above, if a proposal contains the following transactions:

1. Default transaction (belonging to the default `lane`)
2. Top of block transaction (belonging to the top of block `lane`)
3. Free transaction (belonging to the free `lane`)

It will be rejected because it does not respect the `lane` ordering.

The Block SDK `ProcessProposalHandler` verifies all transactions according to each `lane`'s verification logic in a greedy fashion. If a `lane`'s portion of the proposal is invalid, we reject the proposal. After a `lane`'s portion of the proposal is verified, we pass the remaining transactions to the next `lane` in the chain.
