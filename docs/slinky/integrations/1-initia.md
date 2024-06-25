---
description: Initia
title: Initia
sidebar_position: 0
---

## FAQs

### **Q: How do I get up and running?**

**A:** Here is a quick (5-10 minutes) step-by-step breakdown. Please reach out to us at [skip.money/discord](http://skip.money/discord) if you have questions!

1. **Download the Slinky binary.**

   The best way to get the Slinky binary is in the GitHub releases page for Slinky. The initial version required for Initia is `v0.4.X`. You can find the latest release at https://github.com/skip-mev/slinky/releases.

   We also provide a container image at [ghcr.io/skip-mev/slinky-sidecar](http://ghcr.io/skip-mev/slinky-sidecar). This will include the Slinky binary `slinky`.

2. **Integrate the Slinky sidecar into your setup.**

   The configuration of your validator setup requires you to tackle a few problems which we’ll mention here.

   **_Configure the Slinky process_**

   Slinky has 1 important config file for running with Slinky:

   `oracle.json` contains mostly data that is static over the operating lifetime of the sidecar. It determines polling frequency for certain endpoints to prevent rate limiting, connection buffer sizes, websocket multiplexing behavior, and other configurations which affect the success rate of price providers in the sidecar.

   The default values (excluding the dynamic updating process detailed below) in the `oracle.json` included in the release have been tested by the Skip team. We recommend using these and working with us to understand and adjust individual values that might optimize your operations.

   The default `oracle.json` file can be located in the `config/core/oracle.json` directory in the release.

   **Setup Dynamic Updating**

   The desired markets will be stored on-chain and pulled by the sidecar. To properly configure the sidecar, you must point the sidecar to the GRPC port on a node (typically port 9090). This can be done by adding the `--market-map-endpoint` flag when starting the sidecar or modifying the oracle.json component as shown below.

   ```json
   // config/core/oracle.json found in the repo.

   {
   ...,
           {
           "name": "marketmap_api",
           "api": {
               "enabled": true,
               "timeout": 20000000000,
               "interval": 10000000000,
               "reconnectTimeout": 2000000000,
               "maxQueries": 1,
               "atomic": true,
               "url": "0.0.0.0:9090", // URL that must point to a node GRPC endpoint
               "endpoints": null,
               "batchSize": 0,
               "name": "marketmap_api"
           },
           "type": "market_map_provider"
           }
       ],
       "metrics": {
           "prometheusServerAddress": "0.0.0.0:8002",
           "enabled": true
       },
       "host": "0.0.0.0",
       "port": "8080"
   }
   ```

   **Starting the Slinky sidecar from source**

   To start the sidecar from source, you can run the following commands:

   ```bash
   # clone the repo
   git clone https://github.com/skip-mev/slinky.git
   cd slinky

   # checkout the proper version
   git checkout v0.4.X

   # build the binary
   make build
   ```

   As an example, running the following would point your sidecar binary at the `initad` node binary running on the same host at the default port of `9090`:

   ```bash
   # start the sidecar with the market map endpoint on the same host
   ./build/slinky --oracle-config-path ./config/core/oracle.json --market-map-endpoint localhost:9090
   ```

   Alternatively, if you manually updated the `oracle.json` file, you can run the following command to start the sidecar:

   ```bash
   ./build/slinky --oracle-config-path ./config/core/oracle.json
   ```

   The above command will start your Slinky sidecar with no markets and use the chain to bootstrap and figure out which prices it needs to fetch.

   **Starting the Slinky sidecar using a pre-built container image**

   To start the sidecar using the pre-built container, you can run the following command:

   ```bash
   docker run \
       --entrypoint "/usr/local/bin/slinky" \
       -v "oracle.json:/oracle/oracle.json" \
       ghcr.io/skip-mev/slinky-sidecar:v0.4.X \
       --oracle-config-path /oracle/oracle.json \
       --update-market-config-path /oracle/market.json \
       --market-map-endpoint 0.0.0.0:9090
   ```

   Walking through the command above:

   1. `docker run` - starts a new container.
   2. `--entrypoint "/usr/local/bin/slinky"` - sets the entrypoint for the container to the Slinky binary.
   3. `-v "oracle.json:/oracle/oracle.json"` - mounts the `oracle.json` file to the container. As mentioned above, you can use the default `oracle.json` file provided in the release found in the `config/core/oracle.json` directory.
   4. `ghcr.io/skip-mev/slinky-sidecar:v0.4.X` - the container image to run.
   5. `--oracle-config-path /oracle/oracle.json` - the path to the `oracle.json` file in the container.
   6. `--update-market-config-path /oracle/market.json` - this is an optional flag that will write the set of markets the sidecar needs to fetch prices for once it receives an update from the node.
   7. `--market-map-endpoint` - the GRPC endpoint of the node to fetch the markets from.

3. **Point your chain binary at the Slinky sidecar**

   The Initia binary has been altered to accept new options which are used to configure your application. The following options in `app.toml` are relevant to Slinky operation.

   The following fields are specific to the oracle config section:

   ```toml
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

### **Q: How do I know if my validator is properly fetching prices and posting them to the chain?**

**A:** A full set of prometheus metrics are integrated into both the sidecar and the Initia application binary.

A comprehensive overview of the relevant side-car metrics is hosted in the root [metrics.md](https://github.com/skip-mev/slinky/blob/main/metrics.md). This document includes a grafana dashboard that can be utilized to monitor the sidecar. Apart from the Slinky SideCar Dashboard, we highly recommend the [LavenderFive](https://github.com/LavenderFive/slinky-monitoring) and [RhinoStake](https://github.com/RhinoStake/slinky_monitoring_dashboard) monitoring dashboards which are built to be used with the Slinky sidecar.

To check if the sidecar is properly fetching prices, you can run `curl localhost:8080/slinky/oracle/v1/prices | jq` - where localhost:8080 is the default address of the sidecar. This will return a JSON object with the prices the sidecar has fetched.

To check if the Initia application is properly fetching prices from the sidecar, you can run `curl -s http://localhost:26660 | grep 'app_oracle_responses'` - where localhost:26660 is the local prometheus endpoint of the Initia application.

Additionally, the logs from your Initia node binary will contain the following error if it is unable to connect to Slinky to grab prices:

`failed to retrieve oracle prices for vote extension; returning empty vote extension`

If you are having issues, please read over the live support section below.

### **Q: How do I upgrade the sidecar binary?**

**A:** Upgrading the sidecar can be done out of band of the chain’s binary. If you have a load balancer, CNAME, etc., in front of your sidecar you can simply start up the new version and switch out which version traffic is being directed to during live chain validation.

If you are running the Slinky sidecar in a container you can shut down the container, pull the updated container image and relaunch your container to update.

If you are running the binary via systemd or other management tool, you will need to stop the process and re-launch using the newly released binary.

:::note
We recommend you build some automation around config management either by pulling the latest `config/core/oracle.json` file directly from the release. The `oracle.json` file from previous releases will be compatible with future releases unless there is a major version bump, _however_, newly added price feeds may require updated information from your oracle config that was not present in the previous release which may cause breakage.
:::

The Initia node will still be able to participate in consensus without the sidecar, and will begin attaching prices to blocks once Slinky is available. In the worst case, an upgrade in any of these manners will cause you to miss including vote extensions for a single block which should have no negative effects on you or the network.

### **Q: Which version of the sidecar binary should I be running?**

**A:** We are currently in the process of designing solutions around giving validators reliable signals for exactly the minimum version of sidecar they need to be running.

In the short term, sidecar version bumps will be scheduled well in advance of any required upgrade and comms will be sent out in the relevant validator channels with the exact version required, and any changes which are relevant to the operator experience.

For future releases we are working with the Initia team and validators to build automation around version bumps and reasoning about compatibility based on on-chain data. We plan to increase the cadence of updates in line with feature additions, as opposed to batching for larger releases on a longer timeline.

### **Q: Is there a place I can go to get live support?**

**A:** For Slinky related issues, join the Skip discord [skip.money/discord](http://skip.money/discord). Follow the onboarding prompts and get certified as a validator—you will be able to join dedicated discord channels based on which chain you are a validator for (Initia).

For general issues related to Initia, your normal support channels remain the same. If you can’t reach anyone from the Skip team for some reason which is critical, the Initia team will be able to pull us in quickly as well.
