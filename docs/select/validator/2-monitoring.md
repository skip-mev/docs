---
description: Monitoring and alrets information
title: Monitoring and Alerting
sidebar_position: 2
---

# Monitoring and Alerting

This page covers new info `mev-tendermint` exposes (including Prometheus metrics that `mev-tendermint` and additions to the Tendermint RPC `/status` endpoint) and a host of alerting solutions you can use to inform you when your validator disconnects from Skip (which prevents you from receiving MEV bundles and payments)

## `mev-tendermint` Info

### Prometheus Metrics

`mev-tendermint` exposes new **[Tendermint prometheus metrics](https://docs.tendermint.com/v0.34/tendermint-core/metrics.html)** under the "mev" namespace.

**The most important metric is `mev_sentinel_connected`, which indicates whether your validator is connected to the sentinel. If it is not, you cannot receive MEV payments**

| Name                       | Type      | Description                                                                   |
| -------------------------- | --------- | ----------------------------------------------------------------------------- |
| mev_tx_size_bytes          | Histogram | Histogram of transaction sizes sent from Skip Sentinel (in bytes)             |
| mev_mempool_size           | Gauge     | Size of the MEV bundle mempool (number of uncommitted transactions)           |
| mev_num_bundles_total      | Counter   | Number of MEV bundles received in total                                       |
| mev_num_bundles_last_block | Gauge     | Number of MEV bundles received during the last block                          |
| mev_num_txs_total          | Counter   | Number of MEV transactions added in total                                     |
| mev_num_txs_last_block     | Gauge     | Number of MEV transactions received in the last block                         |
| mev_sentinel_connected     | Gauge     | Whether or not a node is connected to the sentinel, 1 if connected, 0 if not. |

### Status Endpoint Info

`mev-tendermint` appends additional data to the output of the Tendermint RPC `/status` endpoint (Available by default on port 26657)

```json
{
    // standard info exposed on status endpoint
    // ...
    "mev_info": {
      "is_peered_with_sentinel": // BOOLEAN INDICATING WHETHER NODE IS CONNECTED TO SENTINEL -- CANNOT RECEIVE PAYMENTS IF FALSE
      "last_received_bundle_height": // STRING GIVING HEIGHT OF LAST BUNDLE RECEIVED
    }
}
```

## Alerting

### Standard Prometheus Alerting Solutions

Since Skip exposes Prometheus metrics, you can integrate with any Prometheus-aware alerting solution:

- Grafana Cloud
- AlertManager
- DataDog

### Discord Alert Bot by [Silk Nodes](https://silknodes.io/)

Silk Nodes built and maintains a bot that allows you to receive a personal ping in the Skip Discord if your node disconnects.

1. Enter the Skip Discord
2. Run the following command with your operator address and the discord handle you'd like to have pinged during disconnects:

   ```bash
   /skip-link <oper-address> <@discord-handle>
   ```

Now you will receive a ping in the #disconnection-alerts channel whenever your validator disconnects.

(Run the same command to unlink it in the future if you need)

### Integration into [SimplyVC Panic](https://github.com/skip-mev/panic)

Panic -- SimplyVC's validator monitoring solution -- natively supports alerting when your validator disconnects from the sentinel in version 1.3.1 and higher.

To configure it:

- Access PANIC UI at `http://<ui addr (default localhost)>:3000` (use chrome if access is denied in browser)
- In the alerts tab, select the `NodeIsPeeredWithSentinel` alert

### Skip Website

The [Skip validators page](https://skip.money/validators) shows a glowing green orb or red orb next to each validator:

- Green indicates an active, live connection
- Red indicates a disconnected validator

After a week of disconnection, your validator will not appear in the list
