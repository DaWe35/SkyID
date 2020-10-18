# SkyID

# Sky ID Verification Concept (RFC)

This RFC is not finished, please give me some time

- You can choose any username you want
- Make new account: you generate a master-key (random seed or a password what will be not recommended) and derive a pubkey from it. You also save your personal data (pubkey, username, avatar, etc) to a SkyDB file signed with your private key.
- Sign in to apps: the experience will be the same as when you use "login with Facebook". It redirect to SkyID, and if you accept the connect, you will generate an app-token (private-key), so the app can sign anything and proove that the SkyID user signet this file while it does not knows your master-key.
- If you own your username on Handshake, you can put a TXT record on the Handshake blockchain with your public key to verify that you own the name. You then will be the only person with this exact username who has a green checkmark before that name on every app using Sky ID.
- You can connect your Sky ID with an existing social account by
    - Signing the username on that social media platform with a timestamp and the platform domain with your private key
    - And posting this signature on the social media page with your public id
- Some proofs (for example reddit) could be automatically verified by every client and then show a reddit icon with the link to that account behind your Sky ID username on every platform using Sky ID. Other proofs like twitter which can't be automatically verified could be greyed out and you need to click on that icon to check the proof tweet yourself
