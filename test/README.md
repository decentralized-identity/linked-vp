# Conformance Testing

- Start [caddy webserver](https://caddyserver.com/): `caddy run`
- Install custom Certificate Authority: [`ca/rootCA.pem`](./ca/rootCA.pem)
  - Test access: `curl --cacert ca/rootCA.pem  https://id-no-presentation.localhost:8443`
- Perform conformance tests
  - DIDs:
    - <did:web:id-no-presentation.localhost%3A8443>
    - <did:web:id-presentation.localhost%3A8443>
    - <did:web:id-presentations.localhost%3A8443>
    - <did:web:no-id.localhost%3A8443>
  - Expected test results are documented on the websites:
    - <https://id-no-presentation.localhost:8443>
    - <https://id-presentation.localhost:8443>
    - <https://id-presentations.localhost:8443>
    - <https://no-id.localhost:8443>
