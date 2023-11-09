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

## Abstract

Verifiable Credentials are designed to be shared between entities. How this is done via private communication channels
is specified by protocols like [DIDComm](#ref:DIDCOMM-MESSAGING) and
[OIDC4VC](#ref:OPENID-4-VERIFIABLE-CREDENTIAL-ISSUANCE). This document complements the private communication channel by
defining how to share Verifiable Credentials publicly via a serivce entry in a "DID Document".

The Verifiable Credentials specification supports multiple different identifiers. This specification does NOT specify
how to publish Verifiable Credentials for other valid identifiers apart from DIDs.

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
