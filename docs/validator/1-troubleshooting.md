---
description: Validator Troubleshooting
title: Troubleshooting Guide
sidebar_position: 1
---

# Troubleshooting

<aside>
⚠️ Are you having trouble starting your node with mev-tendermint? We’ve compiled a list of common problems we’ve seen many validators experience

</aside>

## How do I know if mev-tendermint is working as expected?
If mev-tendermint is working correctly `curl -sL localhost:26657/status | jq .result.mev_info` should return: 

```jsx
{
    "is_peered_with_sentinel": true,
    "last_received_bundle_height": "0"
}
```

- `is_peered_with_sentinel` should be true for all nodes exposed to the internet (i.e. those that should 
receive MEV bundles directly from Skip) and false for validator nodes that are protected behind sentries>
- `last_received_bundle_height` should update from time to time as your node receives MEV bundles from Skip

### Check that your validator is configured correctly

- We recommend 0-5 `persistent_peers`. Many validators have reported reduced performance of tendermint and mev-tendermint
when using more than several `persistent_peers`
- `seed` mode should be set to `false`. Seed mode regularly drops inbound peers and can lead to missed blocks.
- `timeout_commit` should be set to the chain's default value. You can find this by running `simd init test --home my-test-dir` and checking the value of `timeout_commit` in `my-test-dir/config/config.toml`

### Check that your node is built with mev-tendermint
If the result of `curl -sL localhost:26657/status | jq .result.mev_info` is `null`, your node binary wasn't built with mev-tendermint. Revisit the [quickstart guide](./0-quickstart.md) or [the page on automatically building with mev-tendermint](./4-autobuild.md)


### Check that you are registered with Skip
Check if you are **_properly registered with your API Key_** by running:

```bash
curl <SENTINEL_RPC_STRING> --header "Content-Type: application/json" --request POST --data '{"method": "get_peers", "params": ["**<API_KEY>**"], "id": 1}'

# EXAMPLE
curl http://juno-1-api.skip.money/ --header "Content-Type: application/json" --request POST --data '{"method": "get_peers", "params": ["YdtqnUpRsWOCK1wFIVBW1/rGGqY="], "id": 1}'
```

1. 🚨 When you run this, you should see your peers connected, example below:

    ```bash
    {
      "jsonrpc": "2.0",
      "id": 1,
      "result": {
        "**Peers": [
          "557611c7a7307ce023a7d13486b570282521296d@34.205.156.129:49510"
        ],**
        "code": 0
      }
    }
    ```

2. 🚨 If you don’t see your peers connected, you likely have an incorrect **`api_key`** or **`sentinel_rpc_string`** configuration



### Check your go.mod file is correct

Problems with mev-tendermint set up can often be traced back to your go.mod file.

**Symptoms:**

- Can’t compile chain binary due to incompatible data types
- mev-tendermint doesn’t appear to be running when you successfully compile the binary

**Here are a few components to investigate (The answer to each of these questions should be yes):**

- **_*Do you have a tendermint ⇒ mev-tendermint replace statement?*_**
  → Towards the bottom of your go.mod file you should have a line that looks like this:
  `replace [github.com/tendermint/tendermint](http://github.com/tendermint/tendermint) => [github.com/skip-mev](http://github.com/skip-mev)/mev-tendermint MEV_TENDERMINT_VERSION`
  → If you don’t have the replace statement, your node will run without communicating with Skip and will be unable to receive MEV bundles that increase your validator rewards
  → Find the mev-tendermint version you should be using [here](./config.md)
- **_*Do you have EXACTLY 1 `tendermint/tendermint` replace statement?*_**
  → Some chains (e.g. Terra2) replace tendermint with their own version of tendermint using a go.mod replace statement, just like we do. If you leave that pre-existing replace statement in the go.mod file and you add one to replace tendermint with mev-tendermint, the client will not compile. So make sure you get rid of that pre-existing replace statement.
- **_*Is mev-tendermint in a `replace` section AND not in a `require` section?*_**
  → If mev-tendermint is in the `require` section of the file rather than the replace section, the binary will fail to compile.
  → You need to ensure the `require` section still includes a “vanilla” version of tendermint (e.g. `github.com/tendermint/tendermint v0.34.23` ), and that mev-tendermint is only introduced in the `replace` section
- **_Are you using the version of mev-tendermint that matches the version in [github.com/skip-mev/config/](http://github.com/skip-mev/config/) (in the directory for your chain_id and chain_version)?_**
  → Often times, compilation and runtime errors can be caused by using an old version of mev-tendermint.
  <!--- TODO:"config repo" used to be a link to the same page --->
  → Double check that the version referenced in the `replace` statement in your `go.mod` file matches the version in [Skip’s docs](./config.md) / the config repo for your particular chain id and chain version. (The chain id should be listed in the chain’s official documentation, and the chain version tag can be found in the latest upgrade announcement for the chain and usually in their official docs or github repos)

### Double check your application version

Problems with mev-tendermint very frequently arise just from folks running an old or unreleased/not-yet-supported version of the chain application code. (And this causes failures that have nothing to do with mev-tendermint)

**Symptoms**

- Node app hashes on receiving a proposal
- Node does not start
- Chain height does not advance

**_To ensure this is not the source of your problems, double check a couple trustworthy sources of the live chain version to find the correct version tag:_**

<!--- TODO: This used to link to the same page --->

- Polkachu’s live node version
- The most recent network upgrade announcement (usually in the chain’s Discord)
- The chain’s official documentation (though we’ve noticed this is frequently out of date)
- Verify with other validator operators you know (e.g. Ask in the chain’s discord or in Skip’s discord / Telegram for the chain)

**_Once you have high confidence in a version tag for the chain binary, make sure you checkout that version before building the binary from source, e.g.:_**

```bash
cd ~/chain-source-code
git checkout vX.Y.Z
go mod tidy
make install
```

### Double check your config

Folks frequently misconfigure some of the Skip settings `config.toml`

**Symptoms:**

- Node panic on start-up
- Failure to connect to sentinel

**Here are some questions to investigate that cover the most common sources of error we’ve seen in config:**

- **_Does your `config.toml` file have a `[sidecar]` section?_**
  → Ensure that the config/config.toml file that your node is loading at startup has the `[sidecar]` section that Skip expects. Folks commonly exclude this by accident in cases where they’re unsure where their node is loading the file from
- **_Does `sentinel_rpc_string` have `http://` at the start?_**
  → `sentinel_rpc_string` needs to have http:// at the beginning. Folks often cut it by mistake or for cleanliness, thinking it’s not necessary
  → The sentinel RPC server is not configured to function over HTTPS, so ensure your prefix is `http` and NOT `https`
- **_Does `sentinel_peer_string` NOT have `http://` at the start?_**
  → `sentinel_peer_string` **should not** have http at the beginning because it is a tendermint p2p node identifier
  → Folks often accidentally prepend the string with `http://` by pasting it into the Google Chrome address bar then copying it to ensure it’s plain text (Chrome gets carried away for some reason)
- **Do any of the config settings you’ve added have curly quotes?**
  → Your quotes need to be straight, plain-text quotes, rather than rich-text curly quotes
  → Folks sometimes introduce curly quotes by copying the quotes into a chat service or an editor that assumes rich text by default and makes the conversion (Slack is a common culprit)
 