# SkyID changelog

#### 2020. 11. 10.

We discovered a broken hash function in skynet-js. We need to update our app-account generation process, so accounts generated earlier will be unaccessable. For backup purposes, we will leave skyaccounts.hns.siasky.com accessable, but we kindly ask all developers to update to sky-id.hns.siasky.hu.