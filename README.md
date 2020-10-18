# SkyID

# Sky ID Verification Concept (RFC)

- You can choose any username you want
- ~~Your key pair is derived from your username and password~~
- ~~Your public key is used everywhere to identify you from the technical side~~
- If you own your username on Handshake, you can put a TXT record on the Handshake blockchain with your public key to verify that you own the name
- You then will be the only person with this exact username who has a green checkmark before that name on every app using Sky ID
- You can connect your Sky ID with an existing social account by
    - Signing the username on that social media platform with a timestamp and the platform domain with your private key
    - And posting this signature on the social media page with your public id
- Some proofs (for example reddit) could be automatically verified by every client and then show a reddit icon with the link to that account behind your Sky ID username on every platform using Sky ID
- Other proofs like twitter which can't be automatically verified could be greyed out and you need to click on that icon to check the proof tweet yourself
