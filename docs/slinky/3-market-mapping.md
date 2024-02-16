---
description: Skip Operations
title: 🌈 Skip Operations & Market Mapping
sidebar_position: 1
---

## 🤝 Slinky is an ongoing operation

✅ **Slinky is actively operated by Skip** - Skip provides 24/7 support and on-call functions for each of its integrations. Additionally, Slinky keeps a `24 hour` SLA to add new currency pairs (e.g. `ETH/USDC`), and a `7-day` SLA to add new providers (e.g. `Binance`).

✅ **`MarketMaps`** - Slinky has an <b>optional</b>, built-in, permissionless sytem for adding, updating, and removing new currency pairs called the `MarketMap`. In this system, whitelisted `Mappers` submit frequent updates to the chain to influence how validators pull prices, and what prices to fetch.

✅ **Validator Tooling & Monitoring** - Slinky comes with a fully-featured, multi-infrastructure set of monitoring and deployment tooling. This includes plug-and-play Grafana dashboards, Prometheus endpoints, ansible deployment scripts, and updating software.

✅ **Incident Reponse** - Skip has spent years on-call and hot-fixing chains when they have critical issues or halts. Skip has a preventative and fully orchestrated incident response team dedicated to chains running Slinky, monitoring outputs and performance at all hours.

## 💰 The `MarketMap`

Slinky's `MarketMap` is a sophisticated system that lets Slinky scale to support multiple _thousands_ of permissionlessly added currency pairs. Within the `MarketMap` system, there are multiple permissionless actors and infrastructure components.

<div align="center">
<img src={'/img/market_map.png'} width="100%"/>
</div>

### 1. User Intents (offchain)

The first step in the `MarketMap` process is the collection of user intents. These intents express desire for Slinky to support new currency pairs, or update/delete existing ones. These can _roughly_ be formatted:

```
type intent {
  currencyPair string
  providers []string
}
```

These intents are collected by a series of frontends / UIs which can be hosted by multiple permissionless actors. From here, they are sent to the whitelisted Market Mappers over API for organization, curation, and execution.

### 2. The Market Mappers (offchain)

`MarketMapper`s are known, whitelisted entities by the network that are responsible for ingesting user intents and making fast and correct suggestions for on-chain updates. The bar for entry into this set should be high, and as part of a Slinky integration, Skip operates as a baseline high-reliability `MarketMapper` prior to others being added.

Specifically, `MarketMapper` is an off-chain provider (frontend, etc.) who submits new market maps to the proposing validator to update the on-chain market configuration. The set of all `MarketMappers` will be stored in the `x/marketmap` module.

On-chain, each `MarketMapper` is represented by a:

- `**URL**` - the endpoint validators will be listening to for market map updates.
- `**PubKey**` - used by validators to verify market map operations after receiving them. Every update submitted by a `MarketMapper` is signed with the corresponding private key and a timestamp.
- `**Name**` - some human readable name representing the `MarketMappers`.

**_`MarketMapper` responsibilities include:_**

1. **_Sorting_**: `MarketMappers` need to sort user intents into currency-pair requests that are already supported by existing providers from requests requiring unsupported providers. Additionally, Market Mappers need to sort duplicate requests and combine them. To do this well, this should be a high-uptime, automated process.

2. **_Risk Controls_**: Market Mappers need to be able to weed out spam requests, malformed requests, or requests for markets with insufficient provider coverage to be deemed safe for operation. This must be a real-time process to keep the 24-hour SLA intact.

3. **_Creation of the `MarketMap` structure_**: the inputs from (1) and (2) result in an overall JSON structure representing the suggested on-chain oracle updates. Market Mappers need to be building this constantly, and have it available at any time for query over a publicly available endpoint.

4. **_On-chain `MarketMap` submission_**: Mappers will have their `MarketMap` submissions queried by validators running the Slinky sidecar over their public endpoints. Mappers must `sign` their JSON `MarketMap` with the same public key that was whitelisted by governance to ensure their submission is unaltered. Queries will happen by all validators on a per-block basis.

