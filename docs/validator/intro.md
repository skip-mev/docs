---
description: Validator Introduction
---

# Validator

<aside>
🏃‍♂️ <b> Get started right away </b>

Check out [Validator Setup [5-10 mins]](https://www.notion.so/Validator-Setup-5-10-mins-f818646429524356a4e878f1d70866b1) to set up Skip. It takes 5 minutes

</aside>

## Summary

Skip helps validators and their stakers capture additional income by auctioning valuable top-of-block space to a decentralized network of sophisticated traders (”searchers”) and forwarding the proceeds of the auction to validators and stakers.

## What does Skip do?

### Validators that integrate with Skip:

- Allow MEV to be captured in their blocks without needing to sign headers for unseen blocks, **increasing block rewards** without sacrificing their builder rights
- **Can prevent toxic MEV strategies** like frontrunning & sandwich attacks, while still capturing revenue from
- Can configure **how much MEV revenue to keep** (the rest goes to stakers!)
- **No modifications needed** to their consensus key signing services (e.g. Horcrux, TMKMS, or custom), or any new security assumptions

### Skip is extremely easy to integrate with:

- **Estimated time:** 5-10 minutes
- **Estimated downtime:** < 10 s with Cosmovisor
- No need to make any modifications to consensus key signing services
- No need to make changes to sentry ↔  signing node configurations
- Can **configure how much revenue to keep or share with the network**, and where payments go

### Skip takes no fee for its auctions or services, and passes back 100% of MEV rewards to our partnered validators and their stakers.

Additionally, Skip has and does not capture MEV itself as an organization, instead relying on a decentralized network of **searchers** that it builds open-source tooling to support.
