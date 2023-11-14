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
credential. While this data exchange is important for VCs that shall be kept private, Holders might desire to make other
VCs public. For public VCs the required data exchange increases the complexity of applications that want to discover and
access these VCs because the application would need to implement a data exchange protocol.

## Proposed work item

This proposal proposes to create a specification for linking Verifiable Credentials to a DID via the
[services section in the DID Document](https://w3c.github.io/did-core/#services).

The goal of this specification is to simplify discovery and retrieval of published Verifiable Credentials.

## Potential Use Cases

- Linking an official business registration credential (if there was such a thing) to a DNS name to reduce the burden of
  verifying the authenticity of a website.
- Making the mandatory imprint page on a website machine readable by self-issuing an imprint credential and connecting
  it to the DID of the website to reduce the burden of vistors to extract relevant data from the imprint page.

## Abstract

Verifiable Credentials are designed to be shared between entities. How this is done via private communication channels
is specified by protocols like [DIDComm](#ref:DIDCOMM-MESSAGING) and
[OIDC4VC](#ref:OPENID-4-VERIFIABLE-CREDENTIAL-ISSUANCE). This document complements the private communication channel by
defining how to share Verifiable Credentials publicly via a serivce entry in a "DID Document".

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

| Term                           | Definition                                                                                                                                                                                                   |
| :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decentralized Identifier (DID) | A globally unique persistent identifier that does not require a centralized registration authority and is often generated and/or registered cryptographically and is defined by [[spec:DID-CORE]].           |
| DID Method                     | A definition of how a specific DID scheme implementeds the precise operations by which DIDs are created, resolved and deactivated and DID documents are written and updated. [[spec:DID-SPEC-REGISTRIES]]    |
| DID Document                   | A set of data describing the DID subject, service and verification methods, that the DID subject or a DID delegate can use to authenticate itself and prove its association with the DID. [[spec:DID-CORE]]. |
| Verifiable Credential          | A .... [[spec:VC-DATA-MODEL]]                                                                                                                                                                                |

## Linked Verifiable Presentation Service Endpoint

TODO

### Linked Verifiable Presentations

TODO

## Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this
specification are non-normative. Everything else in this specification is normative.

The key words MAY, MUST, MUST NOT, and SHOULD in this document are to be interpreted as described in BCP 14
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
  proposal's focus on Verifiable Presentations would allow the holder to have more control over the published credential
  by signing the presentation and potentially limiting it to a certain domain name, etc.
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
  defines how to create a bi-directional relationship between a DID, independent of the DID method, and a DNS name via
  the `/.well-known/did-configuration.json` path.
