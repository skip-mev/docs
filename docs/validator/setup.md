---
description: Skip Validator Setup
---
# Setup 
[5-10 mins]

## Summary of Steps

1. Register as a validator on [**skip.money/registration**](http://skip.money/registration) to receive an API key
2. Replace `tendermint` with `mev-tendermint` on all of your nodes 
3. Add 3-4 lines of additional config to your nodes
4. Recompile your binary and restart your nodes 🚀

Here’s a quick overview by [Blockpane:](https://blockpane.com/)

[https://www.youtube.com/watch?v=_75A4RWWwaM](https://www.youtube.com/watch?v=_75A4RWWwaM)

**Any questions / issues during integration? Ask us: [https://discord.gg/amAgf9Z39w](https://discord.gg/amAgf9Z39w)**

## Chain IDs that Skip supports:

### Mainnets

- Juno Mainnet `CHAIN_ID=juno-1`
- EVMOS Mainnet `CHAIN_ID=9001-2`
- Terra2 Mainnet `CHAIN_ID=phoenix-1`

### Testnets

- Juno Testnet `CHAIN_ID=uni-5`
- Terra2 Testnet `CHAIN_ID=pisco-1`
- EVMOS Testnet `CHAIN_ID=evmos_9000-4`
- Injective Testnet `CHAIN_ID=injective-888`

---

# 1. Register ✅

**🚨**  If you don’t already have an API Key, **please get one from the [Skip registration site](https://skip.money/registration) 🚨**

💵 **You can also configure your MEV payments between you / network stakers on the site.**

<aside>
🆘 If you cannot access your validator operator key or any key with `MsgVote` authorization in Keplr, please contact us on [**discord**](https://discord.gg/amAgf9Z39w). We will manually add you to the system.

</aside>

---

# 2. Replace Tendermint ♻️

In the `go.mod` file of the directory you use to compile your chain binary, add a line into `replace` to import the correct `mev-tendermint` version.

```tsx
replace (
	// Other stuff...
	****github.com/tendermint/tendermint => github.com/skip-mev/mev-tendermint <USE CORRECT VERSION TAG>
)
```

- **[Automatic]: set it automatically with these commands 👇**
    
    ```bash
    export CHAIN_ID=<CORRECT CHAIN ID>
    export CHAIN_VERSION=<CHAIN_VERSION_RELEASE_TAG>
    ```
    
    ```bash
    CONFIG_REPO="https://raw.githubusercontent.com/skip-mev/config/main/$CHAIN_ID/$CHAIN_VERSION" && \
    MEV_TENDERMINT_VERSION="$(curl -s "$CONFIG_REPO/mev-tendermint_version.txt")" && \
    go mod edit -replace github.com/tendermint/tendermint=github.com/skip-mev/mev-tendermint@$MEV_TENDERMINT_VERSION
    ```
    
- **[Manual]: find the correct version-tag to use 👇**
    - [👇 **(Expand) Find the correct values for these here👇**](Validator%20Setup%20%5B5-10%20mins%5D%20f818646429524356a4e878f1d70866b1.md)
    - Or run:
        
        ```bash
        export CHAIN_ID=<USE CORRECT CHAIN ID>
        curl [https://raw.githubusercontent.com/skip-mev/config/main/](https://raw.githubusercontent.com/skip-mev/config/main/$CHAIN_ID)$CHAIN_ID/mev-tendermint_version.txt
        ```
        

### 🚨🚨 **After adding the line to replace, run `go mod tidy` 🚨🚨**

<aside>
♻️ If you use Horcrux or any other infrastructure set up that requires multiple full nodes, you need to replace Tendermint on all of them.

</aside>

---

# 3. Config ⚙️

`mev-tendermint` introduces a new section of config in `config.toml` called `[sidecar]`.

(Optional: you can read more about what these are here: [Validator Config Reference Docs](Validator%20Config%20Reference%20Docs%20b9b1423aefd84719af6c6b4a09d4ad4f.md))

…by the end, the end of your `config.toml` on each node will look something like this (with different string values). ****************************************************************Make sure to include the line `[sidecar]` at the top of this section in `config.toml`.**

```bash
# OTHER CONFIG...

# **EXAMPLE** below (please use the correct values)
**[sidecar]
relayer_peer_string = "d1463b730c6e0dcea59db726836aeaff13a8119f@uni-5-sentinel.skip.money:26656"
relayer_rpc_string = "http://uni-5-api.skip.money"
api_key = "2314ajinashg2389jfjap"**
```

- 👇 **(Expand) Find the correct values for these here👇**
    
    ****************Mainnets****************
    
    | Chain name | Chain ID | Supported Chain Version | relayer_rpc_string | relayer_peer_string | MEV-tendermint Version | AuctionHouse Address |
    | --- | --- | --- | --- | --- | --- | --- |
    | JUNO Mainnet | juno-1 | v11.0.3 v11.0.0 | http://juno-1-api.skip.money | 8dd5dfefe8959f7186e6c80bdb87dbd919534677@juno-1-sentinel.skip.money:26656 | v0.34.21-mev.12 | juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4 |
    | EVMOS Mainnet | evmos_9001-2 | v9.1.0 | http://evmos_9001-2-api.skip.money | c0a2990e2a5dad7f4ace044d2f936de6891c6f0a@evmos_9001-2-sentinel.skip.money:26656 | v0.34.22-mev.12 | evmos17yqtnk08ly94lgz3fzagfu2twsws33z7cpkxa2 |
    | Terra2 Mainnet | phoenix-1 | v2.2.0 | http://phoenix-1-api.skip.money | 20a61f70d93af978a3bc1d6be634a57918934f79@phoenix-1-sentinel.skip.money:26656 | v0.34.21-terra.1-mev.13 | terra1d5fzv2y8fpdax4u2nnzrn5uf9ghyu5sxr865uy |
    
    **Testnets**
    
    | Chain name | Chain ID | Supported Chain Version | relayer_rpc_string | relayer_peer_string | MEV-tendermint Version | AuctionHouse Address |
    | --- | --- | --- | --- | --- | --- | --- |
    | JUNO Testnet | uni-5 | v11.0.0-alpha | http://uni-5-api.skip.money | f18d6e226545b348aa37c86cc735d0620838fcd8@uni-5-sentinel.skip.money:26656 | v0.34.21-mev.12 | juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4 |
    | EVMOS Testnet | evmos_9000-4 | v10.0.0-rc4 | http://evmos_9000-4-api.skip.money | 4d8990908ae5cbe7783192c0364db4a90af56dbc@evmos_9000-4-sentinel.skip.money:26656 | v0.34.24-mev.13 | evmos17yqtnk08ly94lgz3fzagfu2twsws33z7cpkxa2 |
    | Injective Testnet | injective-888 | v1.8  | http://injective-888-api.skip.money | 24b0ca5c32b1c90fe7e373075de1d94ddf94c0b3@injective-888-sentinel.skip.money:26656 | v0.34.23-mev.12 | inj1mwj9kxxxuflr233pulfk037lr55jv680wy5sm4 |
    | Terra 2 Testnet | pisco-1 | v2.2.0 | http://pisco-1-api.skip.money | 5cc5e6506818a113387d92e0b60a7206845b4d7e@pisco-1-sentinel.skip.money:26656 | v0.34.21-terra.1-mev.13 | terra1d5fzv2y8fpdax4u2nnzrn5uf9ghyu5sxr865uy |
    

- **Extra config for sentry configurations 🏛**
    - **On the sentry nodes:**
        - Add an **extra line** to the `[sidecar]` config called `**personal_peer_ids**`, and add the node id for your **validator**
        
        ```jsx
        [sidecar]
        relayer_peer_string = "d1463b730c6e0dcea59db726836aeaff13a8119f@uni-5-sentinel.skip.money:26656"
        relayer_rpc_string = "http://uni-5-api.skip.money"
        ****api_key = "2314ajinashg2389jfjap"
        **************************************************************************************personal_peer_ids = "NODEID1,NODEID2, ..."**************************************************************************************
        ```
        
        → You can find your node ids by running:
        
        ```jsx
        <NODE_DAEMON> tendermint show-node-id --home <HOME_DIR>
        
        **# example:**
        junod tendermint show-node-id --home ./juno
        ```
        
    - **On the validator:**
        - **Remove** the line for `relayer_peer_string`
        - **Remove** the line for `relayer_rpc_string`
        - **************Remove************** the line for `api_key`
        - Add an **extra line** to the `[sidecar]` config called `**personal_peer_ids`,** and add the node ids for your ************************sentry nodes************************
        
        ```jsx
        [sidecar]
        **************************************************************************************personal_peer_ids = "NODEID1,NODEID2, ..."**************************************************************************************
        ```
        
        → You can find your node ids by running:
        
        ```jsx
        <NODE_DAEMON> tendermint show-node-id --home <HOME_DIR>
        
        **# example:**
        junod tendermint show-node-id --home ./juno
        ```
        

---

# 4. Recompile your Binary & Restart 🚀

**That’s it!** You should now begin receiving MEV bundles and higher rewards from Skip ✅

**→ If you use Cosmovisor, make sure to point it to the new binary**

- **e.g.** `mv ~/go/bin/evmosd ~/.evmosd/cosmovisor/current/bin/`

**→ Run `curl [http://localhost:26657/status](http://localhost:26657/status)` to check if you are connected**

- This should appear at the end of the response:

```jsx
 ”is_peered_with_relayer”: true
```

---

### Monitoring & Troubleshooting ✍️

- Check if you **are running `mev-tendermint`** by running either 👇
    
    ```bash
    **# by running binary**
    curl -sL localhost:26657/status | jq .result.mev_info
    
    **# or by checking version detail**
    junod version --long | grep mev
    ```
    
- Check if you are **peered with the sentinel** by running **👇**
    
    Run `**curl http://localhost:26657/status**`
    
    You should see, at the bottom:
    
    ```jsx
     ”is_peered_with_relayer”: true
    ```
    
    1. 🚨 If this is not showing, you are likely not running `mev-tendermint`
    2. 🚨 If this is showing false, it’s either that the sentinel is down (unlikely), or you have an incorrect **`relayer_peer_string`** (more common)
- Check if you are **************properly registered with your API Key************** by running **************👇**************
    
    ```bash
    curl <**RELAYER_RPC_STRING**> --header "Content-Type: application/json" --request POST --data '{"method": "get_peers", "params": ["**<API_KEY>**"], "id": 1}'
    
    **# EXAMPLE**
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
        
    2. 🚨 If you don’t see your peers connected, you likely have an incorrect `**api_key**` or `**relayer_rpc_string**` configuration
- Check new **prometheus metrics below** exposed on `mev-tendermint` 👇
    - In particular, you can track `**sidecar_relay_connected**` to check connection
    - View the new prometheus metrics exposed on mev-tendermint. See this page for more details: [Metrics](Metrics%20484630ff18514fd29b4a2585f5b29dd8.md)
    - These can be added to a Grafana dashboard, for example via this [**dashboard that Polkachu made**](https://gist.github.com/PolkachuIntern/0083c88ad16eecc2bea1c8e4d85960ed)

---

### ⚙️ Handling Chain Upgrades

Handling chain upgrades is simple:

1. Apply the latest patch to your validators & nodes, **without `mev-tendermint`**
    1. If you have local changes to `go.mod` and `go.sum` that prevent you from pulling the new version, you can run:
    
    ```bash
    git stash
    git stash apply
    ```
    
    … to remove them first, then pull again
    
2. Recompile your binary with `mev-tendermint` (**same as step 2)**, keeping the same config
3. Restart your nodes and validators, you’re back up! 🎉