Example `MarketMap` structure:

```
// MarketUpdate is an action to take to update the MarketMap.
type MarketUpdate struct {
	// Op is the type of operation.  The only supported type is "create".
	Op string `json:"op"`

	// CurrencyPair is the on-chain representation of the market pair.  This
	// includes the number of decimals (exponent) for this market.
	CurrencyPair oracletypes.CurrencyPair `json:"currency_pair"`

	// MinExchanges is he minimum number of exchanges that should be reporting a live price for
	// a price update to be considered valid.
	MinExchanges uint32 `json:"min_exchanges,omitempty"`

	// MinPriceChangePpm is the minimum allowable change in `price` value that would cause a price
	// update on the network. Measured as `1e-6` (parts per million).
	MinPriceChangePpm int `json:"min_price_change_ppm"`

	// Providers is the list of providers for this currency pair.
	Providers []Provider `json:"providers"`
}

type Provider struct {
	// Name identifies which provider this config is for.
	Name string `json:"name"`

	// Ticker is the ticker symbol for the currency pair off-chain.
	Ticker string `json:"ticker"`

	// Adjust is the symbol to adjust by for this pair.
	Adjust string `json:"adjust"`
}
```

### 3. Validator Aggregation of Market Maps

Once a validator has one or more submissions for a potential on-chain update transaction, it will aggregate them by taking the `intersection` of create operations across all JSON structures, and use a `priority` system to resolve any conflicts in update or delete operations.

**Verification**

Validators are responsible for validating the signatures and nonces of the `Operations` payload.

Additionally, in order to ensure that market updates do not affect consensus, the connection between the application (proposer) and the sidecar is protected via:

- Sensible timeouts on how long it can wait retrieve a `MarketMap` when requested.
- Limits on the maximum payload size that can be returned.

After fetching updates, the proposer will verify the signatures and timestamps of all of the updates that were provided against the configured set of market mappers that are supported in `x/marketmap`

This intake and aggregation mechanism is built into the Slinky sidecar, the same sidecar that queries prices on a block-by-block basis.

### 4. `MsgUpdateMarketMap` Transaction Creation

Once aggregation is completed, validators format their final set of `MarketMap` operations into a `MsgUpdateMarketMap` transaction that is injected into the block proposal during the `PrepareProposal` ABCI++ step.

This is verified by other validators within `ProcessProposal`. Upon receiving a block proposal with a `MsgUpdateMarketMap`, the validator will re-verify the signatures and nonces included.

### 5. The `x/marketmap` Module

`x/marketmap` is a lightweight Cosmos-SDK module for storing and updating the `MarketMap` config. This module also stores the list of `MarketMappers`, which can be updated via governance.

**_Keeper Methods_**

The following methods will be provided by the `x/marketmap` module keeper:

- `SetMarketMap(MarketMap)`
- `GetMarketMap() -> MarketMap`
- `UpdateMarketMap(ops Operations...)`
- `GetMarketMappers() -> []MarketMappers`
- `SetMarketMappers([]MarketMappers)`

**_Keeper Hooks_**

The following hooks can be used by other modules:

- `OnMarketMapUpdate(ops Operations...)`
  - The hook can be integrated into, say `x/prices` or Slinky’s `x/oracle` so that the module has a view whenever a new market is added to the config.

**_Msg Server_**

- `SetMarketMappers()`
  - Gov-gated message for setting list of trusted providers
- `UpdateMarketMap()`
  - Callable by `MsgUpdateMarketMap`, in a tx issued from proposer

**_gRPC Queries_**

- `GetMarketMap() -> MarketMap`
  - Called by oracle service providers to get the current state of the config
- `GetMarketMappers() -> []MarketMapper`
  - Called by slinky sidecar so it is aware of the services to listen to
