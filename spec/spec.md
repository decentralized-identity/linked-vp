# Linked Verifiable Presentation v0.2.0

**Specification Status:** [Draft](https://github.com/decentralized-identity/org/blob/master/work-item-lifecycle.md)

**Latest Draft:** [identity.foundation/linked-vp](https://identity.foundation/linked-vp)

**Editors:**

~ [Jan Christoph Ebersbach](https://www.linkedin.com/in/JCEbersbach) (identinet)

~ Others?

<!-- -->

**Authors:**

~ [Brian Richter](https://www.linkedin.com/in/brianrichter3) (Aviary Tech)

~ [Markus Sabadello](https://www.linkedin.com/in/markus-sabadello-353a0821) (Danube Tech)

~ Others?

<!-- -->

**Participate:**

~ [GitHub repo](https://github.com/decentralized-identity/linked-vp)

~ [File a bug](https://github.com/decentralized-identity/linked-vp/issues)

~ [Commit history](https://github.com/decentralized-identity/linked-vp/commits/main)

---

## Abstract

Verifiable Credentials are designed to be shared between entities. How this is done via private communication channels
is specified by protocols like [[DIDComm]](#ref:DIDCOMM-MESSAGING) and
[[OIDC4VC]](#ref:OPENID-4-VERIFIABLE-CREDENTIAL-ISSUANCE). This document complements the private communication channel
by defining how to share, discover and retrieve Verifiable Credentials publicly via a service entry in a "DID Document".

The Verifiable Credentials specification supports multiple different identifiers. This specification does NOT specify
how to publish Verifiable Credentials for other valid identifiers apart from DIDs. Furthermore, this specification does
NOT specify how Verifiable Credentials are created, modified or deleted at a service endpoint.

### Use Cases

_This section is non-normative._

The contributors to this specification provided the following incomplete list of use cases that appeal to them:

- Public bidirectional linkage between a DNS origin and a DID as defined by
  [[DID-CONFIGURATION]](#ref:DID-CONFIGURATION).
- Provide publicly verifiable information about DIDs used by companies to simplify the onboarding process of suppliers
  and customers. Example credentials:
  - Business registration credential that contains name, address and line of business.
  - Attestation of compliance with the ISO 27001 standard issued by a certification organization.
- Verifiable and machine-readable credential of the mandatory imprint page for company websites.
- Decentralized business network of people who publicly verifiably share their educational background and work
  experience.
- Replicate functionality of X.509 certificates that contain information about the issuers and holders with DIDs and
  Verifiable Credentials.

## Status of This Document

Linked Verifiable Presentation is a draft specification under development within the
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
section codifies the `LinkedVerifiablePresentation` service endpoint. The endpoint allows a DID controller to publish
and link verifiable presentations with verifiable credentials that SHALL be publicly associated with the DID.
Presentations referenced within the `LinkedVerifiablePresentation` endpoint descriptor can then be crawled by verifying
parties to locate and verify any presentation resources that may exist.

### Linked Verifiable Presentation

`LinkedVerifiablePresentation` endpoint descriptors are JSON objects composed as follows:

- The object MUST contain an `id` property, and its value MUST be a valid URI conforming to [[spec:RFC3986]] as
  described in [[spec:DID-CORE]].
- The object MUST contain a `type` property, and its value MUST be the string "LinkedVerifiablePresentation".
- The object MUST contain a `serviceEndpoint` property, and its value MUST be either a string or an array which MUST
  contain one or more Uniform Resource Locators as described in [[spec:RFC3986]].

### Example: DID Document with LinkedVerifiablePresentation Service Endpoints

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://identity.foundation/linked-vp/contexts/v1"
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
      "type": "LinkedVerifiablePresentation",
      "serviceEndpoint": ["https://bar.example.com/verifiable-presentation.jsonld"]
    },
    {
      "id": "did:example:123#baz",
      "type": "LinkedVerifiablePresentation",
      "serviceEndpoint": "ipfs://bafybeihkoviema7g3gxyt6la7vd5ho32ictqbilu3wnlo3rs7ewhnp7lly/verifiable-presentation.jwt"
    }
  ]
}
```

### Example: Linked Verifiable Presentation Resource

Linked verifiable presentation with a credential that describes an organization.

#### JSON-LD Format

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "holder": "did:example:123",
  "type": [
    "VerifiablePresentation"
  ],
  "verifiableCredential": [
    {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
          "schema": "https://schema.org/"
        }
      ],
      "issuer": "did:example:123",
      "issuanceDate": "2024-02-08T18:38:46+01:00",
      "expirationDate": "2029-02-08T18:38:46+01:00",
      "type": [
        "VerifiableCredential",
        "schema:Organization"
      ],
      "credentialSubject": {
        "id": "did:example:123",
        "schema:legalName": "Example LLC",
        "schema:telephone": "+1 23456 789",
        "schema:taxID": "123456789",
        "schema:location": {
          "@type": " PostalAddress",
          "schema:addressCountry": "Example Country",
          "schema:addressRegion": "Example Region",
          "schema:addressLocality": "Example City",
          "schema:postalCode": "12345",
          "schema:streetAddress": "1 Example Street"
        }
      },
      "proof": {
        "type": "Ed25519Signature2018",
        "created": "2024-02-08T17:38:46Z",
        "verificationMethod": "did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
        "proofPurpose": "assertionMethod",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..qD1a-op-GWkvzI5LaAXqJhJv-9WCSTgtEUzUvDeuiaUSDWpVUh14x5TUbGNvmx1xZ0fEf5eWZWoJ-2dogDpmBQ"
      }
    }
  ],
  "id": "https://bar.example.com/verifiable-presentation.jsonld",
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2024-02-08T17:38:46Z",
    "verificationMethod": "did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..6_k6Dbgug-XvksZvDVi9UxUTAmQ0J76pjdrQyNaQL7eVMmP_SUPZCqso6EN3aEKFSsJrjDJoPJa9rBK99mXvDw"
  }
}
```

#### JSON Web Token Format

```
eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpleGFtcGxlOjEyMyNfUXEwVUwyRnE2NTFRMEZqZDZUdm5ZRS1mYUhpT3BSbFBWUWNZXy10QTRBIiwidHlwIjoiJ3ZwK2xkK2p3dCcifQ.eyJzdWIiOiJkaWQ6ZXhhbXBsZToxMjMiLCJpc3MiOiJkaWQ6ZXhhbXBsZToxMjMiLCJuYmYiOjE3MDc0MTM5MjYsImlhdCI6MTcwNzQxMzkyNiwiZXhwIjoxODY1MjY2NzI2LCJ2cCI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJob2xkZXIiOiJkaWQ6ZXhhbXBsZToxMjMiLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUpGWkVSVFFTSXNJbXRwWkNJNkltUnBaRHBsZUdGdGNHeGxPakV5TXlOZlVYRXdWVXd5Um5FMk5URlJNRVpxWkRaVWRtNVpSUzFtWVVocFQzQlNiRkJXVVdOWlh5MTBRVFJCSWl3aWRIbHdJam9pSjNaaksyeGtLMnAzZENjaWZRLmV5SnpkV0lpT2lKa2FXUTZaWGhoYlhCc1pUb3hNak1pTENKcGMzTWlPaUprYVdRNlpYaGhiWEJzWlRveE1qTWlMQ0p1WW1ZaU9qRTNNRGMwTVRNNU1qWXNJbWxoZENJNk1UY3dOelF4TXpreU5pd2laWGh3SWpveE9EWTFNalkyTnpJMkxDSjJZeUk2ZXlKQVkyOXVkR1Y0ZENJNld5Sm9kSFJ3Y3pvdkwzZDNkeTUzTXk1dmNtY3ZNakF4T0M5amNtVmtaVzUwYVdGc2N5OTJNU0lzZXlKelkyaGxiV0VpT2lKb2RIUndjem92TDNOamFHVnRZUzV2Y21jdkluMWRMQ0pwYzNOMVpYSWlPaUprYVdRNlpYaGhiWEJzWlRveE1qTWlMQ0pwYzNOMVlXNWpaVVJoZEdVaU9pSXlNREkwTFRBeUxUQTRWREU0T2pNNE9qUTJLekF4T2pBd0lpd2laWGh3YVhKaGRHbHZia1JoZEdVaU9pSXlNREk1TFRBeUxUQTRWREU0T2pNNE9qUTJLekF4T2pBd0lpd2lkSGx3WlNJNld5SldaWEpwWm1saFlteGxRM0psWkdWdWRHbGhiQ0lzSW5OamFHVnRZVHBQY21kaGJtbDZZWFJwYjI0aVhTd2lZM0psWkdWdWRHbGhiRk4xWW1wbFkzUWlPbnNpYVdRaU9pSmthV1E2WlhoaGJYQnNaVG94TWpNaUxDSnpZMmhsYldFNmJHVm5ZV3hPWVcxbElqb2lSWGhoYlhCc1pTQk1URU1pTENKelkyaGxiV0U2ZEdWc1pYQm9iMjVsSWpvaUt6RWdNak0wTlRZZ056ZzVJaXdpYzJOb1pXMWhPblJoZUVsRUlqb2lNVEl6TkRVMk56ZzVJaXdpYzJOb1pXMWhPbXh2WTJGMGFXOXVJanA3SWtCMGVYQmxJam9pSUZCdmMzUmhiRUZrWkhKbGMzTWlMQ0p6WTJobGJXRTZZV1JrY21WemMwTnZkVzUwY25raU9pSkZlR0Z0Y0d4bElFTnZkVzUwY25raUxDSnpZMmhsYldFNllXUmtjbVZ6YzFKbFoybHZiaUk2SWtWNFlXMXdiR1VnVW1WbmFXOXVJaXdpYzJOb1pXMWhPbUZrWkhKbGMzTk1iMk5oYkdsMGVTSTZJa1Y0WVcxd2JHVWdRMmwwZVNJc0luTmphR1Z0WVRwd2IzTjBZV3hEYjJSbElqb2lNVEl6TkRVaUxDSnpZMmhsYldFNmMzUnlaV1YwUVdSa2NtVnpjeUk2SWpFZ1JYaGhiWEJzWlNCVGRISmxaWFFpZlgxOWZRLlpIcGJmQjdIUlhXZGEwV19mOGYwX1pvOUdKMlUxUXNrME9mVk1uLWJPaWJHNnR5dEotbVhQazhaeWwzRXZScHVBUGFWUWxnT1J0RVRwdFF1UVlXUUR3Il0sImlkIjoiaHR0cHM6Ly9iYXIuZXhhbXBsZS5jb20vdmVyaWZpYWJsZS1wcmVzZW50YXRpb24uanNvbmxkIn19.HBDsrOtJ2n3XU7JgfwXX1JyDpLApHssN4EKaM5ggrOqYSNw09C3BnS78ztwTJNmHQVKEyEOBdZlp6mziT4LQBw
```

Example of the decoded JWT Header:

```json
{
  "alg": "EdDSA",
  "kid": "did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
  "typ": "'vp+ld+jwt'"
}
```

Example of decoded JWT Payload:

```json
{
  "sub": "did:example:123",
  "iss": "did:example:123",
  "nbf": 1707413926,
  "iat": 1707413926,
  "exp": 1865266726,
  "vp": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "holder": "did:example:123",
    "type": [
      "VerifiablePresentation"
    ],
    "verifiableCredential": [
      "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpleGFtcGxlOjEyMyNfUXEwVUwyRnE2NTFRMEZqZDZUdm5ZRS1mYUhpT3BSbFBWUWNZXy10QTRBIiwidHlwIjoiJ3ZjK2xkK2p3dCcifQ.eyJzdWIiOiJkaWQ6ZXhhbXBsZToxMjMiLCJpc3MiOiJkaWQ6ZXhhbXBsZToxMjMiLCJuYmYiOjE3MDc0MTM5MjYsImlhdCI6MTcwNzQxMzkyNiwiZXhwIjoxODY1MjY2NzI2LCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIseyJzY2hlbWEiOiJodHRwczovL3NjaGVtYS5vcmcvIn1dLCJpc3N1ZXIiOiJkaWQ6ZXhhbXBsZToxMjMiLCJpc3N1YW5jZURhdGUiOiIyMDI0LTAyLTA4VDE4OjM4OjQ2KzAxOjAwIiwiZXhwaXJhdGlvbkRhdGUiOiIyMDI5LTAyLTA4VDE4OjM4OjQ2KzAxOjAwIiwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsInNjaGVtYTpPcmdhbml6YXRpb24iXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6ZXhhbXBsZToxMjMiLCJzY2hlbWE6bGVnYWxOYW1lIjoiRXhhbXBsZSBMTEMiLCJzY2hlbWE6dGVsZXBob25lIjoiKzEgMjM0NTYgNzg5Iiwic2NoZW1hOnRheElEIjoiMTIzNDU2Nzg5Iiwic2NoZW1hOmxvY2F0aW9uIjp7IkB0eXBlIjoiIFBvc3RhbEFkZHJlc3MiLCJzY2hlbWE6YWRkcmVzc0NvdW50cnkiOiJFeGFtcGxlIENvdW50cnkiLCJzY2hlbWE6YWRkcmVzc1JlZ2lvbiI6IkV4YW1wbGUgUmVnaW9uIiwic2NoZW1hOmFkZHJlc3NMb2NhbGl0eSI6IkV4YW1wbGUgQ2l0eSIsInNjaGVtYTpwb3N0YWxDb2RlIjoiMTIzNDUiLCJzY2hlbWE6c3RyZWV0QWRkcmVzcyI6IjEgRXhhbXBsZSBTdHJlZXQifX19fQ.ZHpbfB7HRXWda0W_f8f0_Zo9GJ2U1Qsk0OfVMn-bOibG6tytJ-mXPk8Zyl3EvRpuAPaVQlgORtETptQuQYWQDw"
    ],
    "id": "https://bar.example.com/verifiable-presentation.jsonld"
  }
}
```

Example of decoded VC JWT Header:

```json
{
  "alg": "EdDSA",
  "kid": "did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
  "typ": "'vc+ld+jwt'"
}
```

Example of decoded VC JWT Payload:

```json
{
  "sub": "did:example:123",
  "iss": "did:example:123",
  "nbf": 1707413926,
  "iat": 1707413926,
  "exp": 1865266726,
  "vc": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "schema": "https://schema.org/"
      }
    ],
    "issuer": "did:example:123",
    "issuanceDate": "2024-02-08T18:38:46+01:00",
    "expirationDate": "2029-02-08T18:38:46+01:00",
    "type": [
      "VerifiableCredential",
      "schema:Organization"
    ],
    "credentialSubject": {
      "id": "did:example:123",
      "schema:legalName": "Example LLC",
      "schema:telephone": "+1 23456 789",
      "schema:taxID": "123456789",
      "schema:location": {
        "@type": " PostalAddress",
        "schema:addressCountry": "Example Country",
        "schema:addressRegion": "Example Region",
        "schema:addressLocality": "Example City",
        "schema:postalCode": "12345",
        "schema:streetAddress": "1 Example Street"
      }
    }
  }
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
identifiable. The Linked Verifiable Presentation specification strives to support the full privacy spectrum and does not
take philosophical positions on the correct level of anonymity for any specific link. The following sections provide
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
utilizing the `expires` property that is an optional element of `proof` property as specified by
[[VC-DATA-INTEGRITY]](#ref:VC-DATA-INTEGRITY) for presentations in JSON-LD format. Respectively, the property `exp` can
be used for presentations in JWT format [[spec-inform:RFC7519]].

### Verification of Linked Presentations

_This section is non-normative_

Unlike the interactive exchange of credentials between [holder][holder] and [verifier][verifier], linked verifiable
presentations are statically linked and published by the [holder][holder]. Any entity that knows the [holder's][holder]
DID is able to discover, access and verify the linked presentations without interaction between [holder][holder] and
[verifier][verifier]. This flow requires additional caution from the [holder][holder] to ensure the integrity,
authenticity and timeliness of linked presentations. The security properties `nonce`, `challenge`, and `domain` that are
useful for interactive challenge-response protocols as specified by verifiable credential data
[[VC-DATA-INTEGRITY]](#ref:VC-DATA-INTEGRITY) can not be used to secure linked presentations.

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
  <dt id="ref:DID-CONFIGURATION">DID-CONFIGURATION</dt>
  <dd>
    <cite><a href="https://identity.foundation/.well-known/resources/did-configuration/">Well Known DID Configuration</a></cite>.
        Daniel Buchner; Orie Steele; Tobias Looker; 2023. <span class="reference-status">Status: Working Group Approved.</span>
  </dd>
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

### Simliar Specifications

The following specification are providing similar functionality:

- [CredentialRegistry](https://w3c.github.io/did-spec-registries/#credentialregistry)

[issuer]: https://www.w3.org/TR/vc-data-model-1.1/#dfn-issuers
[holder]: https://www.w3.org/TR/vc-data-model-1.1/#dfn-holders
[verifier]: https://www.w3.org/TR/vc-data-model-1.1/#dfn-verifier
