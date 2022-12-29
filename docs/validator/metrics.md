---
description: Metrics
---

# Metrics

`mev-tendermint` exposes new **[prometheus metrics](https://docs.tendermint.com/v0.34/tendermint-core/metrics.html)**

- You can use these to supplement your dashboards (e.g. with Grafana), for example via this [\*\*dashboard that Polkachu made](https://gist.github.com/PolkachuIntern/0083c88ad16eecc2bea1c8e4d85960ed).\*\*

**Metrics exposed:**

| Name                           | Type      | Description                                                                |
| ------------------------------ | --------- | -------------------------------------------------------------------------- |
| sidecar_size_bytes             | Histogram | Histogram of sidecar mev transaction sizes, in bytes                       |
| sidecar_size                   | Gauge     | Size of the sidecar                                                        |
| sidecar_num_bundles_total      | Counter   | Number of MEV bundles received by the sidecar in total                     |
| sidecar_num_bundles_last_block | Gauge     | Number of mev bundles received during the last block                       |
| sidecar_num_mev_txs_total      | Counter   | Number of mev transactions added in total                                  |
| sidecar_num_mev_txs_last_block | Gauge     | Number of mev transactions received by sidecar in the last block           |
| p2p_relay_connected            | Gauge     | Whether or not a node is connected to the relay, 1 if connected, 0 if not. |
