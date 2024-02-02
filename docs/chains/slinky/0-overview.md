---
description: Skip's In-Protocol Oracle
title: ✨ Slinky Overview
sidebar_position: 0
---

<div align="center">
<img src={'/img/slinky.png'} width="200"/>

**_A full-service, secure, enshrined oracle._**

</div>

**Features:**

- **Runs on the chain validator set** - Slinky leverages the chain’s security, giving the fastest updates possible, and removing the requirement for a 3rd party chain.
- **Highly performant** - can support over 2000 currency pairs and price feeds, allowing the launch of thousands of permissionless on-chain markets.
- **Full operational support** - comes with 1-day SLAs around adding new markets, new price sources, and 24/7 on-call support and maintenance.
- **BFT security properties** - leverages vote extensions & ABCI++ to ensure that at least 2/3s of validators contribute to every on-chain price update. It has the same security properties as Comet and the chain itself.

## How it works

![Slinky Architecture](/img/slinky-arch.png)

### Sidecar

- The Slinky sidecar is an out of process service that efficiently fetches prices from various data sources and runs aggregation logic
  to combine them into a single price for each currency pair.

- The application will use GRPC requests to fetch the latest price for a given currency pair
  when it needs to submit prices to the chain.

  ![Sidecar](/img/sidecar.svg)

### Extend Vote / Verify Vote

The ExtendVote and VerifyVote methods of ABCI++ are where a given price starts its journey in the chain.

- The application fetches prices from the sidecar and submits them to the chain via the ABCI++ ExtendVote method.
- VerifyVote is also used to ensure that the submitted data is valid--i.e. it can be unmarhsalled by another validator.

### Prepare Proposal

During PrepareProposal the vote extensions from the previous round are pulled out of the extended commit info and various checks are run on them.

- Slinky ensures that the set of vote extensions comprise the required minimum stake (default of 2/3).
- It also ensures that the vote extensions are valid and can be understood by the application.
- Finally, it encodes the vote extensions and injects them into the top of the block proposal as a pseudo-transaction.

  ![Prepare Proposal](/img/prepare.svg)

:::note

It is crucial that the injected vote extension transaction is not ever unmarshalled into a transaction object as this will cause a panic.
:::

### Process Proposal

Process proposal is identical to PrepareProposal, except it is run on every participating validator.

- If the validator comes to the conclusion that the injected votes are valid and comprise the required minimum stake, it will accept the proposal.

### Finalize Block

The end of the prices' journey is in the Preblock step.

- Here, the injected transaction data is unmarshalled, and the application takes a stake-weighted median of the price votes.
- The resulting canonical price for each pair is stored in the x/oracle module and can be queried by any application.

### Full Flow

This full set of steps repeats on every block resulting in a continuous stream of prices enshrined in the application by the
validator set.
