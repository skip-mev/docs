---
description: Skip Validator Quickstart
title: Validator Quickstart
sidebar_position: 0
---

It takes just 5 minutes to start using Skip Select to capture MEV with your validator.

## Summary of Steps

**Estimated Time**: 5-10 mins

1. Register as a validator on [skip.money/registration](http://skip.money/registration) to receive an API key
2. Replace `tendermint` with `mev-tendermint` on all of your nodes
3. Add 3-4 lines of additional config to your nodes
4. Recompile your binary and restart your nodes 🚀

Here’s a quick overview by [Blockpane:](https://blockpane.com/)

<iframe className="video" src="https://www.youtube.com/embed/_75A4RWWwaM" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>

**Any questions / issues during integration? Ask us on [Discord](https://discord.gg/amAgf9Z39w)**

## Chain IDs that Skip supports:

### Mainnets

- Juno Mainnet `CHAIN_ID=juno-1`
- Terra2 Mainnet `CHAIN_ID=phoenix-1`
- EVMOS Mainnet `CHAIN_ID=evmos_9001-2`
- Injective Mainnet `CHAIN_ID=injective-1`
- COMDEX Mainnet `CHAIN_ID=comdex-1`

### Testnets

- Juno Testnet `CHAIN_ID=uni-6`
- Terra2 Testnet `CHAIN_ID=pisco-1`
- EVMOS Testnet `CHAIN_ID=evmos_9000-4`
- Injective Testnet `CHAIN_ID=injective-888`
- Comdex Testnet `CHAIN_ID=comdex-test2`

---

## 1. Register ✅

**🚨**  If you don’t already have an API Key, **please get one from the [Skip registration site](https://skip.money/registration) 🚨**

💵 **You can also configure your MEV payments between you / network stakers on the site.**

🆘 If you cannot access your validator operator key or any key with <code>MsgVote</code> authorization in Keplr, please contact us on <a href="https://discord.gg/amAgf9Z39w" target="_blank">Discord</a>. We will manually add you to the system.

---

## 2. Replace Tendermint

You must build the chain client with the mev-tendermint instead of tendermint. Below you can find instructions
to perform the replacement automatically or manually.

- **Automated replacement**
  Run the following commands to automatically update your go.mod file with the correct version of mev-tendermint:

  ```bash
  export CHAIN_ID=<CORRECT CHAIN ID>
  export CHAIN_VERSION=<CHAIN_VERSION_RELEASE_TAG>
  CONFIG_REPO="https://raw.githubusercontent.com/skip-mev/config/main/$CHAIN_ID/$CHAIN_VERSION" && \
  MEV_TENDERMINT_VERSION="$(curl -s "$CONFIG_REPO/mev-tendermint_version.txt")" && \
  go mod edit -replace github.com/tendermint/tendermint=github.com/skip-mev/mev-tendermint@$MEV_TENDERMINT_VERSION
  ```

- **Manual Replacement**
  Find the correct mev-tendermint version tag [here](./../3-chain-configuration.md) or run:

  ```bash
  export CHAIN_ID=<USE CORRECT CHAIN ID>
  export CHAIN_VERSION<USE CORRECT CHAIN VERSION>
  curl https://raw.githubusercontent.com/skip-mev/config/main/$CHAIN_ID/$CHAIN_VERSION/mev-tendermint_version.txt
  ```

  Once you have the correct version of mev-tendermint, open the go.mod file and add the following line at the end:

  ```tsx
  replace (
    // Other stuff...
    github.com/tendermint/tendermint => github.com/skip-mev/mev-tendermint <VERSION TAG>
  )
  ```

### 🚨🚨 **After performing the replacement run `go mod tidy` 🚨🚨**

:::tip Alternative to replacing tendermint yourself

Instead of replacing `tendermint` with `mev-tendermint` yourself, you can simply checkout and build the github.com/skip-mev fork of chain source code, where we have already performed the replacement for you in the VERSION_TAG-mev tags.

For example, https://github.com/skip-mev/evmos/releases/tag/v10.0.1-mev is v10.0.1 of EVMOS with the correct version of mev-tendermint already added for you.

Read more about other methods for automatically installing mev-tendermint [here](./4-autobuild.md)
:::

:::info Replace tendermint on all nodes
If you use Horcrux or any other infrastructure set up that requires multiple full nodes, you need to replace Tendermint on all of them.

:::

## 3. Update config.toml

`mev-tendermint` introduces a new section of config in `config.toml` called `[sidecar]` that includes several
config settings that allow your node to recieve MEV bundles from Skip.

(Optional: you can read more about what these are here: [Validator Config Reference Docs](./3-config.md))

…by the end, the end of your `config.toml` on each node will look something like this (with different string values). **Make sure to include the line `[sidecar]` at the top of this section in `config.toml`.**

```bash
# OTHER CONFIG...

# EXAMPLE below (please use the correct values)
[sidecar]
sentinel_peer_string = "fakepeerid@fake_network_id-sentinel.skip.money:26656"
sentinel_rpc_string = "http://fake_network_id.skip.money"
api_key = "fake_api_key"
```

- For api_key, use the value you obtained by registering for Skip Select in the first step.

- **Find the correct values for sentinel_peer_string and sentinel_rpc_string in the table below:**

  **Mainnets**

  | Chain name     | Chain ID     | Supported Chain Version | sentinel_rpc_string                | sentinel_peer_string                                                            |
  | -------------- | ------------ | ----------------------- | ---------------------------------- | ------------------------------------------------------------------------------- |
  | JUNO Mainnet   | `juno-1`       | v12.0.0                 | https://juno-1-api.skip.money       | 8dd5dfefe8959f7186e6c80bdb87dbd919534677@juno-1-sentinel.skip.money:26656       |
  | EVMOS Mainnet  | `evmos_9001-2` | v11.0.1 v11.0.2         | https://evmos-9001-2-api.skip.money | c0a2990e2a5dad7f4ace044d2f936de6891c6f0a@evmos-9001-2-sentinel.skip.money:26656 |
  | Terra2 Mainnet | `phoenix-1`    | v2.2.0                  | https://phoenix-1-api.skip.money    | 20a61f70d93af978a3bc1d6be634a57918934f79@phoenix-1-sentinel.skip.money:26656    |
  | Injective Mainnet | `injective-1`  | v1.9.0               | https://injective-1-api.skip.money  | 6f3b548716049d83ab701a1eddef56bd202c09db@injective-1-sentinel.skip.money:26656  | 
  | Comdex Mainnet    | `comdex-1`     | v7.0.0               |  https://comdex-1-api.skip. money   | 79505b5fb2782acbea09059abde58e7bca76c8e1@comdex-1-sentinel.skip.money:26656     | 

  **Testnets**

  | Chain name        | Chain ID      | Supported Chain Version | sentinel_rpc_string                  | sentinel_peer_string                                                              |
  |---------------|-------------------------|--------------------------------------|-----------------------------------------------------------------------------------| -------------------------------------------------------------------------------- |
  | JUNO Testnet      | uni-6         | v13.0.0-beta.1          | https://uni-6-api.skip.money         | f18d6e226545b348aa37c86cc735d0620838fcd8@uni-6-sentinel.skip.money:26656          |
  | EVMOS Testnet     | evmos_9000-4  | v11.0.0-rc3             | https://evmos-9000-4-api.skip.money  | 4d8990908ae5cbe7783192c0364db4a90af56dbc@evmos-9000-4-sentinel.skip.money:26656   |
  | Injective Testnet | injective-888 | v1.9                    | https://injective-888-api.skip.money | 24b0ca5c32b1c90fe7e373075de1d94ddf94c0b3@injective-888-sentinel.skip.money:26656  |
  | Terra 2 Testnet   | pisco-1       | v2.2.0                  | https://pisco-1-api.skip.money       | 5cc5e6506818a113387d92e0b60a7206845b4d7e@pisco-1-sentinel.skip.money:26656        |
| Comdex Testnet    | comdex-test2  | v9.0.0             | https://comdex-test2-api.skip.money  | `0ef2b039f0f370be9c5f39924923e96ef94bc87f@comdex-test2-sentinel.skip.money:26656` | 


- **Extra config for sentry configurations 🏛**

  - **On the sentry nodes:**

    - Add an **extra line** to the `[sidecar]` config called **`personal_peer_ids`**, and add the node id for your **validator**

    ```jsx
    [sidecar];
    sentinel_peer_string =
      "d1463b730c6e0dcea59db726836aeaff13a8119f@uni-6-sentinel.skip.money:26656";
    sentinel_rpc_string = "http://uni-6-api.skip.money";
    api_key = "2314ajinashg2389jfjap";
    personal_peer_ids = "NODEID1,NODEID2, ...";
    ```

    → You can find your node ids by running:

    ```jsx
    <NODE_DAEMON> tendermint show-node-id --home <HOME_DIR>

    # example:
    junod tendermint show-node-id --home ./juno
    ```

  - **On the validator:**

    - **Remove** the line for `sentinel_peer_string`
    - **Remove** the line for `sentinel_rpc_string`
    - **Remove** the line for `api_key`
    - Add an **extra line** to the `[sidecar]` config called **`personal_peer_ids`**, and add the node ids for your **sentry nodes**

    ```jsx
    [sidecar];
    personal_peer_ids = "NODEID1,NODEID2, ...";
    ```

    → You can find your node ids by running:

    ```jsx
    <NODE_DAEMON> tendermint show-node-id --home <HOME_DIR>

    # example:
    junod tendermint show-node-id --home ./juno
    ```

---

## 4. Recompile your Binary & Restart 🚀

**That’s it!** You should now begin receiving MEV bundles and higher rewards from Skip ✅

**If you use Cosmovisor, make sure to point it to the new binary**

**Run `curl -sL localhost:26657/status | jq .result.mev_info` to check if you are connected**

- If things are working correctly you should see this:

  ```jsx
  {
    "is_peered_with_sentinel": true,
    "last_received_bundle_height": "0"
  }
  ```

- **Troubleshooting**: If you aren't receiving the expected output, please visit the [troubleshooting page](./1-troubleshooting.md) or get in touch with Skip team for assistance.

- **Monitoring:** mev-tendermint exposes new Prometheus metrics under the "mev" namespace in tendermint.
  The most important metric is `mev_sentinel_connected`, which is 1 if your node is able to receive MEV transactions
  from Skip, and 0 otherwise. Check out [this page](./2-metrics.md) for more information on metrics

### Handling Chain Upgrades

Handling chain upgrades is simple:

1. Check out the latest chain version tag
2. Compile the your binary with the correct `mev-tendermint` instead of tendermint **(same as step 2 above)**, keeping the same config

Alternatively, check out [the page on automatically installing mev-tendermint](./4-autobuild.md)
