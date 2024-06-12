---
description: Advanced Slinky Validator Configuration
title: 🗃️ Validator Configuration Reference
sidebar_position: 1
---

# Configurations

This readme gives an overview of the configuration options for the oracle service and its corresponding metrics intrumentation.

Validators running on a network that supports the oracle **must** run the oracle side-car.

All oracle configurations are broken down into two categories:

1. **Oracle side-car (Slinky) configuration:** This enables operators to tune various performance parameters, metrics instrumentation, and more.
2. **Oracle configuration in the application (`app.toml`):** A few additional lines of code that must be added to the application's `app.toml` file to configure the oracle side car into the application.

# App Configuration

The `app.toml` file is the configuration file that is consumed by the application. This file contains over-arching configurations for your entire Cosmos SDK application, as well as a few new configurations for the oracle. You must use this template to add the oracle configurations to your `app.toml` file:

```toml
# Other configurations

...

###############################################################################
###                                  Oracle                                 ###
###############################################################################
[oracle]
# Enabled indicates whether the oracle is enabled.
enabled = "{{ .Oracle.Enabled }}"

# Oracle Address is the URL of the out of process oracle sidecar. This is used to
# connect to the oracle sidecar when the application boots up. Note that the address
# can be modified at any point, but will only take effect after the application is
# restarted. This can be the address of an oracle container running on the same
# machine or a remote machine.
oracle_address = "{{ .Oracle.OracleAddress }}"

# Client Timeout is the time that the client is willing to wait for responses from
# the oracle before timing out.
client_timeout = "{{ .Oracle.ClientTimeout }}"

...

# More configurations
```

# Oracle Side-Car Configuration

### Overriding Defaults

Configurations in Slinky have sane defaults in each release which can optionally be overridden in the following ways.

1. A JSON file can be supplied to the Slinky binary via `slinky --oracle-config oracle.json` which should contain the set
   of options to be overridden.

2. Each config option can be set in environment variables where the prefix is `SLINKY_CONFIG` and the separator for
   each path element is `_` e.g. `export SLINKY_CONFIG_FOO_BAR_BAZ=false`.

### Configurable Values in Slinky

The following is a list of configurable options in Slinky along with their defaults and the supported methods of
overriding each option.

#### Base Options

