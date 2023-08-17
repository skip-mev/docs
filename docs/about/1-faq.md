---
description: FAQs About Skip
title: 📣 FAQ
sidebar_position: 1
---

### 🤔 What is Skip?

Skip helps sovereign blockchains and frontends improve UX and leverage MEV to enrich network stakeholders and protect them from its harmful effects.

We're on a mission to make interoperability dead easy.

### 🤔 What are Skip’s products?

- [Block SDK](/docs/chains/0-integrate-the-sdk.md)
  - The Block SDK is a set of Cosmos SDK and ABCI++ primitives that allow chains to fully customize blocks to specific use cases. It turns your chain's blocks into a **`highway`** consisting of individual **`lanes`** with their own special functionality.
  - Comes with a pre-built MEV system, oracle, and custom gas markets!
- [Skip API](https://api-docs.skip.money/docs)
  - Skip API is a unified REST/RPC service that helps developers create more seamless cross-chain experiences for their end users with IBC.
  - We’ve designed it so that even developers who are completely new to IBC and interoperability can use it to build applications and frontends with powerful IBC one-click functionality.
- [ProtoRev](https://github.com/osmosis-labs/osmosis/blob/main/x/protorev/protorev.md)
  - An onchain module deployed on Osmosis, that captures MEV by backrunning transactions at execution time.
- [Skipper](https://github.com/skip-mev/skipper)
  - An opensource bot that allows for anyone to recapture “good” MEV (backrunning) on any Cosmos network where Skip Select is deployed
- [Skip Select [Deprecated]](/docs/select/0-intro.md)
  - A a blockspace auction system that’s currently deployed on most chains that work with Skip. It builds the top of the block from tipped bundles submitted by traders and gives this segment of the block to validators to include on chain
  - Searchers / traders submit bundles of transactions to Skip Select with a "tip" that they're willing to pay in exchange for the guarantee that their bundle will land on chain in exactly the order they specify and not revert.
  - It requires validators to update their binary to include `mev-tendermint` -- an open-source, battle tested patch of Tendermint currently running on over 170 validators and 5 networks. Installation takes 5 minutes.

### 🤔 Does Skip have a token?

No, Skip doesn’t have a token.

### 🤔 How many chains is Skip currently live on?

Skip is currently live on 20+ chains across it's Block SDK, API, ProtoRev and Skipper products.

### 🤔 Are there rewards for testnet?

No, Skip is not a chain and doesn’t have a testnet.

### 🤔 Is Skip audited?

Yes, Skip software is audited by both Informal Systems and Oak Security.

### 🤔 Are Skip’s products free for validators / searchers?

Yes, Skip is free to use, and takes no fees from users.

### 🤔 How does a validator integrate Skip?

For chains that run Skip Select (Deprecated), follow the “Validator Quickstart” guide in the Skip docs [here](/docs/select/0-intro.md)

### 🤔 How long does validator integration take?

Validator integration typically takes 5-10 minutes

### 🤔 Is it possible to know if a validator is running Skip?

Yes, Validators running Skip have a Skip badge in the validators details on Mintscan, and are also listed on Skip's website ([https://skip.money/validators](https://skip.money/validators))

On chains that integrate the [Block SDK](/docs/chains/0-integrate-the-sdk.md), all validators run Skip's ABCI++ software in consensus.

### 🤔 How much money does Skip generate?

- MEV rewards are dependent on activity and volume, specifically DeFi related activity (e.g. DEX trading and liquidations) - this changes constantly per network
- More metrics for measuring Skip profits are coming soon!

### 🤔 How does Skip make money?

Skip is grant and chain-foundation-funded.
