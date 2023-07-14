---
description: Skip Validator Quickstart
title: Validator Quickstart
sidebar_position: 0
---

It takes just 5 minutes to start using Skip Select to capture MEV with your validator. Even less on chains that include `mev-tendermint` by default.

## Summary of Steps

**Estimated Time**: 5 mins

1. Register as a validator on [skip.money/registration](http://skip.money/registration) to receive an API key
2. Compile your node binaries with `mev-tendermint` (if mev-tendermint is not included in the chain binary by default)
3. Add 3-4 lines of additional config to your nodes
4. Restart your nodes 🚀

**Any questions / issues during integration? Ask us on [Discord](https://discord.gg/amAgf9Z39w)**

## Chain IDs that Skip supports:

### Mainnets

- Juno Mainnet `CHAIN_ID=juno-1`
- Terra2 Mainnet `CHAIN_ID=phoenix-1`
- Neutron Mainnet `CHAIN_ID=neutron-1`

### Testnets

- Juno Testnet `CHAIN_ID=uni-6`
- Terra2 Testnet `CHAIN_ID=pisco-1`
- Neutron Testnet `CHAIN_ID=pion-1`

## Chain IDs that include `mev-tendermint` by default

### Mainnets

- Juno Mainnet `CHAIN_ID=juno-1`
- Neutron Mainnet `CHAIN_ID=neutron-1`

### Testnets

- Juno Testnet `CHAIN_ID=uni-6`
- Neutron Testnet `CHAIN_ID=pion-1`

---

## 1. Register ✅

**🚨**  If you don’t already have an API Key, please get one from the [Skip registration site](https://skip.money/registration).

You will need access to your operator key or a key to which your operator has delegated a `MsgVote` authorization to register. See [these instructions](api-key) for how to a `MsgVote` authorization if you're not comfortable using your operator key from a browser wallet.

💵 **After registering, you can also use the Skip web app to configure your MEV payments between you / network stakers on the site.**

## 2. Compile your node with `mev-tendermint`

**THIS STEP IS ONLY REQUIRED IF YOUR CHAIN DOES NOT INCLUDE `mev-tendermint` BY DEFAULT.**

We provide forks of the source code for all the open source chains we support at https://github.com/skip-mev that come pre-loaded with mev-tendermint _and no other modifications_.

1. Set `SKIP_CHAIN_REPO` to the name of the fork of the chain you're building:

- **JUNO:** `export SKIP_CHAIN_REPO=juno`
- **Terra2:** `export SKIP_CHAIN_REPO=terra-core`

2. Clone the appropriate fork and enter the directory:

```bash
git clone https://github.com/skip-mev/$SKIP_CHAIN_REPO
cd $SKIP_CHAIN_REPO
```

3. Determine the current version of the chain binary using the official chain documentation or Skip's documentation [here](../chain-configuration). and checkout the corresponding `-mev` tag:

```bash
git checkout $CHAIN_VERSION-mev
```

4. Build the binary as normal using `make install`

:::note Example
For example, if we were building v14.1.0 of Juno, the process would look like:

```bash
git clone https://github.com/skip-mev/juno
cd juno
git checkout v14.1.0-mev
make install
```

:::

5. Repeat this process for all of your full nodes, including if you use Horcrux.

:::info Alternative methods
Read more about other methods that do not require forking our repos [here](alternatives) if you would prefer to use the official chain repo and inject `mev-tendermint` yourself
:::

## 3. Update config.toml

`mev-tendermint` introduces a new section of config in `config.toml` called `[sidecar]` that includes several
config settings that allow your node to recieve MEV bundles from Skip.

(You can read more about what these are here: [Validator Config Reference Docs](select/validator/config))

By the end, the end of your `config.toml` on each node will look something like this (with different string values). **Make sure to include the line `[sidecar]` at the top of this section in `config.toml`.**

```yaml
# OTHER CONFIG...

# EXAMPLE below (please use the correct values)
[sidecar]
sentinel_peer_string = "fakepeerid@fake_network_id-sentinel.skip.money:26656"
sentinel_rpc_string = "http://fake_network_id.skip.money"
api_key = "fake_api_key"
```

- For `api_key`, use the value you obtained by registering for Skip Select in the first step.

- **Find the correct values for sentinel_peer_string and sentinel_rpc_string in the table below:**

  **Mainnets**

  | Chain name      | Chain ID    | Supported Chain Version | sentinel_rpc_string                | sentinel_peer_string                                                           |
  | --------------- | ----------- | ----------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
  | JUNO Mainnet    | `juno-1`    | `v15.0.0`               | `https://juno-1-api.skip.money`    | `8dd5dfefe8959f7186e6c80bdb87dbd919534677@juno-1-sentinel.skip.money:26656`    |
  | Terra 2 Mainnet | `phoenix-1` | `v2.4.1`                | `https://phoenix-1-api.skip.money` | `20a61f70d93af978a3bc1d6be634a57918934f79@phoenix-1-sentinel.skip.money:26656` |
  | Neutron Mainnet | `neutron-1` | `v1.0.1`                | `https://neutron-1-api.skip.money` | `08a1653fd6669468f8b9c22d70f476a5b27f576a@neutron-1-sentinel.skip.money:26656` |

  **Testnets**

  | Chain name      | Chain ID  | Supported Chain Version | sentinel_rpc_string              | sentinel_peer_string                                                         |
  | --------------- | --------- | ----------------------- | -------------------------------- | ---------------------------------------------------------------------------- |
  | JUNO Testnet    | `uni-6`   | `v15.0.0-alpha.1`       | `https://uni-6-api.skip.money`   | `f18d6e226545b348aa37c86cc735d0620838fcd8@uni-6-sentinel.skip.money:26656`   |
  | Terra 2 Testnet | `pisco-1` | `v2.4.0-rc.5`           | `https://pisco-1-api.skip.money` | `5cc5e6506818a113387d92e0b60a7206845b4d7e@pisco-1-sentinel.skip.money:26656` |
  | Neutron Testnet | `pion-1`  | `v1.0.0-rc1`            | `https://pion-1-api.skip.money`  | `f44aa4467a5c411f650fd9223644d70afc1eacd1@pion-1-sentinel.skip.money:26656`  |

### Extra config for sentry configurations

**Skip this section if you don't use full node sentries, or, equivalently, if you'd like all of your nodes to gossip directly to the sentinel.**

These steps are only relevant for folks with set ups where they want one of their nodes to not peer with the Sentinel (e.g. a full signing node with sentries) and instead receive MEV bundles through an intermediary node (e.g. a sentry node)

- **On the sentry nodes:**

  - Add an **extra line** to the `[sidecar]` config called **`personal_peer_ids`**, and add the node id for your **validator**

  ```yaml
  [sidecar];
  sentinel_peer_string =
    "fake-node-id@fake-network-id-sentinel.skip.money:26656";
  sentinel_rpc_string = "http://fake-network-id-api.skip.money";
  api_key = "fake-api-key";
  personal_peer_ids = "NODEID1,NODEID2, ...";
  ```

  → You can find your node ids by running:

  ```bash
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

## 4. Restart your node 🚀

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

- **Troubleshooting**: If you aren't receiving the expected output, please visit the [troubleshooting page](troubleshooting) or get in touch with Skip team for assistance.

- **Monitoring:** mev-tendermint exposes new Prometheus metrics under the "mev" namespace in tendermint.
  The most important metric is `mev_sentinel_connected`, which is 1 if your node is able to receive MEV transactions
  from Skip, and 0 otherwise. Check out [this page](monitoring) for more information on monitoring and alerting solutions

### Handling Chain Upgrades

Skip does not make chain upgrades more complex.

Simply follow the instructions from [step 2 above](#2-compile-your-node-with-mev-tendermint) each time you need to upgrade a node, using the new `$CHAIN_VERSION-mev` tag.
