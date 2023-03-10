---
description: Skip Select Searcher Documentation
title: Searcher Docs
sidebar_position: 2
---

# Searcher Docs

**Estimated time:** 20 mins

⚡ Searchers can use Skip Select endpoints to risklessly capture arbitrage, liquidation, and other MEV opportunities in the Cosmos ecosystem.

→ Skip maintains easy-to-use packages ([javascript](https://www.npmjs.com/package/@skip-mev/skipjs), [python](https://github.com/skip-mev/skip-py)) for signing and sending bundles of transactions to the Skip Relay. Example usage can be found in each package’s documentation.

🆓 Skip currently charges **no fees to anyone** for its auctions, services, or endpoints 🎉

🥪 Skip allows validators to choose preferences for what kinds of MEV they allow. **This means atomic frontrunning and/or sandwich-type bundles may be rejected upon submission**, depending on the validator’s and chain’s preferences.

---

## ✍️ Signing Bundles

Skip requires searchers to **sign** bundles with the private key they also used to sign their transactions with in their submitted bundles. 
- Note, this still allows you to bundle with transactions that aren’t your own (i.e. that you did not sign).

<h3>
<details>
<summary> 🤝 With our Helper Libraries </summary>

✍️ You can sign bundles with:

- [skipjs](https://github.com/skip-mev/skipjs) via the `signBundle` method on the `SkipBundleClient`
- [skip-python](https://github.com/skip-mev/skip-py) via the `sign_bundle` method or the combined `sign_and_send_bundle` method
</details>
</h3>

<h3>
<details>
<summary> 🧠 Without our Helper Libraries </summary>

  To start, you’ll need two things (python will be used for this example):

  - `list_of_tx_bytes`: This is a list (or array, depending on programming language) of `tx_bytes` (note: if you get a tx from a mempool, they are in base64-encoded string format, to obtain tx_bytes, simply base64-decode the string).
    ```python
    list_of_tx_bytes: list[bytes] = [b'<tx_bytes>', b'<tx_bytes']
    ```
  - `priv_key`: This is an object in your respective programming language that allows for signing with the private key for the `secp256k1` digital key scheme (the same private key you’re used to signing transactions with in the Cosmos ecosystem).

    ```python
    from cosmpy.crypto.keypairs import PrivateKey

    priv_key = PrivateKey(b'<private key bytes>')
    ```

    Now, to obtain the correct signature to be sent with your bundle to Skip, you will:

  1. Append the list of `tx_bytes` together into a single flat bytes array
  2. Hash the flat bytes array with `sha256` to obtain a `bundle_digest`
  3. Sign the `bundle_digest` with your private key

     ```python
     from hashlib import sha256

     # Append all the tx_bytes of your bundle into a single array of bytes
     flattened_bundle: bytes = b''.join(list_of_tx_bytes)

     # Create digest of flattened bundle
     bundle_digest = sha256(flattened_bundle).digest()

     # Sign digest of bundle
     bundle_signature = priv_key.sign_digest(bundle_digest)
     ```
</details>
</h3>

---

## 💸 Sending Bundles

Skip exposes an **RPC** method for submitting bundles: `broadcast_bundle_sync`.

<h3>
<details>
<summary> 🤝 With our Helper Libraries </summary>

✍️ You can send bundles with:

- [skipjs](https://github.com/skip-mev/skipjs) via the `sendBundle` method on the `SkipBundleClient`
- [skip-python](https://github.com/skip-mev/skip-py)** via the `**send_bundle**`method or the combined`**sign_and_send_bundle\*\*` method
</details>
</h3>

<h3>
<details>
<summary> 🧠 Without our Helper Libraries </summary>

- **For those wanting to learn how to send bundles without using our helper libraries, see below for instructions (note: go and rust helper libraries will be released shortly)👇**

  Searchers need to send an http post request to Skip’s RPC URL, which can be found here: **‣, with the follow parameters (`txs, desiredHeight, pubkey, signature`)**

  - `txs` is a **list** of individual base64-encoded txs, ordered by how transactions should be ordered in the bundle.
  - `desiredHeight` is the chain height that of the auction that this bundle will be considered for.
    - **🚀 Note, if you set this as `0`, Skip will automatically try to include your bundle in the soonest possible auction 🚀**
      - This is a good option if you are bundling with another transaction, which may be committed before your bundle otherwise
    - **_Also note, you can submit transactions for auctions up to 5 blocks in advance_**
  - `pubkey` is the base64-encoded public key associated with the private key that your bundle was signed with (this will be checked by the Skip sentinel).
  - `signature` is the base64-encoded signature obtained from signing the bundle digest with your private key that corresponds to the `pubkey`.
    - See Signing Bundles section above for more information on how to generate this signature.

  ```python
  import httpx

  skip_rpc_url = "http://juno-1-api.skip.money/"

  txs = ['<b64-encoded-tx>', '<b64-encoded-tx>']
  desired_height = str(0)
  pubkey = '<b64-encoded public key>'
  signature = '<b64-encoded bundle signature>'

  # Create data params
  data = {'jsonrpc': '2.0',
          'method': 'broadcast_bundle_sync',
          'params': [txs,
                     desired_height,
                     pubkey,
                     signature],
  	      'id': 1}

  # Send post request to SKIP RPC with data, get response
  response = httpx.post(skip_rpc_url, json=data)
  ```
</details>
</h3>

---

## 📣 Bundle Submission Responses

### Response Format and Meaning
``` JSON
{'jsonrpc': '2.0', 'id': 1, 'result': 
  {'code': <Int: Code for the bundle response, see codes section below for more details>, 
   'txs': '[<Array of tx hashes of the txs in the bundle>]', 
   'auction_fee': <Int as String: Fee paid to the auction in the auction denom>, 
   'bundle_size': <Int as String: Number of Txs in the bundle submitted>, 
   'desired_height': <Int as String: Block height the bundle attempted inclusion in>, 
   'waited_for_simulation_results': <Bool: If the bundle waited for simulation results>, 
   'simulation_success': <Bool: Indicates whether all txs in the bundle succeeded in an on-chain simulation>, 
   'result_check_txs': '[<ABCI result of calling CheckTx on each transaction, in the same order they were passed in>]', 
   'result_deliver_txs': '[<ABCI result of simulating each transaction, in the same order they were passed in>]', 
   'error': '<Error response if an error occured, see codes section below for more details>'}
}
```
- 🚨 **Bundle submissions for blocks over two in advance do not simulate immediately, and this response will come before the simulation occurs, therefore simulation_success will be false in the jsonrpc response regardless of whether the simulation succeeded or not.**

### Codes and Meaning
  ```
  0: The bundle won the auction
  1: The pubkey provided could not be translated into an address
  2: The bundle signature failed verification
  3: The bundle failed in a precheck (tx metadata or the auction for desiredHeight was closed)
  4: The desiredHeight proposer is not a Skip validator, therefore there is no auction
  5: The bundle failed in CheckTx
  6: Deprecated Error Code
  7: The bundle was not simulated (this means it arrived too late for a given auction height)
  8: The bundle was simulated and some transaction failed in simulation
  9: The bundle lost the auction due to being outbid
  10: The bundle response did not wait for auction simulation (this means the desired height is too early for auction simulation)
  ```
- 🐇 Bundle submission responses are immediate for codes: 1, 2, 3, 4, 5, 7, and 10
- 🐢 Bundle submission responses are returned after the auction for a desired height concludes if a bundle is valid and is simulated / considered for the auction. This encapsulates error codes: 0, 8, and 9.

### Example Responses

<details>
<summary> 👑 Code 0: The bundle won the auction </summary>

``` JSON
{'jsonrpc': '2.0', 'id': 1, 'result': {'code': 0, 'txs': ['eeb49d472e663571cb809227b5f6cb01dcdc15dc9b06677d39c3c08bdfb87b99'], 'auction_fee': '600', 'bundle_size': '1', 'desired_height': '7333573', 'waited_for_simulation_results': True, 'simulation_success': True, 'result_check_txs': [{'code': 0, 'data': '', 'log': '[]', 'info': '', 'gas_wanted': '100000', 'gas_used': '57035', 'events': [], 'codespace': ''}, {'code': 0, 'data': None, 'log': '', 'info': '', 'gas_wanted': '100000', 'gas_used': '0', 'events': [], 'codespace': ''}], 'result_deliver_txs': [{'code': 0, 'data': 'Ch4KHC9jb3Ntb3MuYmFuay52MWJldGExLk1zZ1NlbmQ=', 'log': '[{"events":[{"type":"coin_received","attributes":[{"key":"receiver","value":"juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4"},{"key":"amount","value":"600ujuno"}]},{"type":"coin_spent","attributes":[{"key":"spender","value":"juno1zhqrfu9w3sugwykef3rq8t0vlxkz72vwnnptts"},{"key":"amount","value":"600ujuno"}]},{"type":"message","attributes":[{"key":"action","value":"/cosmos.bank.v1beta1.MsgSend"},{"key":"sender","value":"juno1zhqrfu9w3sugwykef3rq8t0vlxkz72vwnnptts"},{"key":"module","value":"bank"}]},{"type":"transfer","attributes":[{"key":"recipient","value":"juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4"},{"key":"sender","value":"juno1zhqrfu9w3sugwykef3rq8t0vlxkz72vwnnptts"},{"key":"amount","value":"600ujuno"}]}]}]', 'info': '', 'gas_wanted': '100000', 'gas_used': '70548', 'events': [], 'codespace': ''}, {'code': 0, 'data': 'Ch4KHC9jb3Ntb3MuYmFuay52MWJldGExLk1zZ1NlbmQ=', 'log': '[{"events":[{"type":"coin_received","attributes":[{"key":"receiver","value":"juno1lzhlnpahvznwfv4jmay2tgaha5kmz5qx292dgs"},{"key":"amount","value":"50ujuno"}]},{"type":"coin_spent","attributes":[{"key":"spender","value":"juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4"},{"key":"amount","value":"50ujuno"}]},{"type":"message","attributes":[{"key":"action","value":"/cosmos.bank.v1beta1.MsgSend"},{"key":"sender","value":"juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4"},{"key":"module","value":"bank"}]},{"type":"transfer","attributes":[{"key":"recipient","value":"juno1lzhlnpahvznwfv4jmay2tgaha5kmz5qx292dgs"},{"key":"sender","value":"juno10g0l3hd9sau3vnjrayjhergcpxemucxcspgnn4"},{"key":"amount","value":"50ujuno"}]}]}]', 'info': '', 'gas_wanted': '100000', 'gas_used': '70536', 'events': [], 'codespace': ''}], 'error': ''}}
```

</details>

<details>
<summary> ⏭️ Code 4: The desiredHeight proposer is not a Skip validator, therefore there is no auction </summary>

``` JSON
{'jsonrpc': '2.0', 'id': 1, 'result': {'code': 4, 'txs': None, 'auction_fee': '0', 'bundle_size': '1', 'desired_height': '7333048', 'waited_for_simulation_results': False, 'simulation_success': False, 'result_check_txs': None, 'result_deliver_txs': None, 'error': "Don't have skip validator up next"}}
```

</details>

<details>
<summary> 🤷‍♀️ Code 9: The bundle lost the auction due to being outbid </summary>

``` JSON
{'jsonrpc': '2.0', 'id': 1, 'result': {'code': 9, 'txs': ['a6e23c8b8224deee168ff06331e67abaaa47dea10a4a0b75610a66987b45be3d'], 'auction_fee': '600', 'bundle_size': '1', 'desired_height': '473605', 'waited_for_simulation_results': True, 'simulation_success': False, 'result_check_txs': [{'code': 0, 'data': '', 'log': '[]', 'info': '', 'gas_wanted': '100000', 'gas_used': '60388', 'events': [], 'codespace': '', 'sender': '', 'priority': '0', 'mempoolError': ''}, {'code': 0, 'data': None, 'log': '', 'info': '', 'gas_wanted': '0', 'gas_used': '0', 'events': [], 'codespace': '', 'sender': '', 'priority': '0', 'mempoolError': ''}], 'result_deliver_txs': [], 'error': 'bundle did not win auction'}}
```

</details>

---

## 🏆 Winning the Auction

:::tip Bundle Ordering

Bundles are ordered by payment to the `AuctionHouseAddress`

:::

**🚨 You can find the `AuctionHouseAddress` per chain here: [Chain Configuration](./3-chain-configuration.md) (or in [github.com/skip-mev/config](http://github.com/skip-mev/config)**

In order to include a payment to the Auction House, you must include a **`MsgSend` message** in any of the transactions in your bundle that pays the `AuctionHouseAddress`

→ The entirety of your Auction House payment is sent to the proposing validator, and their stakers. You do not need to worry about this split, Skip handles it on-chain and automatically.

The greater your bundle’s `AuctionHousePayment`, the greater the likelihood that it will be included on-chain. If you lose the auction, you can explore the chain afterwards to discover bundles with higher `AuctionHousePayments` that outbid you.

---

## 🛡️ Bundle Reversion Protection

**Bundles will only end up on-chain if every 
transaction in the bundle executes successfully**

If any transaction in your bundle would have reverted on-chain (for whatever reason), Skip will not execute the bundle land on-chain. Your transaction fees and auction payment will not be consumed. 


That means only auction winners spend fees. There is no cost or downside to losing the Skip auction!

---

## ✅ Allowed Bundles (with frontrun-protect)

**_(Key):_**

- _Signer X = tx that’s not signed by you_
- _Signer Y = another other txs that are not signed by you_
- _Signer YOU = tx signed by you_

<br>

**(singleton type)** **- A**

[SIGNER YOU]

**(singleton type) - B**

[SIGNER X]

**(multi type) - A**

[SIGNER X]

[SIGNER X]

**(multi type) - B**

[SIGNER YOU]

[SIGNER YOU]

**(backrun type)**

[SIGNER X]

[SIGNER YOU]

**(multi-backrun type)**

[SIGNER X]

[SIGNER X]

[SIGNER X]

[SIGNER YOU]

[SIGNER YOU]

---

## ❌ Disallowed Bundles (with frontrun-protect)

Anything not in allowed bundles above is disallowed by validators with frontrunning protection on. See examples of disallowed bundles below.

**_(Key):_**

- _Signer X = tx that’s not signed by you_
- _Signer Y = another other txs that are not signed by you_
- _Signer YOU = tx signed by you_

<br>

**(unknown signers type)**

[SIGNER X]

[SIGNER Y]

**(frontrun type)**

[SIGNER YOU]

[SIGNER X]

**(sandwich type)**

[SIGNER YOU]

[SIGNER X]

[SIGNER YOU]

**(backrun type with mixed signatures)**

[SIGNER X]

[SIGNER Y]

[SIGNER YOU]