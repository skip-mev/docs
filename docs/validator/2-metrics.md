---
description: Metrics
title: MEV-Tendermint Metrics
sidebar_position: 2
---

# MEV-Tendermint Metrics

`mev-tendermint` exposes new **[Tendermint prometheus metrics](https://docs.tendermint.com/v0.34/tendermint-core/metrics.html)** under the "mev" namespace.

- You can use these to supplement your dashboards (e.g. with Grafana), for example via this [\*\*dashboard that Polkachu made](https://gist.github.com/PolkachuIntern/0083c88ad16eecc2bea1c8e4d85960ed).\*\*

**Metrics exposed:**

| Name                           | Type      | Description                                                                |
| ------------------------------ | --------- | -------------------------------------------------------------------------- |
| mev_tx_size_bytes             | Histogram | Histogram of transaction sizes sent from Skip Sentinel (in bytes)                       |
| mev_mempool_size                   | Gauge     | Size of the MEV bundle mempool (number of uncommitted transactions)                                                         |
| mev_num_bundles_total      | Counter   | Number of MEV bundles received in total                     |
| mev_num_bundles_last_block | Gauge     | Number of MEV bundles received during the last block                       |
| mev_num_txs_total      | Counter   | Number of MEV transactions added in total                                 |
| mev_num_txs_last_block | Gauge     | Number of MEV transactions received in the last block           |
| mev_sentinel_connected | Gauge     | Whether or not a node is connected to the sentinel, 1 if connected, 0 if not. |
