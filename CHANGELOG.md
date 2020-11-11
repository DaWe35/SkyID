# SkyID changelog

#### 2020. 11. 10.

We discovered a broken hash function in skynet-js <= 2.6.0. If you're a dapp developer, please update your skyid.js: `<script src="https://sky-id.hns.siasky.net/skyid.js"></script>`.

We updated our app-account generation process, so accounts generated earlier will be unaccessable. If you lost any data, you can still login to/with the old SkyID. (If you need any help, please contact me on Discord.) For backup purposes, we will leave `skyaccounts.hns.siasky.com` accessable, but we kindly ask all developers to update to `sky-id.hns.siasky.net`.