---
description: API Key via MsgVote Grant
---
# API Key 

<aside>
🎉 If you don’t want to use your validator operator key to sign a challenge via Keplr, Skip now let’s you sign with **************************************any other account!**************************************

This requires granting `**MsgVote`** permissions to a different address via `authz`, and then signing with that address. See below.

</aside>

→ ✅  After completion, go to `**[https://skip.money/registration](http://skip.money/registration)`** to get an API Key.

## ➡️ Granting `MsgVote` Permissions

```jsx
simd tx authz grant <addr receiving grant> generic --msg-type /cosmos.gov.v1beta1.MsgVote --from <operator key>
```

- Here, the ******************`msg-type`****************** is the cosmos Type URL of the message that the granter can submit on behalf of the operator
    - This means that the address receiving the `**authz**` grant **can vote on gov proposals on behalf of your validator** (and sign to get a Skip API Key) contact us and we’ll generate you one.
    - ********The address receiving the grant must not have a null pubkey********. In other words, the address you want to sign in with must have signed a transaction before signing the Skip challenge.
- If you don’t want to sign a challenge, **[contact us](https://skip.money/contact)** and we’ll generate you an API Key.

## ⬅️ Revoking `MsgVote` Permissions

```jsx
simd tx authz revoke <addr losing grant> /cosmos.gov.v1beta1.MsgVote --from <operator key>
```

- **Grants can be revoked at any time,** after the grant is revoked the address that received the grant cannot sign in on behalf of your validator anymore
    - This means you can safely temporary delegate permissions to an account, sign the Skip challenge for an API Key, and then revoke the grant.

## 🔍 Querying `MsgVote` Permissions

```jsx
$ simd query authz grants <operator address> <address granted> /cosmos.gov.v1beta1.MsgVote
```

- Existing grants can be queried from chain state via the above cmd
