---
description: Skip Protocol Searcher Documentation
sidebar_position: 2
---

# Searcher

**Estimated time:** 20 mins

⚡ Searchers can use Skip endpoints to risklessly capture arbitrage, liquidation, and other MEV opportunities in the Cosmos ecosystem.

→ Skip maintains easy-to-use packages ([javascript](https://www.npmjs.com/package/@skip-mev/skipjs), [python](https://github.com/skip-mev/skip-py)) for signing and sending bundles of transactions to the Skip Relay. Example usage can be found in each package’s documentation.

🆓 Skip currently charges **no fees to anyone** for its auctions, services, or endpoints 🎉

🥪 Skip allows validators to choose preferences for what kinds of MEV they allow. **This means atomic frontrunning and/or sandwich-type bundles may be rejected upon submission**, depending on the validator’s and chain’s preferences.

---

## Signing Bundles

Skip requires searchers to **sign** bundles with the private key they also used to sign their transactions with in their submitted bundles. Note, this still allows you to bundle with transactions that aren’t your own (i.e. that you did not sign).

### With our Helper Libraries

✍️ You can sign bundles with:

- [skipjs](https://github.com/skip-mev/skipjs) via the `signBundle` method on the `SkipBundleClient`
- [skip-python](https://github.com/skip-mev/skip-py) via the `sign_bundle` method or the combined `sign_and_send_bundle` method

### Without our Helper Libraries

- **For those wanting to learn how to sign bundles without using our helper libraries, see below for instructions (note: go and rust helper libraries will be released shortly)👇**
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

## Sending Bundles

Skip exposes an **RPC** method for submitting bundles: `broadcast_bundle_sync`.

### With our Helper Libraries

✍️ You can send bundles with:

- [skipjs](https://github.com/skip-mev/skipjs) via the `sendBundle` method on the `SkipBundleClient`
- [skip-python](https://github.com/skip-mev/skip-py)** via the `**send_bundle**`method or the combined`**sign_and_send_bundle\*\*` method

### Without our Helper Libraries

- **For those wanting to learn how to send bundles without using our helper libraries, see below for instructions (note: go and rust helper libraries will be released shortly)👇**

  Searchers need to send an http post request to Skip’s RPC URL, which can be found here: **‣, with the follow parameters (`txs, desiredHeight, pubkey, signature`)**

  - `txs` is a **list** of individual base64-encoded txs, ordered by how transactions should be ordered in the bundle.
  - `desiredHeight` is the chain height that of the auction that this bundle will be considered for.
    - **🚀 Note, if you set this as `0`, Skip will automatically try to include your bundle in the soonest possible auction 🚀**
      - This is a good option if you are bundling with another transaction, which may be committed before your bundle otherwise
    - **********************************************\*\*\*\***********************************************Also note, you can submit transactions for auctions up to 5 blocks in advance**********************************************\*\*\*\***********************************************
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
          'method': method,
          'params': [txs,
                     desired_height,
                     pubkey,
                     signature],
  	      'id': 1}

  # Send post request to SKIP RPC with data, get response
  response = httpx.post(skip_rpc_url, json=data)
  ```

- **The `broadcast_bundle_sync` method returns a result with the following information 👇**
  - `code` indicates the status of the bundle ingress request. The following are the code meanings:
  ```
  0: The submission was successful, and the bundle is considered in the auction
  1: The pubkey provided could not be translated into an address
  2: The bundle signature failed verification
  3: The bundle failed in a precheck (tx metadata or the auction for desiredHeight was closed)
  4: The desiredHeight proposer is not a Skip validator, therefore there is no auction
  5: The bundle failed in CheckTx
  6: The bundle failed to be queued for simulation -- usually this means it arrived too late
  7: The bundle was not simulated -- usually this means it lost the auction or arrived too late
  8: The bundle was simulated and some transaction failed in simulation
  ```
  - `txs` contains an array of the last 20 bytes of the string representation of the each of submitted transactions
  - `result_check_txs` contains the ABCI result of calling CheckTx on each transaction, in the same order they were passed in
  - `result_deliver_txs` contains the ABCI result of simulating each transaction, in the same order they were passed in
  - `auction_fee` is the total fee paid to the Skip Auction
  - `bundle_size` is the number of transactions in the bundle
  - `desired_height` is the bundle’s desired height. If the caller’s desired height was 0, this will contain the height that the bundle was actually in the auction for
  - `simulation_success` indicates whether the bundle succeeded in an on-chain simulation (all transactions must have been successful for this to be true)
    - **Bundle submissions for blocks over two in advance do not simulate immediately, and this response will come before the simulation occurs, therefore this will be false in the jsonrpc response regardless of whether the simulation succeeded or not.**
  - `error` contains an error string, if any errors occurred

## Winning the Auction

<aside>
💡 **Skip bundles are ordered by payment to the `AuctionHouseAddress`**

</aside>

**🚨 You can find the `AuctionHouseAddress` per chain here: [Chain Configuration](Chain%20Configuration%20431f9bfd28694949aec46de190b1eb5a.md) (or in [github.com/skip-mev/config](http://github.com/skip-mev/config)**

In order to include a payment to the Auction House, you must include a `**MsgSend` message\*\* in any of the transactions in your bundle that pays the `AuctionHouseAddress`

→ The entirety of your Auction House payment is sent to the proposing validator, and their stakers. You do not need to worry about this split, Skip handles it on-chain and automatically.

The greater your bundle’s `AuctionHousePayment`, the greater the likelihood that it will be included on-chain. If you lose the auction, you can explore the chain afterwards to discover bundles with higher `AuctionHousePayments` that outbid you.

## Simulation and Gas Refunds

<aside>
💸 **Bundles will only have their gas used if they are executed on-chain as valid.**

That is, if your bundle would have been executed invalid (for whatever reason), you will receive a full gas refund, no money will leave your account, and it will not end up on chain as reverted.

</aside>

Only auction winners spend fees. There is no cost or downside to losing the Skip auction!

## Allowed Bundles (with frontrun-protect)

\*(**Key):\***

- _Signer X = tx that’s not signed by you_
- _Signer Y = another other txs that are not signed by you_
- _Signer YOU = tx signed by you_

---

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

## Disallowed Bundles (with frontrun-protect)

Anything not in allowed bundles above is disallowed by validators with frontrunning protection on. See examples of disallowed bundles below.

\*(**Key):\***

- _Signer X = tx that’s not signed by you_
- _Signer Y = another other txs that are not signed by you_
- _Signer YOU = tx signed by you_

---

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
