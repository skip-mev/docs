---
description: Setting up Additional RPCs within Slinky
title: ⛓️ Setting up Additional RPCs within Slinky
sidebar_position: 3
---

### Setting up Additional RPCs within Slinky

Within Slinky, validators can add more authenticated RPC endpoints to report decentralized price data from supported blockchains (e.g. Solana, Ethereum, Base...).

To do this, head over to your config [WHICH CONFIG] and add an additional list item to your `Endpoints` array. Make sure that the RPC you are adding supports authentication via adding a `X-Api-Key` field within the header.

For example, if you wanted to add a new RPC with the URL `skiprpc.com` with the API key `skip123`, you would add to the end of the array like so:

```
Endpoints: [
    {
        URL: "pokachu.com",
        Authentication: {
            Header: "X-Api-Key",
            Key: "abc123"
        }
    },
    {
        URL: "rhinostake.com",
        Authentication: {
            Header: "X-Api-Key",
            Key: "123abc"
        }
    },
    {
        URL: "skiprpc.com",
        Authentication: {
            Header: "X-Api-Key",
            Key: "skip123"
        }
    }
}
```

After this is completed, save you config file, and restart your node!
