---
description: Oracle Validator Quickstart
title: ☝️ Getting Started
sidebar_position: 0
---

## Summary of Steps

**Estimated Time**: 10 mins

1. Install the binary of a support chain application.
2. Install the slinky binary.
3. Configure your slinky sidecar process.
4. Run the slinky sidecar.
5. Start the chain application.

**Any questions / issues during integration? Ask us on [Discord](https://discord.gg/amAgf9Z39w)**

## Chains that support the Slinky Oracle:

### Mainnets

- Check back soon for updates!

### Testnets

- Check back soon for updates!

## 1. Install the chain application ✅

**🚨** Please consult the list of supported network above to install and configure the node binary for the desired chain.

For the purposes of this guide we'll use `testappd` as our example application binary.

## 2. Install the `slinky` binary ✅

You can install the slinky binary either by building from source or by downloading a pre-built binary.

- Install the latest binary from the [releases page](https://github.com/skip-mev/slinky/releases)
- Build from source by cloning the repo and running `make install`

```shell
git clone git@github.com:skip-mev/slinky.git
cd slinky
make install
```

Slinky should now be in your path.

```shell
which slinky
```

## 3. Configure your slinky sidecar process ✅

- The provided releases include an `oracle.toml` file that you can use as a template for configuring your sidecar process.
- Alternatively, the repository contains the most up-to-date version of the config file [here](https://github.com/skip-mev/slinky/blob/main/config/local/oracle.toml)

:::warning
The config file in the Slinky repository is regenerated every time a change is made to the sidecar.
As such, it may contain additional config options that are not yet supported by earlier versions of the sidecar.
Please use the config file from the release if you are unsure.

Config files for the sidecar are generally chain-specific. Prefer to use the config file provided by the chain you're running for instead of the default config located in the repository.

:::

## 4. Run the slinky sidecar ✅

You can run the slinky sidecar by running the following command:

```shell
slinky oracle --config oracle.toml
```

You can verify whether prices are being retrieved by running the following command:

```shell
curl --request -x GET 'http://localhost:8080/slinky/v1/oracle/prices | jq .'
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

If you are having issues running the oracle sidecar, please see the [Troubleshooting section](/docs/chains/slinky/validator/2-troubleshooting.md) for more information.
