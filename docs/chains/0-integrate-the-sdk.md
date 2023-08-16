---
description: Block SDK Integration
title: ⚡️ Integrate the Block SDK
sidebar_position: 0
---

:::info Block SDK

The Block SDK is **open-source software** licensed under MIT. It is free to use, and has existing plug-and-play Lanes that work immediately!

Please [**reach out to us**](https://skip.money/contact) if you need help!

:::

### 📖 Set Up [20 mins]

To get set up, we're going to implement the `Default Lane`, which is the **most general and least restrictive** that accepts all transactions. This will cause **no changes** to your chain functionality, but will prepare you to add `lanes` with more functionality afterwards!

The default lane mirrors how CometBFT creates proposals today.

- It does a basic check to ensure that the transaction is valid.
- Orders the transactions based on tx fee amount (highest to lowest).
- The `PrepareLane` handler will reap transactions from the lane up to the `MaxBlockSpace` limit
- The `ProcessLane` handler will ensure that the transactions are ordered based on their fee amount and pass the same checks done in `PrepareLane`.

<!-- TODO: create script -->

{{ readme_default_lane }}

### 💅 Next step: implement other `lanes`

Visit our [Lane App Store](lanes/existing-lanes/mev) and select the `lanes` you want, or [Build Your Own](lanes/build-your-own-lane).
