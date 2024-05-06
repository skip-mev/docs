---
description: dYdX
title: dYdX
sidebar_position: 0
---

## FAQs

### **Q: How do I get up and running?**

**A:** Here is a quick (5-10 minutes) step-by-step breakdown. Please reach out to us at [skip.money/discord](http://skip.money/discord) if you have questions!

1. **Download the Slinky binary.**

   The best way to get the Slinky binary is in the GitHub releases page for Slinky.

   https://github.com/skip-mev/slinky/releases

   The initial version required for dYdX is `v0.4.X`

   https://github.com/skip-mev/slinky/releases/

   We also provide a container image at [ghcr.io/skip-mev/slinky-sidecar](http://ghcr.io/skip-mev/slinky-sidecar)

   This will include the Slinky binary, `slinky` , and a utility binary `slinky-config` as well as some pre-generated configuration files.

2. **Integrate the Slinky sidecar into your setup.**

   The configuration of your validator setup requires you to tackle a few problems which we’ll mention here.

   **_Configure the Slinky process_**

   Slinky has 1 important config file for running with dYdX:

   `oracle.json` contains mostly data that is static over the operating lifetime of the sidecar. It determines polling frequency for certain endpoints to prevent rate limiting, connection buffer sizes, websocket multiplexing behavior, and other configurations which affect the success rate of price providers in the sidecar.

   The default values (excluding the dynamic updating process detailed below) in the `oracle.json` included in the release have been tested by the Skip team. We recommend using these and working with us to understand and adjust individual values that might optimize your operations.

   **Setup Dynamic Updating**

   Because the set of prices the chain wants to fetch change frequently, you must run Slinky with dynamic config updating. Using the `slinky-config` binary you can generate an `oracle.json` file which watches the chain and updates Slinky when on-chain data is changed.

   As an example, running the following would point your sidecar binary at the `dydxprotocold` node binary running on the same host at the default port of `1317`:

   ```bash
   slinky-config --chain dydx --node-http-url "localhost:1317" --raydium-enabled --solana-node-endpoint https://solana.polkachu.com,https://slinky-solana.kingnodes.com,https://solana.lavenderfive.com,https://solana-rpc.rhino-apis.com,https://dydx.helius-rpc.com
   ```

   This command (with default localhost:1317) should produce the equivalent of the `oracle.json` file bundled in the `config/dydx` directory in the release. After running this command you should have produced valid `oracle.json` file and you can start your sidecar process.

   Please note that you'll need to also enable Solana nodes. The command above will scaffold the config with a Raydium provider config, and you will need to fill in the
   authentication details (as shown below in step 4).

   ```bash
   slinky -oracle-config-path ./oracle.json
   ```

   The above command will start your Slinky sidecar with no markets and use the chain to bootstrap and figure out which prices it needs to fetch.

3. **Point your chain binary at the Slinky sidecar**

   The dYdX binary has been altered to accept new options which are used to configure your application. The following options in `app.toml` are relevant to Slinky operation.

   ```toml
   slinky-vote-extension-oracle-enabled = "true"
   ###############################################################################
   ###                                  Oracle                                 ###
   ###############################################################################
   [oracle]
   # Enabled indicates whether the oracle is enabled.
   enabled = "true"

   # Oracle Address is the URL of the out of process oracle sidecar. This is used to
   # connect to the oracle sidecar when the application boots up. Note that the address
   # can be modified at any point, but will only take effect after the application is
   # restarted. This can be the address of an oracle container running on the same
   # machine or a remote machine.
   oracle_address = "localhost:8080"

   # Client Timeout is the time that the client is willing to wait for responses from
   # the oracle before timing out.
   client_timeout = "2s"

   # MetricsEnabled determines whether oracle metrics are enabled. Specifically
   # this enables intsrumentation of the oracle client and the interaction between
   # the oracle and the app.
   metrics_enabled = "true"
   ```

4. **Get your free API Keys and configure your decentralized provider endpoints**

   Slinky supports the addition of state-RPCs to gather data directly from Solana and EVM chains. The Skip and dYdX
   team have already set up relationships and pre-paid for API endpoints you can use to get this data.

   For each RPC URL, you will need an API key unique to your validator. To get this, go to the dYdX validator slack channel
   (which you should already be invited to once you make it into the active set), and request API keys from Helius, Polkachu,
   KingNodes, LavenderFive, and RhinoStake. Each of these are necessary to load into your config so your decentralized providers
   can work properly.

   Once you have your 5 API keys, head to `oracle.json` and configure endpoint(s) for each provider.

   Then you must fill in your API keys. You should use the URLs listed below, and ask on the Slack `#ext-dydx-validators-discussion` or `#v-dydx-private-testnet-discussion` channels:
   for API keys to fill in below.

   ```
   {
      "name": "raydium_api",
      "api": {
         "endpoints": [
         {
            "url": "https://solana.polkachu.com"
            "authentication: {
               "apiKey": "X-Api-Key",
               "apiKeyHeader": "API KEY YOU'VE RETRIEVED FROM SLACK"
            }
         },
         {
            "url": "https://slinky-solana.kingnodes.com"
            "authentication: {
               "apiKey": "X-Api-Key",
               "apiKeyHeader": "API KEY YOU'VE RETRIEVED FROM SLACK"
            }
         },
         {
            "url": "https://solana.lavenderfive.com"
            "authentication: {
               "apiKey": "X-Api-Key",
               "apiKeyHeader": "API KEY YOU'VE RETRIEVED FROM SLACK"
            }
         },
         {
            "url": "https://solana-rpc.rhino-apis.com"
            "authentication: {
               "apiKey": "X-Api-Key",
               "apiKeyHeader": "API KEY YOU'VE RETRIEVED FROM SLACK"
            }
         },
         {
            "url": "https://dydx.helius-rpc.com"
            "authentication: {
               "apiKey": "X-Api-Key",
               "apiKeyHeader": "API KEY YOU'VE RETRIEVED FROM SLACK"
            }
         },
         ],
      }
   }
   ```

   Note that there should be additional fields in your Raydium provider config which are left out in the above example for brevity.

### **Q: How do I know if my validator is properly fetching prices and posting them to the chain?**

**A:** A full set of prometheus metrics are integrated into both the sidecar and the dYdX application binary.

A comprehensive overview of the relevant side-car metrics is hosted in the root [metrics.md](https://github.com/skip-mev/slinky/blob/main/metrics.md). This document includes a grafana dashboard that can be utilized to monitor the sidecar. Apart from the Slinky SideCar Dashboard, we highly recommend the [LavenderFive](https://github.com/LavenderFive/slinky-monitoring) and [RhinoStake](https://github.com/RhinoStake/slinky_monitoring_dashboard) monitoring dashboards which are built to be used with the Slinky sidecar.

To check if the sidecar is properly fetching prices, you can run `curl localhost:8080/slinky/oracle/v1/prices | jq` - where localhost:8080 is the default address of the sidecar. This will return a JSON object with the prices the sidecar has fetched.

To check if the dYdX application is properly fetching prices from the sidecar, you can run `curl -s http://localhost:26660 | grep 'app_oracle_responses'` - where localhost:26660 is the local prometheus endpoint of the dYdX application.

Additionally, the logs from your dYdX node binary will contain the following error if it is unable to connect to Slinky to grab prices:

`Failed to run fetch prices for slinky daemon`

If you are having issues, please read over the live support section below.

### **Q: How do I upgrade the sidecar binary?**

**A:** Upgrading the sidecar can be done out of band of the chain’s binary. If you have a load balancer, CNAME, etc., in front of your sidecar you can simply start up the new version and switch out which version traffic is being directed to during live chain validation.

If you are running the Slinky sidecar in a container you can shut down the container, pull the updated container image and relaunch your container to update.

If you are running the binary via systemd or other management tool, you will need to stop the process and re-launch using the newly released binary.

:::note
We recommend you build some automation around config management either by pulling the latest `config/dydx/oracle.json` file directly from the release (if your dydx node is at localhost:1317) or via reconstructing the config using the `slinky-config` binary included in the release. The `oracle.json` file from previous releases will be compatible with future releases unless there is a major version bump, _however_, newly added price feeds may require updated information from your oracle config that was not present in the previous release which may cause breakage.
:::

The dydx node will still be able to participate in consensus without the sidecar, and will begin attaching prices to blocks once Slinky is available. In the worst case, an upgrade in any of these manners will cause you to miss including vote extensions for a single block which should have no negative effects on you or the network.

### **Q: Which version of the sidecar binary should I be running?**

**A:** We are currently in the process of designing solutions around giving validators reliable signals for exactly the minimum version of sidecar they need to be running.

In the short term, sidecar version bumps will be scheduled well in advance of any required upgrade and comms will be sent out in the relevant validator channels with the exact version required, and any changes which are relevant to the operator experience.

For future releases we are working with the dYdX team and validators to build automation around version bumps and reasoning about compatibility based on on-chain data. We plan to increase the cadence of updates in line with feature additions, as opposed to batching for larger releases on a longer timeline.

### **Q: Is there a place I can go to get live support?**

**A:** For Slinky related issues, join the Skip discord [skip.money/discord](http://skip.money/discord). Follow the onboarding prompts and get certified as a validator—you will be able to join dedicated discord channels based on which chain you are a validator for (dYdX).

For general issues related to dYdX, your normal support channels remain the same. If you can’t reach anyone from the Skip team for some reason which is critical, the dYdX team will be able to pull us in quickly as well.
