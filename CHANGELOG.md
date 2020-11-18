# SkyID changelog

#### 2020. 11. 18.

Currently portal owners can read your private keys. While we already need to trust portal owners (in theory they can inject code to any file), and while I think we can trust the two portals what are used nowadays, it means SkyID seeds can be compromised. We will roll out an update today... ([Issue](https://github.com/DaWe35/SkyID/issues/25))

There is another [bug](https://github.com/DaWe35/SkyID/issues/28), currently users won't receive addigional notification if dapp1 wants to access dapp2 data. We will restructure the whole process after the cookie issue.

#### 2020. 11. 10.

We discovered a broken hash function in skynet-js <= 2.6.0. If you're a dapp developer, please update your skyid.js: `<script src="/hns/sky-id/skyid.js"></script>`.

We updated our app-account generation process, so accounts generated earlier will be unaccessable. If you lost any data, you can still login to/with the old SkyID. (If you need any help, please contact me on Discord.) For backup purposes, we will leave `skyaccounts.hns.siasky.com` accessable, but we kindly ask all developers to update to `sky-id.hns.siasky.net`.