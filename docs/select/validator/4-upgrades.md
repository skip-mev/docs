---
description: How to manage chain upgrades
title: Chain Upgrade Guide
sidebar_position: 4
---

# How to Manage Chain Upgrades

Skip does not make chain upgrades more complex.

- You can still use Cosmovisor.
- You still just build one binary from source
- You do not need to mess with the source code of your node yourself

Simply follow the instructions from the quickstart guide about [how to compile your node with `mev-tendermint`](validator/0-quickstart.md#2-compile-your-node-with-mev-tendermint) each time.

If you use Cosmovisor, just place the output binary in the cosmovisor `upgrades/CHAIN_VERSION` bin as you normally do.

:::info Same as normal upgrade process
Notice that this process is **identical** to performing a normal chain upgrade except that instead of using the official upstream repo and the `CHAIN_VERSION` tag, you are using a fork of chain source code from https://github.com/skip-mev/ and a `CHAIN_VERSION-mev` tag.
:::

:::caution Not applicable for Injective
Because the Injective codebase is not open source, injective requires a different process. You must follow the special Injective instructions [here](validator/8-injective-build.md). (Don't worrry, they're simple.)
:::
