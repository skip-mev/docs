---
description: Slinky Validator Quickstart
title: ☝️ Quickstart
sidebar_position: 0
---

:::note
**Running Slinky? First step is to join our [Discord](https://skip.money/discord)**
:::

## Summary of Steps

**Estimated Time**: 10 mins

In this walkthrough, we'll be going through the 5 steps to set up Slinky.

1. Install the binary of a support chain application.
2. Install the slinky binary.
3. Configure your slinky sidecar process.
4. Run the slinky sidecar.
5. Start the chain application.

## 1. Install the Chain Binary ✅

**🚨** Please visit the chain's validator-specific instructions to install and configure the node binary for the desired chain.

For the purposes of this guide we'll use `testappd` as our example application binary, but it will be the same for any chain!

## 2. Install the `slinky` binary ✅

You can install the slinky binary either by building from source or by downloading a pre-built binary.

- Install the latest binary from the <b>[releases page](https://github.com/skip-mev/slinky/releases)</b>
- Build from source by cloning the <b>[repo](https://github.com/skip-mev/slinky)</b> and running `make install`

```shell
git clone git@github.com:skip-mev/slinky.git
cd slinky
make install
```

Slinky should now be in your path. Check to make sure with:

```shell
which slinky
```

## 3. Configure your Slinky Sidecar Process ✅

The Slinky binary sets sane defaults for as many values as possible. Depending on the chain you're operating for, you may need to override some of the default
values.

Please see our [slinky config](/slinky/validator/2-validator-slinky-config.md) page for a complete reference on configurable values.
Additionally, our [chain config](/slinky/integrations) has references for particular integrations.

## 4. Run the Slinky Sidecar ✅

You can run the slinky sidecar by running the following command:

```shell
slinky --oracle-config-path oracle.json
```

You can verify whether prices are being retrieved by running the following command:

```shell
curl 'http://localhost:8080/slinky/oracle/v1/prices' | jq .
```

You should see output similar to the following:

```JSON
{
  "prices": {
    "ATOM/USD": "920650000",
    "BITCOIN/USD": "3980283250000",
    "DYDX/USD": "273682500",
    "ETHEREUM/BITCOIN": "5842000",
    "ETHEREUM/USD": "232550500000",
    "POLKADOT/USD": "638800000",
    "SOLANA/USD": "8430350000"
  },
  "timestamp": "2024-01-23T01:15:09.776890Z"
}
```

## 5. Start the chain application ✅

Starting the chain application should be no different than starting the application without the sidecar.

```shell
testappd start
```

## Troubleshooting

If you are having issues running the oracle sidecar, please see the [Troubleshooting section](/docs/slinky/validator/3-troubleshooting.md) for more information.
