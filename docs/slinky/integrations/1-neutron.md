---
description: Neutron
title: Neutron
sidebar_position: 1
---

## FAQs

### **Q: How do I get up and running?**

**A:** Here is a quick (5-10 minutes) step-by-step breakdown. Please reach out to us at [skip.money/discord](http://skip.money/discord) if you have questions!

1. **Download the Slinky Sidecar binary.**

   The best way to get the Slinky Sidecar binary is in the GitHub releases page for Slinky.

   https://github.com/skip-mev/slinky/releases

   The initial version required for Neutron is `v0.4.X`

   https://github.com/skip-mev/slinky/releases/

   We also provide a container image at [ghcr.io/skip-mev/slinky-sidecar](http://ghcr.io/skip-mev/slinky-sidecar)

   This will include the Slinky binary, `slinky` , and a utility binary `slinky-config` as well as some pre-generated configuration files.

2. **Integrate the Slinky sidecar into your setup.**

   The configuration of your validator setup requires you to tackle a few problems which we’ll mention here.

   **_Configure the Slinky process_**

   Slinky has 1 important config file:

   `oracle.json` contains mostly data that is static over the operating lifetime of the sidecar. It determines polling frequency for certain endpoints to prevent rate limiting, connection buffer sizes, websocket multiplexing behavior, and other configurations which affect the success rate of price providers in the sidecar.

   The default values (excluding the dynamic updating process detailed below) in the `oracle.json` included in the release have been tested by the Skip team. We recommend using these and working with us to understand and adjust individual values that might optimize your operations.

   **Setup Dynamic Updating**

   Because the set of prices the chain wants to fetch change frequently, you must run Slinky with dynamic config updating. Using the `slinky-config` binary you can generate an `oracle.json` file which watches the chain and updates Slinky when on-chain data is changed.

   As an example, running the following would point your sidecar binary at the `neutrond` node binary running on the same host at the default port of `1317`:

   ```bash
   slinky-config --chain neutron --node-http-url "localhost:1317"
   ```

   This command (with default localhost:1317) should produce the equivalent of the `oracle.json` file bundled in the `config/neutron` directory in the release. After running this command you should have produced valid `oracle.json` file and you can start your sidecar process.

   ```bash
   slinky -oracle-config-path ./oracle.json
   ```

   The above command will start your Slinky sidecar with no markets and use the chain to bootstrap and figure out which prices it needs to fetch.

3. **Point your chain binary at the Slinky sidecar**

   The chain binary has been altered to accept new options which are used to configure your application. The following options in `app.toml` are relevant to Slinky operation.

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

# FAQ

### **Q: How do I know if my validator is properly fetching prices and posting them to the chain?**

**A:** A full set of prometheus metrics are integrated into both the sidecar and the chain application binary.

A comprehensive overview of the relevant metrics is hosted in the root [metrics.md](https://github.com/skip-mev/slinky/blob/262fddc8ff1335c87886cf7aacce2efea8164246/metrics.md).

A further breakdown of metrics are listed in the Slinky repo, categorized by subsystem:

- [Application-Side Metrics](https://github.com/skip-mev/slinky/blob/a6577aa779f1f98c47ec95d626e4af70949af7b1/service/metrics/README.md)
- [General Oracle Sidecar Metrics](https://github.com/skip-mev/slinky/blob/a6577aa779f1f98c47ec95d626e4af70949af7b1/oracle/metrics/README.md)
- [Sidecar Provider Metrics](https://github.com/skip-mev/slinky/blob/a6577aa779f1f98c47ec95d626e4af70949af7b1/providers/base/metrics/README.md)
- [API Provider Metrics](https://github.com/skip-mev/slinky/blob/a6577aa779f1f98c47ec95d626e4af70949af7b1/providers/base/api/metrics/README.md)
- [Websocket Provider Metrics](https://github.com/skip-mev/slinky/blob/a6577aa779f1f98c47ec95d626e4af70949af7b1/providers/base/websocket/metrics/README.md)

Additionally, the logs from your chain node binary will contain the following error if it is unable to connect to Slinky to grab prices:

`Failed to run fetch prices for slinky daemon`

### **Q: How do I upgrade the sidecar binary?**

**A:** Upgrading the sidecar can be done out of band of the chain’s binary. If you have a load balancer, CNAME, etc., in front of your sidecar you can simply start up the new version and switch out which version traffic is being directed to during live chain validation.

If you are running the Slinky sidecar in a container you can shut down the container, pull the updated container image and relaunch your container to update.

If you are running the binary via systemd or other management tool, you will need to stop the process and re-launch using the newly released binary.

:::note
We recommend you build some automation around config management either by pulling the latest `config/neutron/oracle.json` file directly from the release (if your node is at localhost:1317) or via reconstructing the config using the `slinky-config` binary included in the release. The `oracle.json` file from previous releases will be compatible with future releases unless there is a major version bump, _however_, newly added price feeds may require updated information from your oracle config that was not present in the previous release which may cause breakage.
:::

### **Q: Can I reuse my sidecar if other ICS chains, or the Cosmos Hub, uses Slinky?**

**A:** Yes! We don't currently have docs on how to do this, but as soon as another ICS chain or the Hub votes to include Slinky, it will be as simple as pointing your chain binary to the same sidecar over gRPC.

### **Q: Will I be rewarded for running Slinky?**

**A:** Yes! The Neutron team has committed to offering rewards in $NTRN to validators that operate Slinky reliably and honestly. This will be coming from the Neutron SubDAO, which will release further details independently.

### **Q: Can I get slashed by using Slinky?**

**A:** Not right now - in the first version, there is no slashing or punishment for not running Slinky. However, this will change, and the Neutron team has stated that validators that do not run Slinky will be jailed.

Right now, the chain node will still be able to participate in consensus without the sidecar, and will begin attaching prices to blocks once Slinky is available.

### **Q: Which version of the sidecar binary should I be running?**

**A:** We are currently in the process of designing solutions around giving validators reliable signals for exactly the minimum version of sidecar they need to be running.

In the short term, sidecar version bumps will be scheduled well in advance of any required upgrade and comms will be sent out in the relevant validator channels with the exact version required, and any changes which are relevant to the operator experience.

For future releases we are working with other teams and validators to build automation around version bumps and reasoning about compatibility based on on-chain data. We plan to increase the cadence of updates in line with feature additions, as opposed to batching for larger releases on a longer timeline.

### **Q: Is there a place I can go to get live support?**

**A:** For Slinky related issues, join the Skip discord [skip.money/discord](http://skip.money/discord). Follow the onboarding prompts and get certified as a validator—you will be able to join dedicated discord channels based on which chain you are a validator for.

For general issues related to Neutron, your normal support channels remain the same (Neutron Slack and Discord). If you can’t reach anyone from the Skip team for some reason which is critical, the Neutron team will be able to pull us in quickly as well.
