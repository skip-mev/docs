---
description: FAQs About Skip
title: FAQ
sidebar_position: 6
---

### What is Skip?

Skip builds infrastructure and protocols to help sovereign blockchain ecosystems leverage their blockspace markets and orderflow to enrich network stakeholders and protect users from the harmful effects of MEV.

Skip gives app chains and validators maximum choice and flexibility in how to build their MEV marketplaces, including choice over:

- Where and to whom MEV revenue accrues
- What forms of MEV are facilitated
- And more...

### What are Skip’s products?

- [Protocol Owned Builder](pob/overview)
  - Protocol-Owned Builder (POB) is a set of Cosmos SDK and ABCI++ primitives that permissionlessly, fairly capture MEV in-protocol via an auction of **bundles** (i.e. a set of transactions).
- [Skip Select](select/intro)
  - A a blockspace auction system that’s currently deployed on most chains that work with Skip. It builds the top of the block from tipped bundles submitted by traders and gives this segment of the block to validators to include on chain
  - Searchers / traders submit bundles of transactions to Skip Select with a "tip" that they're willing to pay in exchange for the guarantee that their bundle will land on chain in exactly the order they specify and not revert.
  - It requires validators to update their binary to include `mev-tendermint` -- an open-source, battle tested patch of Tendermint currently running on over 170 validators and 5 networks. Installation takes 5 minutes.
- [ProtoRev](https://github.com/osmosis-labs/osmosis/blob/main/x/protorev/protorev.md)
  - An onchain module deployed on Osmosis, that captures MEV by backrunning transactions at execution time
- [Skipper](https://github.com/skip-mev/skipper)
  - An opensource bot that allows for anyone to recapture “good” MEV (backrunning) on any Cosmos network where Skip Select is deployed
- [Skip Secure](select/skip-secure)
  - A private RPC endpoint anyone can add to their wallets to have private transactions, meaning no possibility of frontrunning or sandwiching

### Does Skip have a token?

No, Skip doesn’t have a token.

### How many chains is Skip currently live on?

Check [skip.money/validators](http://skip.money/validators) to see all chains that Skip currently supports.

### Are there rewards for testnet?

No, Skip is not a chain and doesn’t have a testnet.

#### Is Skip audited?

Skip is currently being audited by Informal Systems

### Is Skip’s integration free for validators / searchers?

Yes, Skip is free to use, and takes no fees from any parties.

### How does a validator integrate Skip?

Please follow the “Validator Quickstart” guide in the Skip docs [here](select/validator/quickstart)

### How long does validator integration take?

Validator integration typically takes 5-10 minutes

### What is Skip’s Vision

Skip’s vision is to make blockchains financially sustainable through MEV, and to give app-chains and validators maximum choice in creating MEV markets.

### Is it possible to know if a validator is running Skip?

Yes, Validators running Skip have a Skip badge in the validators details on Mintscan, and are also listed on Skip's website ([https://skip.money/validators](https://skip.money/validators))

### How much money does Skip generate validators?

- MEV rewards are dependent on activity and volume, specifically DeFi related activity (e.g. DEX trading and liquidations) - this changes constantly per network
- You can see how much validators earn by running Skip by examining skip.money/validators, and see daily volume and revenue in skip.money/activity

### How does Skip make money?

Skip is grant-funded, and in the future may take a small (~5%) fee of auction revenues after discussions with chains and validators.
