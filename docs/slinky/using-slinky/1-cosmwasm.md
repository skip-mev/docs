---
description: ⚛️ Slinky with CosmWasm
title: ⚛️ Slinky with CosmWasm
sidebar_position: 1
---

:::note
**Building with Slinky? First step is to join our [Discord](https://discord.gg/amAgf9Z39w)**
:::

## Summary

Slinky prices, since they're stored on-chain in `x/oracle`, are accessible locally via CosmWasm smart contracts. `x/marketmap` has configuration information that may also be helpful in your development.

Here's a couple code snippets on how to get started:

## How to access Slinky prices safely

There are a number of highly-recommended checks we suggest developers use before accessing a Slinky price. These include:

1. Check to make sure the currency-pair exists within the `x/oracle` and `x/marketmap` modules.
1. Check to make sure the currency-pair is `enabled` within the `x/marketmap` (otherwise, it won't update)
1. Check to make sure the `block_timestamp` of the last updated is **less than 20 seconds** from the most recent committed block timestamp. I.e. `current_block_timestamp - block_timestamp < 20s`
1. Check to make sure the price is not returning `nil` (i.e. has not been initialized)

Instructions on how to do these steps are outlined below.

### Getting all supported markets on Slinky, and checking to see if an individual market is included

[COMING SOON]

### Checking to make sure a market is `enabled` withing `x/marketmap`

[COMING SOON]

### Checking to make sure `block_timestamp` is recent enough

[COMING SOON]

### Nil-checking a price response

Slinky may sometimes return a "nil" Price if it has not been written to. This means, within the `GetPriceResponse`, the price will have `Nonce = 0`

The safest way to check for a nil price is to check if the `Nonce == 0`, here's a code snippet below:

### Fetching an individual price

[COMING SOON]

### Fetching a set of prices

[COMING SOON]

# FAQ

### Q: Can I get historical prices in Slinky?

**A:** No, the `x/oracle` module only stores the most recently posted price. However, you can use blockchain indexers or inspect past blocks to see the prices committed on previous heights.

### Q: Can I get confidence bands / other statistical information about prices?

**A:** Not currently, but this is being added in later releases!

### Q: Are Slinky prices free to use?

**A:** Yes!
