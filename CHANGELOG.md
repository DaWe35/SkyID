# SkyID changelog

#### 2020. 11. 10.

We discovered a broken hash function in skynet-js <= 2.6.0 . Updated our app-account generation process, so accounts generated earlier will be unaccessable. If you're a dapp developer, please update your skyid.js: `<script src="https://sky-id.hns.siasky.net/skyid.js"></script>`.

SkyID 1.0 has a new URL (thankfully to Taek): [https://sky-id.hns.siasky.net](https://sky-id.hns.siasky.net).

Accounts created with SkyID <= 0.91 won't be accessable with SkyID >= 1.0. If you lost any data, you can still login to the old SkyID and backup them. If you need any help, please contact me on Discord. For backup purposes, we will leave `skyaccounts.hns.siasky.com` accessable, but we kindly ask all developers to update to `sky-id.hns.siasky.net`.