---
description: Validator Troubleshooting
---

# Troubleshooting

<aside>
⚠️ Are you having trouble starting your node with [mev-tendermint](https://www.notion.so/dYdX-Skip-MEV-Research-Proposal-4aeb5e75bb90490c9a29ac7d967d8a27)? We’ve compiled a list of common problems we’ve seen many validators experience

</aside>

### Double check your go.mod file

Problems with mev-tendermint set up can often be traced back to your go.mod file.

**Symptoms:**

- Can’t compile chain binary due to incompatible data types
- mev-tendermint doesn’t appear to be running when you successfully compile the binary

**Here are a few components to investigate (The answer to each of these questions should be yes):**

- **_Do you have a tendermint ⇒ mev-tendermint replace statement?_**
  → Towards the bottom of your go.mod file you should have a line that looks like this:
  `replace [github.com/tendermint/tendermint](http://github.com/tendermint/tendermint) => [github.com/skip-mev](http://github.com/skip-mev)/mev-tendermint MEV_TENDERMINT_VERSION`
  → If you don’t have the replace statement, your node will run without communicating with Skip and will be unable to receive MEV bundles that increase your validator rewards
  → Find the mev-tendermint version you should be using [here](../Chain%20Configuration%20431f9bfd28694949aec46de190b1eb5a.md)
- **_Do you have EXACTLY 1 `tendermint/tendermint` replace statement?_**
  → Some chains (e.g. Terra2) replace tendermint with their own version of tendermint using a go.mod replace statement, just like we do. If you leave that pre-existing replace statement in the go.mod file and you add one to replace tendermint with mev-tendermint, the client will not compile. So make sure you get rid of that pre-existing replace statement.
- **_Is mev-tendermint in a `replace` section AND not in a `require` section?_**
  → If mev-tendermint is in the `require` section of the file rather than the replace section, the binary will fail to compile.
  → You need to ensure the `require` section still includes a “vanilla” version of tendermint (e.g. `github.com/tendermint/tendermint v0.34.23` ), and that mev-tendermint is only introduced in the `replace` section
- ********************\*********************Are you using the version of mev-tendermint that matches the version in [github.com/skip-mev/config/](http://github.com/skip-mev/config/) (in the directory for your chain_id and chain_version)?\*\*\*
  → Often times, compilation and runtime errors can be caused by using an old version of mev-tendermint.
  → Double check that the version referenced in the `replace` statement in your `go.mod` file matches the version in [Skip’s docs](../Chain%20Configuration%20431f9bfd28694949aec46de190b1eb5a.md) / [the config repo](Validator%20Troubleshooting%20Guide%20caf97a63c5cb47b8903931ea923e86f9.md) for your particular chain id and chain version. (The chain id should be listed in the chain’s official documentation, and the chain version tag can be found in the latest upgrade announcement for the chain and usually in their official docs or github repos)

### Double check your application version

Problems with mev-tendermint very frequently arise just from folks running an old or unreleased/not-yet-supported version of the chain application code. (And this causes failures that have nothing to do with mev-tendermint)

********\*\*\*\*********Symptoms:********\*\*\*\*********

- Node app hashes on receiving a proposal
- Node does not start
- Chain height does not advance

******************\*\*******************To ensure this is not the source of your problems, double check a couple trustworthy sources of the live chain version to find the correct version tag:******************\*\*******************

- [Polkachu’s live node version](Validator%20Troubleshooting%20Guide%20caf97a63c5cb47b8903931ea923e86f9.md)
- The most recent network upgrade announcement (usually in the chain’s Discord)
- The chain’s official documentation (though we’ve noticed this is frequently out of date)
- Verify with other validator operators you know (e.g. Ask in the chain’s discord or in Skip’s discord / Telegram for the chain)

********************************\*\*********************************Once you have high confidence in a version tag for the chain binary, make sure you checkout that version before building the binary from source, e.g.:********************************\*\*********************************

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
- Failure to connect to relayer

**Here are some questions to investigate that cover the most common sources of error we’ve seen in config:**

- **_Does your `config.toml` file have a `[sidecar]` section?_**
  → Ensure that the config/config.toml file that your node is loading at startup has the `[sidecar]` section that Skip expects. Folks commonly exclude this by accident in cases where they’re unsure where their node is loading the file from
- **_Does `relayer_rpc_string` have `http://` at the start?_**
  → `relayer_rpc_string` needs to have http:// at the beginning. Folks often cut it by mistake or for cleanliness, thinking it’s not necessary
  → The relayer RPC server is not configured to function over HTTPS, so ensure your prefix is `http` and NOT `https`
- **_Does `relayer_peer_string` NOT have `http://` at the start?_**
  → `relayer_peer_string` **should not** have http at the beginning because it is a tendermint p2p node identifier
  → Folks often accidentally prepend the string with `http://` by pasting it into the Google Chrome address bar then copying it to ensure it’s plain text (Chrome gets carried away for some reason)
- \***\*Do any of the config settings you’ve added have curly quotes?\*\***
  → Your quotes need to be straight, plain-text quotes, rather than rich-text curly quotes
  → Folks sometimes introduce curly quotes by copying the quotes into a chat service or an editor that assumes rich text by default and makes the conversion (Slack is a common culprit)
  ![WRONG! ](/img/docs/validator/quotes-wrong.png)
  WRONG!
  ![Right!](/img/docs/validator/quotes-correct.png)
  Right!
