---
description: Alternative methods for installing mev-tendermint
title: Alternative Installation Methods
sidebar_position: 5
---

# Alternative Methods for Installing `mev-tendermint`

This page describes several alternative methods to install mev-tendermint in chain nodes for validators who don't feel comfortable cloning the https://github.com/skip-mev fork of the chain.

### Patch `mev-tendermint` into `go.mod` file

You can replace `tendermint` with `mev-tendermint` in the chain source code, rather than checking out the skip fork of the chain source code where we've already done the replacement.

Below you can find instruction to perform the replacement automatically or manually.

:::tip Prerequisite
For either approach, you will need to know the official chain ID (`CHAIN_ID`) and latest binary version release tag (`CHAIN_VERSION`) for the chain you want to use Skip on.

You can find the correct values for these variables [here](/3-chain-configuration.md).
:::

:::caution Not applicable for Injective
Because the Injective codebase is not open source, this approach is not suitable for Injective. You must follow the special injective instructions [here](validator/8-injective-build.md)
:::

- **Automated replacement**

  Run the following commands to automatically update your `go.mod` file with the correct version of mev-tendermint:

  ```bash
  export CHAIN_ID=<CHAIN ID>
  export CHAIN_VERSION=<CHAIN_VERSION_RELEASE_TAG>
  CONFIG_REPO="https://raw.githubusercontent.com/skip-mev/config/main/$CHAIN_ID/$CHAIN_VERSION" && \
  MEV_TENDERMINT_VERSION="$(curl -s "$CONFIG_REPO/mev-tendermint_version.txt")" && \
  go mod edit -replace github.com/tendermint/tendermint=github.com/skip-mev/mev-tendermint@$MEV_TENDERMINT_VERSION
  ```

- **Manual Replacement**
  Find the correct mev-tendermint version tag [here](select/3-chain-configuration.md) or run:

  ```bash
  export CHAIN_ID=<CHAIN ID>
  export CHAIN_VERSION<CHAIN VERSION>
  curl https://raw.githubusercontent.com/skip-mev/config/main/$CHAIN_ID/$CHAIN_VERSION/mev-tendermint_version.txt
  ```

  Once you have the correct version of mev-tendermint, open the `go.mod` file and add the following line at the end:

  ```tsx
  replace (
    // Other stuff...
    github.com/tendermint/tendermint => github.com/skip-mev/mev-tendermint <VERSION TAG>
  )
  ```

### 🚨🚨 **After performing the replacement run `go mod tidy` 🚨🚨**

### Ansible Playbooks [Tessellated](https://tessellatedgeometry.com/) and [Polkachu](https://polkachu.com)

[Tessellated/Skip-Playbooks](https://github.com/Tessellated-io/skip-playbooks) provides reference implementations of Ansible Playbooks that:

- Enter a target host
- Clone the node source code
- Patch the appropriate version of `mev-tendermint` into the code base
- Make the necessary config modifications, and clean up after themselves.

[Polkachu/cosmos-validators](https://github.com/polkachu/cosmos-validators) also provides useful refrence implementations of Ansible playbooks that work similarly.

### Pre-built full node binaries

Coming soon...
