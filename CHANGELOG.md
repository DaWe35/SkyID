# SkyID changelog

### 2021. 06.

Skynet-js version updated and it requires to change the setJSON() and getJSON() functions. Before the change SkyID.setJSON expected a JSON string, but now it expects an object:

Old:

``skyid.setJSON('filename', JSONstring, callback)``

New:

`skyid.setJSON('filename', object, callback)`

Same with skyid.getJSON: it will return an object instead of a JSON string.

### 2020. 11. 18.

Before 1.3.4, portals were able to read private keys because it was stored in a cookie and was sent to portals in headers. While we already need to trust portal owners (in theory they can inject code to any file), it means SkyID seeds may have been compromised. We fixed this and changed cookies to [Web Storage](https://www.w3schools.com/html/html5_webstorage.asp) ([Issue](https://github.com/DaWe35/SkyID/issues/25))

There is another [bug](https://github.com/DaWe35/SkyID/issues/28), currently users won't receive addigional notification if dapp1 wants to access dapp2 data. We will restructure the whole process after the cookie issue.

### 2020. 11. 10.

We discovered a broken hash function in skynet-js <= 2.6.0. If you're a dapp developer, please update your skyid.js: `<script src="/hns/sky-id/skyid.js"></script>`.

We updated our app-account generation process, so accounts generated earlier will be unaccessable. If you lost any data, you can still login to/with the old SkyID. (If you need any help, please contact me on Discord.) For backup purposes, we will leave `skyaccounts.hns.siasky.com` accessable, but we kindly ask all developers to update to `sky-id.hns.siasky.net`.