| Name           | Type                                            | Default      | Environment Variable         | Description                                                                                                                   |
| -------------- | ----------------------------------------------- | ------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| updateInterval | [Duration](#Durations)                          | 250000000    | SLINKY_CONFIG_UPDATEINTERVAL | The frequency at which Slinky calculates aggregate prices from the data retrieved by its Providers.                           |
| maxPriceAge    | [Duration](#Durations)                          | 120000000000 | SLINKY_CONFIG_MAXPRICEAGE    | The maximum age which Slinky considers a valid price update. The prices API will not return price data older than this value. |
| providers      | map[string(providerName)][provider](#Providers) |              |                              | The configuration values for each of the configured providers running in Slinky.                                              |
| metrics        | [Metrics](#Metrics)                             |              |                              | The configuration values for prometheus metrics setup in Slinky.                                                              |
| host           | String                                          | "0.0.0.0"    | SLINKY_CONFIG_HOST           | The host address which the Slinky API server will listen on.                                                                  |
| port           | String                                          | "8080"       | SLINKY_CONFIG_PORT           | The port which the Slinky API server will listen on.                                                                          |

#### Providers

Each provider has a unique name which is used as the namespace for its configuration values.
Providers generally fall into a category based on the type of data it retrieves or the method used to retrieve that data.

Note that not all providers listed here will be used on every chain. The chain's module contains the set of Providers
required to fetch relevant data.

##### API Providers

Currently supported API Providers:

- binance_api
- coinbase_api
- coingecko_api
- gecko_terminal_api
- kraken_api

| Name | Type                      | Default          | Environment Variable                      | Description                                                              |
| ---- | ------------------------- | ---------------- | ----------------------------------------- | ------------------------------------------------------------------------ |
| name | String                    | ${PROVIDER}\_api | SLINKY*CONFIG_PROVIDERS*${PROVIDER}\_NAME | The name of the Provider. This should never be changed from the default. |
| api  | [API Config](#API Config) |                  |                                           | The configuration options for API Providers.                             |

##### API Config

The API Config applies to all API Providers including those listed above as well as DeFi and Market Map Providers.

| Name             | Type                     | Environment Variable                                      | Description                                                                                       |
| ---------------- | ------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| timeout          | [Duration](#Durations)   | SLINKY*CONFIG_PROVIDERS*${PROVIDER}\_API_TIMEOUT          | The amount of time the Provider will wait for a response from its API endpoint before timing out. |
| interval         | [Duration](#Durations)   | SLINKY*CONFIG_PROVIDERS*${PROVIDER}\_API_INTERVAL         | The cadence at which the Provider attempts to fetch new data from its endpoint(s).                |
| reconnectTimeout | [Duration](#Durations)   | SLINKY*CONFIG_PROVIDERS*${PROVIDER}\_API_RECONNECTTIMEOUT | The time duration to wait before attempting to reconnect to an endpoint.                          |
| maxQueries       | Int                      | SLINKY*CONFIG_PROVIDERS*${PROVIDER}\_API_MAXQUERIES       |                                                                                                   |
| endpoints        | [][endpoint](#Endpoints) |                                                           |                                                                                                   |
| batchSize        | Int                      | SLINKY*CONFIG_PROVIDERS*${PROVIDER}\_API_BATCHSIZE        |                                                                                                   |

##### Market Map Providers

The market map provider is a unique concept within Slinky. It fetches the set of Providers each chain needs data from and
updates Slinky based on the response.

Note: The endpoint of your configured market map provider should be set to your validating node.

Currently supported Market Map Providers:

- marketmap_api
- dydx_api

##### DeFi Providers

Currently supported DeFi Providers:

- uniswapv3_api-ethereum
- uniswapv3_api-base
- raydium_api

##### Websocket Providers

Currently supported websocket Providers:

- binance_ws
- bitfinex_ws
- bitstamp_ws
- bybit_ws
- coinbase_ws
- crypto_dot_com_ws
- gate_ws
- huobi_ws
- kraken_ws
- kucoin_ws
- mexc_ws
- okx_ws

#### Metrics

| Name                    | Type    | Default        | Environment Variable                          | Description                                                                                           |
| ----------------------- | ------- | -------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| enabled                 | Boolean | true           | SLINKY_CONFIG_METRICS_ENABLED                 | Enabling metrics will attempt to serve Prometheus metrics at the provided Prometheus metrics address. |
| prometheusServerAddress | String  | "0.0.0.0:8002" | SLINKY_CONFIG_METRICS_PROMETHEUSSERVERADDRESS | The address at which Slinky's Prometheus metrics will be exposed.                                     |

#### Durations

Durations work as 1s, 2ms, 1m, 50000000

### Sample configuration:

#### Overriding Prometheus Server Endpoint

```json
{
  "metrics": {
    "enabled": true,
    "prometheusServerAddress": "0.0.0.0:1111"
  }
}
```

#### Overriding MarketMap Provider Endpoint

```json
{
  "providers": {
    "marketmap_api": {
      "endpoints": [{ "url": "localhost:99999" }]
    }
  }
}
```

#### Adding DeFi Provider Endpoints

```json
{
  "providers": {
    "raydium_api": {
      "endpoints": [
        { "url": "solana-rpc1.com", "apiKey": "abc123" },
        { "url": "solana-rpc2.com", "apiKey": "123abc" }
      ]
    },
    "uniswapv3-base_api": {
      "endpoints": [
        { "url": "base-rpc1.com", "apiKey": "abc123" },
        { "url": "base-rpc2.com", "apiKey": "123abc" }
      ]
    }
  }
}
```
