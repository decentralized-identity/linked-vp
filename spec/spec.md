# Linked Verifiable Presentations

**Specification Status:** Pre-Draft

**Latest Draft:** [identity.foundation/linked-vp](https://identity.foundation/linked-vp)

**Editors:**

~ [Jan Christoph Ebersbach](https://www.linkedin.com/in/JCEbersbach) (identinet)

~ Others?

<!-- -->

**Authors:**

~ Others?

<!-- -->

**Participate:**

~ [GitHub repo](https://github.com/decentralized-identity/linked-vp)

~ [File a bug](https://github.com/decentralized-identity/linked-vp/issues)

~ [Commit history](https://github.com/decentralized-identity/linked-vp/commits/main)

---

## Motivation

Currently, there are multiple specifications for discovering DIDs that are accosiated with DNS names, see
[references](#references). However, there's currently no specification that makes Verifiable Presentations and
Credentials discoverable that belong to a DID or to a DNS name.

Currently, the only way an application or web service can access VCs of a DID is to use a data exchange protocol like
[OpenID4VC](https://openid.net/openid4vc/) or [DIDComm](https://didcomm.org/) to request and receive the desired
credential. While this data exchange is important for VCs that shall be kept private, [Holders][holder] might desire to
make other VCs public. For public VCs the required data exchange increases the complexity of applications that want to
discover and access these VCs because the application would need to implement a data exchange protocol.

## Potential Use Cases

- Linking an official business registration credential (if there was such a thing) to a DNS name to reduce the burden of
  verifying the authenticity of a website.
- Making the mandatory imprint page on a website machine-readable by self-issuing an imprint credential and connecting
  it to the DID of the website to reduce the burden of vistors to extract relevant data from the imprint page.
- for whom is this useful
  - public entities
  - long-lived identifiers
- public proof ownership over a domain name - Well-known DID Configuration + published credential

## Abstract

Verifiable Credentials are designed to be shared between entities. How this is done via private communication channels
is specified by protocols like [DIDComm](#ref:DIDCOMM-MESSAGING) and
[OIDC4VC](#ref:OPENID-4-VERIFIABLE-CREDENTIAL-ISSUANCE). This document complements the private communication channel by
defining how to share, discover and retrieve Verifiable Credentials publicly via a service entry in a "DID Document".

The Verifiable Credentials specification supports multiple different identifiers. This specification does NOT specify
how to publish Verifiable Credentials for other valid identifiers apart from DIDs. Furthermore, this specification does
NOT specify how Verifiable Credentials are created, modified or deleted at a service endpoint.

## Status of This Document

Linked Verifiable Presentations is a draft specification under development within the
[Decentralized Identity Foundation](https://identity.foundation) (DIF), and designed to incorporate the requirements and
learnings from related work of the most active industry players into a shared specification that meets the collective
needs of the community. This spec is regularly updated to reflect relevant changes, and we encourage active engagement
on GitHub (see above) and other mediums (e.g. DIF) where this work is being done.

## Terminology

_This section is non-normative_

This section defines terms used in this specification.

| Term                           | Definition                                                                                                                                                                                                   |
| :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decentralized Identifier (DID) | A globally unique persistent identifier that does not require a centralized registration authority and is often generated and/or registered cryptographically and is defined by [[spec:DID-CORE]].           |
| DID Controller                 | Entity that is authorized to make changes to the contents of a DID Document. [[spec:DID-CORE]].                                                                                                              |
| DID Document                   | A set of data describing the DID subject, service and verification methods, that the DID subject or a DID delegate can use to authenticate itself and prove its association with the DID. [[spec:DID-CORE]]. |
| DID Method                     | A definition of how a specific DID scheme implementeds the precise operations by which DIDs are created, resolved and deactivated and DID documents are written and updated. [[spec:DID-SPEC-REGISTRIES]]    |
| Verifiable Credential          | A cryptographically secure mechanism for expressing credentials like driver's licenses on the web. It is defined by [[spec:VC-DATA-MODEL]].                                                                  |
| Verifiable Presentation        | A way to combine and present credentials. It is defined by [[spec:VC-DATA-MODEL]].                                                                                                                           |

## Linked Verifiable Presentation Service Endpoint

To enable the public discovery of verifiable presentations and verifiable credentials for a DID, there must exist a DID
Document mechanism for expressing locations where verifiable presentations MAY be located. To that end, the following
section codifies the `LinkedVerifiablePresentations` service endpoint. The endpoint allows a DID controller to publish
and link verifiable presentations with verifiable credentials that SHALL be publicly associated with the DID.
Presentations referenced within the `LinkedVerifiablePresentations` endpoint descriptor can then be crawled by verifying
parties to locate and verify any presentation resources that may exist.

The DID Controller MAY include the parameters `challenge` and `domain` in the URL of the service endpoint and proof of
the referenced Verifiable Presentation to mitigate replay attacks. If present, a [verifier][verifier] SHOULD include the
parameters in the verification of the presentation as specified in [[VC-DATA-INTEGRITY]](#ref:VC-DATA-INTEGRITY) and
[[VC-DATA-MODEL]].

### Linked Verifiable Presentations

`LinkedVerifiablePresentations` endpoint descriptors are JSON objects composed as follows:

- The object MUST contain an `id` property, and its value MUST be a valid URI conforming to [[spec:RFC3986]] as
  described in [[spec:DID-CORE]].
- The object MUST contain a `type` property, and its value MUST be the string "LinkedVerifiablePresentations".
- The object MUST contain a `serviceEndpoint` property, and its value MUST be either a string or an array which MUST
  contain one or more Uniform Resource Locators as described in [[spec:RFC3986]].

### Example: DID Document with LinkedVerifiablePresentations Service Endpoints

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://identity.foundation/linked-vp/v1"
  ],
  "id": "did:example:123",
  "verificationMethod": [{
    "id": "did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
    "type": "JsonWebKey2020",
    "controller": "did:example:123",
    "publicKeyJwk": {
      "kty": "OKP",
      "crv": "Ed25519",
      "x": "VCpo2LMLhn6iWku8MKvSLg2ZAoC-nlOyPVQaO3FxVeQ"
    }
  }],
  "service": [
    {
      "id": "did:example:123#foo",
      "type": "LinkedVerifiablePresentations",
      "serviceEndpoint": ["https://bar.example.com/verifiable-presentation.jsonld"]
    },
    {
      "id": "did:example:123#baz",
      "type": "LinkedVerifiablePresentations",
      "serviceEndpoint": "ipfs://bafybeihkoviema7g3gxyt6la7vd5ho32ictqbilu3wnlo3rs7ewhnp7lly/verifiable-presentation.jwt"
    }
  ]
}
```

### Example: Linked Verifiable Presentation Resource

Linked verifiable presentation with a credential that describes an organization:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": ["VerifiablePresentation"],
  "holder": "did:example:123",
  "verifiableCredential": [{
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://schema.org/"
    ],
    "id": "https://bar.example.com/verifiable-presentation.jsonld",
    "issuer": "did:key:z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM",
    "issuanceDate": "2020-12-04T14:08:28-06:00",
    "expirationDate": "2025-12-04T14:08:28-06:00",
    "type": [
      "VerifiableCredential",
      "Organization"
    ],
    "credentialSubject": {
      "id": "did:key:z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM",
      "legalName": "Example LLC",
      "telephone": "+1 23456 789",
      "taxID": "123456789",
      "location": {
        "@type": " PostalAddress",
        "addressCountry": "Example Country",
        "addressRegion": "Example Region",
        "addressLocality": "Example City",
        "postalCode": "12345",
        "streetAddress": "1 Example Street"
      }
    },
    "proof": {
      "type": "Ed25519Signature2018",
      "created": "2020-12-04T20:08:28.540Z",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..D0eDhglCMEjxDV9f_SNxsuU-r3ZB9GR4vaM9TYbyV7yzs1WfdUyYO8rFZdedHbwQafYy8YOpJ1iJlkSmB4JaDQ",
      "proofPurpose": "assertionMethod",
      "verificationMethod": "did:key:z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM#z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM"
    }
  }],
  "proof": [{
    "type": "Ed25519Signature2020",
    "created": "2023-12-01T08:19:39Z",
    "verificationMethod": "did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
    "proofPurpose": "assertionMethod",
    "proofValue": "z58DAdFfa9SkqZMVPxAQpic7ndSayn1PzZs6ZjWp1CktyGesjuTSwRdoWhAfGFCF5bppETSTojQCrfFPP2oumHKtz"
  }]
}
```

## Privacy Considerations

_This section is non-normative_

Since this specification is designed to make verifiable data about a DID publicly discoverable, privacy implications are
important to consider. The publication of verifiable data about a DID is a voluntary decision by the credential
[holder][holder] and requires an update of the DID document that is under the control of the DID controller. Therefore,
the publication of verifiable data is a user-centric decision and upholds the principles of Privacy by Design
[PRIVACY-BY-DESIGN](#ref:PRIVACY-BY-DESIGN).

This specification does not recommend the publication of verifiable data about the [holder's][holder] DID by a third
party, for example by an [issuer][issuer] or [verifier][verifier].

### Spectrum of Privacy

_This section is non-normative_

Verifiable Credentials [[spec:VC-DATA-MODEL]] accommodate a wide range of privacy levels from pseudonymous to strongly
identifiable. The Linked Verifiable Presentations specification strives to support the full privacy spectrum and does
not take philosophical positions on the correct level of anonymity for any specific link. The following sections provide
guidance for implementers who want to avoid specific scenarios that are hostile to privacy.

### Personally Identifiable Information

_This section is non-normative_

DID documents and the verifiable credentials data model are highly structured. It is expected that any linked verifiable
presentation and credential will be indexed. In addition, any verifiable credential must contain the identifier of the
[issuer][issuer] that could also be de-anonymized and tracked by the publication of the credential. Therefore,
[holders][holder] are _RECOMMENDED_ not to publish verifiable credentials that contain personally identifiable data or
data that can be used to correlate and track them or the [issuer][issuer].

### Selective Disclosure

_This section is non-normative_

A [holder][holder] might want to withhold information that is part of a Verifiable Credential they want to publish.
[Issuers][issuer] are _RECOMMENDED_ to support selective disclosure in issued credentials to grant [holders][holder] the
ability to make fine-grained decisions about the information that will be publicly available.

## Security Considerations

_This section is non-normative_

### Acceptable Use

_This section is non-normative_

A [holder][holder] has the power to publish any verifiable credential they are holding. Before including a credential in
a linked verifiable presentation the [holder][holder] is _RECOMMENDED_ to consider the constraints that are imposed by
the [issuer][issuer].

[Issuers][issuer] are _RECOMMENDED_ to utilize the mechanisms provided by the verifiable credentials data model
[[spec:VC-DATA-MODEL]] to express constraints for issued credentials. For example, the properties `expirationDate` and
`termsOfUse` can be used to control or limit the public linking of credentials.

### Limiting Validity of Verifiable Presentations

_This section is non-normative_

Linked Verifiable Presentations are accessible and verifiable by anyone, and they might be accessible at the given URL
indefinitely. A [holder][holder] might therefore desire to limit the validity of a presentation. This can be achieved by
utilizing the `expires` property that is an optional element of `proof` property as specified in
[[VC-DATA-INTEGRITY]](#ref:VC-DATA-INTEGRITY).

### Verification of Linked Presentations

_This section is non-normative_

Unlike the interactive exchange of credentials between [holder][holder] and [verifier][verifier], linked verifiable
presentations are statically linked and published by the [holder][holder]. Any entity that knows the [holder's][holder]
DID is able to discover, access and verify the linked presentations without interaction between [holder][holder] and
[verifier][verifier]. This flow requires additional caution from the [holder][holder] to ensure the integrity,
authenticity and timeliness of linked presentations. In addition to the security mechanisms of verifiable credentials
and presentations [[VC-DATA-INTEGRITY]](#ref:VC-DATA-INTEGRITY), the `challenge` and `domain` search parameters in the
linked presentation URL can help the [holder][holder] to increase the level of assurance that [verifiers][verifier] will
receive the authorized and most up to date and version of the presentation.

Independent of the successful verification of linked presentations, [verifiers][verifier] should note that a linked
verifiable presentation only proves control over the [holder's][holder] DID at the time of link creation.
[Verifiers][verifier] SHOULD NOT grant access solely based on a linked presentation and SHOULD in addition launch a
separate interactive request to receive proof of control over the [holder's][holder] DID. Furthermore,
[verifiers][verifier] SHOULD ensure that the [holder's][holder] DID is referenced as subject in every verifiable
credential to establish whether the credential applies to the [holder][holder].

## Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this
specification are non-normative. Everything else in this specification is normative.

The keywords MAY, MUST, MUST NOT, and SHOULD in this document are to be interpreted as described in BCP 14
[[spec-inform:RFC2119]] [[spec-inform:RFC8174]] when, and only when, they appear in all capitals, as shown here.

This document contains examples that contain JSON and JSON-LD content. Some of these examples contain characters that
are invalid, such as inline comments (//) and the use of ellipsis (...) to denote information that adds little value to
the example. Implementers are cautioned to remove this content if they desire to use the information as valid JSON, or
JSON-LD.

A DID Configuration URI is any concrete expression of the rules specified in Section DID Configuration URI and MUST
comply with relevant normative statements in that section.

A DID Configuration Resource is any concrete expression of the rules specified in Section DID Configuration Resource and
MUST comply with relevant normative statements in that section.

A Domain Linkage Credential is any concrete expression of the rules specified in Section Domain Linkage Credential and
MUST comply with relevant normative statements in that section.

Implementations MUST comply with relevant normative statements in DID Configuration Resource Verification

## References

### Normative References

[[spec]]

### Informative References

<dl>
  <dt id="ref:DIDCOMM-MESSAGING">DIDCOMM-MESSAGING</dt>
  <dd>
    <cite><a href="https://identity.foundation/didcomm-messaging/spec/">DIDComm Messaging</a></cite>.
    Sam Curren; Tobias Looker; Oliver Terbu; 2023-11-09. <span class="reference-status">Status: Editor's Draft.</span>
  </dd>
  <dt id="ref:OPENID-4-VERIFIABLE-CREDENTIAL-ISSUANCE">OPENID-4-VERIFIABLE-CREDENTIAL-ISSUANCE</dt>
  <dd>
    <cite><a href="https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html">OpenID for Verifiable Credential Issuance</a></cite>.
    T. Lodderstedt; K. Yasuda; T. Looker; 2023-02-03. <span class="reference-status">Status: WD.</span>
  </dd>
  <dt id="ref:PRIVACY-BY-DESIGN">PRIVACY-BY-DESIGN</dt>
  <dd>
    <cite><a href="https://iapp.org/media/pdf/resource_center/pbd_implement_7found_principles.pdf">Privacy by Design</a></cite>.
      Ann Cavoukian. Information and Privacy Commissioner. 2011.
  </dd>
  <dt id="ref:VC-DATA-INTEGRITY">VC-DATA-INTEGRITY</dt>
  <dd>
    <cite><a href="https://www.w3.org/TR/vc-data-integrity/">Verifiable Credential Data Integrity</a></cite>.
      Manu Sporny; Dave Longley; Greg Bernstein; Dmitri Zagidulin; Sebastian Crane; 2023-11-21. <span class="reference-status">Status: Candidate Recommendation.</span>
  </dd>
</dl>

[[spec-inform]]

## Acknowledgements

## Appendix

### Other Resources

The following projects are working on Linked Verifiable Presentations and Credentials.

- [CredentialRegistry](https://w3c.github.io/did-spec-registries/#credentialregistry)

### Other work to consider

- The
  [did:webs Method Specification](https://trustoverip.github.io/tswg-did-method-webs-specification/index.html#signed-files)
  defines how the DID URL path is to be used for resolving signed files in general, and files of VCs and VPs in
  particular. Notably:
  - A DID URL of the form `<did>/path/to/file` resolves to a file, and MUST have beside it a `<did>/path/to/file.jws` a
    JWS of the hash of the file signed by the controlling DID.
  - This approach is extremely easy with a web-based DID Method (transform the DID into an HTTPS URL and `GET`), but can
    be used by any DID Method.
  - Using the DID URL `whois` path MAY return a Verifiable Presentation that contains an array of Verifiable Credentials
    all of which must have the DID as the credential subject. The Verifiable Presentation proof is signed by DID.
- [DID Specification Registries - Service types](https://w3c.github.io/did-spec-registries/#service-types)
- The [Service type - CredentialRegistry](https://w3c.github.io/did-spec-registries/#credentialregistry) specification
  provides a similar use case. They're focused on Verifiable Credentials that are issued by a third party. This
  proposal's focus on Verifiable Presentations would allow the [holder][holder] to have more control over the published
  credential by signing the presentation and potentially limiting it to a certain domain name, etc.
- X.509 certificates contain information about the issuing and holding party. With this proposal a DID + VC could
  provide the same functionality.
- [identinet-plugin](https://github.com/identinet/identinet-plugin) is a browser add-on that demonstrates how Well Known
  DID and VC data can be leveraged for the end user.
- Verifiable Credentials are independent of DIDs, therefore it should be considered to make the DID linking aspect
  optional / make the specification useful even if no DID is used.

### Other References

- [The Decentralized Identifier (DID) in the DNS](https://datatracker.ietf.org/doc/draft-mayrhofer-did-dns/) specifies
  the use of the URI Resource Record Type to publish Decentralized Identifiers (DIDs) in the Domain Name System.
- The [did:web Method Specification](https://w3c-ccg.github.io/did-method-web/) defines how to discover a did:web DID
  for a DNS name (unidirectional) via the `/.well-known/did.json` path.
- The [Well Known DID Configuration](https://identity.foundation/.well-known/resources/did-configuration/) specification
  defines how to create a bidirectional relationship between a DID, independent of the DID method, and a DNS name via
  the `/.well-known/did-configuration.json` path.

[issuer]: https://www.w3.org/TR/vc-data-model-1.1/#dfn-issuers
[holder]: https://www.w3.org/TR/vc-data-model-1.1/#dfn-holders
[verifier]: https://www.w3.org/TR/vc-data-model-1.1/#dfn-verifier
