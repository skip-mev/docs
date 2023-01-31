---
description: Skip Validator API
title: Validator API
sidebar_position: 6
---

# Validator API

## `GET` Disconnected Validators

- This request returns the operator addresses of all disconnected validators for the requested chain
  :::info Disconnected Validator
  A validator is considered disconnected if none of the validator's nodes (sentry / validator) are currently peered with the sentinel. **this means that the node is not receiving bundles!!**
  :::
### URI: `/disconnected_validators/{chainID}`

### Query String Params:
* `chainID`: **(Required)** Chain ID of the target chain (e.g. "juno-1")
### Example:

- **Request**
  - `curl -X GET https://skip.money/disconnected_validators/evmos_9001-2`
- **Response**
  ```JSON
  {
      "disconnected_validators": [
          "evmosvaloper1dk4ste222kp256ky00553nexna0rh38hx2ur6c",
          "evmosvaloper10qpycc2egucukw8afcz4us7xlxxmfwh6rscvjz",
          "evmosvaloper10xhy8xurfwts9ckjkq0ga92mrjz9txyy6y8l2g",
          "evmosvaloper1rw4nendrehkr5tkhjswzy8ts97dvwg7rc0u0kp",
          "evmosvaloper1w9m6p7ctu4gkdsr8plle997h25rzsa96xlzfat",
          "evmosvaloper1qp49y6vh8vvv5yf8ule8fwx6sss82ncz39tunl",
          "evmosvaloper1tczjwjrr36e0l5jjqnwrp95kv8mk57zdmxse4m"
      ]
  }
  ```

## `GET` Registered Validators with Config Info

- This request returns the information (detailed below) for each validator running skip on the specified chain. You can optionally pass in a operator address to filter down results to a single validator by calling the `/validator_info/{chainID}/{operatorAddress}` endpoint.
  - `operator_address` - Operator address of the validator
  - `moniker` - Moniker of the validator
  - `front_running_protection` - Whether or not the validator accepts front-running bundles
  - `val_payment_percentage` - Percentage of rewards earned from auction-fees that goes to the validator
  - `val_profit` - The profit this validator has accrued to date
  - `network_profit` - The profit this validator has generated in network fees from bundles for the network
  - `active` - Whether the validator is currently connected to or was connected to the sentinel in the last 24 hours
### URI: `/validator_info/{chainID}`

### URL String Params:
* `chainID`: **(Required)** Chain ID of the target chain (e.g. "juno-1")


### Example:

- **Request**
  - ` curl -X GET https://skip.money/validator_info/uni-5`
- **Response**
  ```JSON
  {
    "validator_info": [
      {
        "operator_address": "junovaloper1m9yh97z9l75fzegwyrrqy5elntlu9jf7g04cqv",
        "moniker": "skip-tester-283rh2r3h",
        "front_running_protection": true,
        "payment_percentage": 50,
        "val_profit": 168667517,
        "network_profit": 175559088,
        "active": true,
      },
      {
        "operator_address": "junovaloper1x3p4lsqs2dgpfd753dfwk9m8z7vpe4gxd5yml4",
        "moniker": "BlockStake",
        "front_running_protection": true,
        "payment_percentage": 50,
        "val_profit": 100800649,
        "network_profit": 101814848,
        "active": true,
      },
      ...
    ]
  }
  ```

### URI: `/validator_info/{chainID}/{operatorAddress}`

### URL String Params:
* `chainID`: **(Required)** Chain ID of the target chain (e.g. "juno-1")
* `operatorAddress`: **(Required)** Operator address of the validator (e.g. "junovaloper1x20lytyf6zkcrv5edpkfkn8sz578qg5sujlhnj")


### Example:

- **Request**
  - ` curl -X GET https://skip.money/validator_info/uni-5/junovaloper1m9yh97z9l75fzegwyrrqy5elntlu9jf7g04cqv`
- **Response**
  ```JSON
  {
    "validator_info": [
        {
          "operator_address": "junovaloper1m9yh97z9l75fzegwyrrqy5elntlu9jf7g04cqv",
          "moniker": "skip-tester-283rh2r3h",
          "front_running_protection": true,
          "payment_percentage": 50,
          "val_profit": 168667517,
          "network_profit": 175559088,
          "active": true,
        },
      ]
  }
  ```


## `GET` Active Validators 

- This request returns a list of validators (denoted by their operator address) that are currently connected or were connected to the sentinel in the previous 24 hours for the specified chain. 

### URI: `/active_validators/{chainID}`

### Query String Params:
* `chainID`: **(Required)** Chain ID of the target chain (e.g. "juno-1")

### Example:

- **Request**
  - `curl -X GET https://skip.money/active_validators/juno-1`
- **Response**
  ```JSON
  {
    "active_validators": [
      "junovaloper1mxpyg8u68k6a8wdu3hs5whcpw9q285pcpxm5yx",
      "junovaloper1t8ehvswxjfn3ejzkjtntcyrqwvmvuknzmvtaaa",
      "junovaloper106y6thy7gphzrsqq443hl69vfdvntgz260uxlc",
      "junovaloper1ncu32g0lzhk0epzdar7smd3qv9da2n8w8mwn4k",
      "junovaloper1jc9fr7s5kal8878trt86ne0k353r4yd6a60zak",
      "junovaloper189nl8q7rm4ks2t2l7qwe7j49w7sagw4y8uk2nd",
      "junovaloper1zxx8j75ngm8m38v9l5wreaavwnsuun7gcq5cu8",
      "junovaloper1juczud9nep06t0khghvm643hf9usw45r23gsmr",
      "junovaloper196ax4vc0lwpxndu9dyhvca7jhxp70rmcqcnylw",
      "junovaloper166r5ylkp70xe0ysq2hjxn26m4q9vfn8q3lv46c",
      "junovaloper1xdywquvz5g6r5wv6tpkj6chad0fkk459gf9ny6",
      ...
    ]
  }
  ```

## `GET` Status

- This request returns the status of a validator for the specified chain. Returns true if they are connected to the sentinel or were previously connected in the past 24 hours, otherwise it returns false.

### URI: `/status/{chainID}/{operatorAddress}`

### Query String Params:
* `chainID`: **(Required)** Chain ID of the target chain (e.g. "juno-1")
* `operatorAddress`: **(Required)** Operator address of the validator (e.g. "junovaloper1gfaavqqg79tgcmgws6ys7yvchtc3fl42zjw43l")

### Example:

- **Request**
  - `curl -X GET https://skip.money/status/juno-1/junovaloper1mxpyg8u68k6a8wdu3hs5whcpw9q285pcpxm5yx`

- **Response**
  ```JSON
  {
      "active": true
  }
  ```