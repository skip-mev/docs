---
description: Skip Select Introduction
Title: Skip Select Introduction
sidebar_position: 0
---

# Skip Select

Skip Select is a blockspace auction system that allows searchers to capture MEV in the Cosmos ecosystem, across a variety of chains, and <b>for validators, stakers, and searchers to share in the rewards</b>.

Please see our documentation below for how to integrate and use our endpoints.

## **For validators**

:::tip Get started right away

Check out [Quickstart](validator/quickstart) to set up Skip Select now. It takes 5 minutes.

:::

Validators that integrate with Skip Select:

- Allow MEV to be captured in their blocks without needing to sign headers for unseen blocks, **increasing block rewards** without sacrificing their builder rights
- **Can prevent toxic MEV strategies** like frontrunning & sandwich attacks, while still capturing revenue from other forms of MEV
- Can configure **how much MEV revenue to keep** and how much to share with delegates and the network
- **Do not need to modify** their consensus key signing services (e.g. Horcrux, TMKMS, or custom), or make any new security assumptions

The process of integrating with Skip Select is very easy:

- **Estimated time:** 5-10 minutes
- **Estimated downtime:** < 10 s with Cosmovisor
- No need to make any modifications to consensus key signing services
- No need to make changes to sentry ↔  signing node configurations

All you need to do is register for an API key and rebuild your chain client `mev-tendermint` according to the
the instructions in [Quickstart](validator/quickstart). Some chains include `mev-tendermint` in their default build, so you may not need to do anything outside
of registering for an API key and configuring your chain to use it.

## **For searchers**

Check out the [Searcher Docs](searcher)

## FAQ

Check out our [FAQ page](../faq) if you have more questions.
