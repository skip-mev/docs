---
description: Setting up Additional RPCs within Slinky
title: ⛓️ Setting up Additional RPCs within Slinky
sidebar_position: 3
---

### Setting up Additional RPCs within Slinky

Within Slinky, validators can add more authenticated RPC endpoints to report decentralized price data from supported blockchains (e.g. Solana, Ethereum, Base...).

To do this, head over to your `oracle.json` config and add or update your provider entry for `endopints`. Make sure that the RPC you are adding supports authentication via adding a `X-Api-Key` field within the header.

For example, if you wanted to add a new RPC with the URL `skiprpc.com` with the API key `skip123` for the Raydium Solana API provider, you would end up with a config like so:

```json
{
  "providers": [
    {
      "name": "raydium_api",
      "api": {
        "enabled": true,
        "timeout": 500000000,
        "interval": 500000000,
        "reconnectTimeout": 2000000000,
        "maxQueries": 10,
        "atomic": false,
        "url": "",
        "endpoints": [
          {
            "url": "https://api.devnet.solana.com"
          },
          {
            "url": "skiprpc.com",
            "authentication": {
              "apiKey": "X-Api-Key",
              "apiKeyHeader": "skip123"
            }
          }
        ],
        "batchSize": 50,
        "name": "raydium_api"
      }
    }
  ]
}
```

After this is completed, save you config file, and restart your node!
