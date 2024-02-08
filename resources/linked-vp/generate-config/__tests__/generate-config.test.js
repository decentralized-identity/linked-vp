const moment = require("moment");

const fs = require("fs");
const path = require("path");

const jose = require("jose");
const { Ed25519KeyPair } = require("@transmute/did-key-ed25519");
const { Ed25519Signature2018 } = require("@transmute/ed25519-signature-2018");
const vcjs = require("@transmute/vc.js");
const ldp = require("@transmute/linked-data-proof");
const { documentLoader } = require("../services/documentLoader");
const k0 = require("../keys/did-key-ed25519.json");

let vpJwt;
let verifiablePresentation;

it("can issue / verify linked data", async () => {
  const key = await Ed25519KeyPair.from(k0);
  const credentialTemplate = {
    "@context": ["https://www.w3.org/2018/credentials/v1", { schema: "https://schema.org/" }],
    issuer: k0.controller,
    issuanceDate: moment().format(),
    expirationDate: moment().add(5, "years").format(),
    type: ["VerifiableCredential", "schema:Organization"],
    credentialSubject: {
      id: k0.controller,
      "schema:legalName": "Example LLC",
      "schema:telephone": "+1 23456 789",
      "schema:taxID": "123456789",
      "schema:location": {
        "@type": " PostalAddress",
        "schema:addressCountry": "Example Country",
        "schema:addressRegion": "Example Region",
        "schema:addressLocality": "Example City",
        "schema:postalCode": "12345",
        "schema:streetAddress": "1 Example Street",
      },
    },
  };
  const verifiableCredential = await vcjs.ld.createVerifiableCredential({
    credential: credentialTemplate,
    suite: new Ed25519Signature2018({
      key,
    }),
    documentLoader,
  });
  expect(verifiableCredential).toMatchObject({
    "@context": ["https://www.w3.org/2018/credentials/v1", { schema: "https://schema.org/" }],
    credentialSubject: {
      id: "did:example:123",
      "schema:legalName": "Example LLC",
      "schema:telephone": "+1 23456 789",
      "schema:taxID": "123456789",
      "schema:location": {
        "@type": " PostalAddress",
        "schema:addressCountry": "Example Country",
        "schema:addressRegion": "Example Region",
        "schema:addressLocality": "Example City",
        "schema:postalCode": "12345",
        "schema:streetAddress": "1 Example Street",
      },
    },
    issuer: "did:example:123",
    type: ["VerifiableCredential", "schema:Organization"],
    proof: { type: "Ed25519Signature2018" },
  });
  const h = Buffer.from(JSON.stringify({ "alg": "EdDSA", "b64": false, "crit": ["b64"] })).toString("base64url");
  let p = Buffer.from(verifiableCredential.proof.jws).toString("base64url");
  verifiableCredential.proof.jws = `${h}..${p}`;

  const presentationTemplate = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
    ],
    holder: k0.controller,
    type: ["VerifiablePresentation"],
    verifiableCredential: [verifiableCredential],
    id: "https://bar.example.com/verifiable-presentation.jsonld",
  };

  // INFO: can't use vcjs.ld.createVerifiablePresentation since it
  // doesn't accept a custom proof purpose
  verifiablePresentation = await ldp.sign({
    ...presentationTemplate,
  }, {
    suite: new Ed25519Signature2018({
      key,
    }),
    documentLoader,
    purpose: new ldp.purposes.AssertionProofPurpose(),
  });

  expect(verifiablePresentation).toMatchObject({
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    holder: "did:example:123",
    id: "https://bar.example.com/verifiable-presentation.jsonld",
    type: ["VerifiablePresentation"],
    proof: { type: "Ed25519Signature2018" },
  });
  p = Buffer.from(verifiablePresentation.proof.jws).toString("base64url");
  verifiablePresentation.proof.jws = `${h}..${p}`;
});

it("can issue and verify jwt", async () => {
  const issuedDate = moment();
  const expirationDate = moment().add(5, "years");
  const credentialTemplate = {
    "@context": ["https://www.w3.org/2018/credentials/v1", { schema: "https://schema.org/" }],
    issuer: k0.controller,
    issuanceDate: moment().format(),
    expirationDate: moment().add(5, "years").format(),
    type: ["VerifiableCredential", "schema:Organization"],
    credentialSubject: {
      id: k0.controller,
      "schema:legalName": "Example LLC",
      "schema:telephone": "+1 23456 789",
      "schema:taxID": "123456789",
      "schema:location": {
        "@type": " PostalAddress",
        "schema:addressCountry": "Example Country",
        "schema:addressRegion": "Example Region",
        "schema:addressLocality": "Example City",
        "schema:postalCode": "12345",
        "schema:streetAddress": "1 Example Street",
      },
    },
  };
  const payloadVC = {
    sub: k0.controller,
    iss: k0.controller,
    nbf: issuedDate.unix(),
    iat: issuedDate.unix(),
    exp: expirationDate.unix(),
    // To be debated whether to use or not use the vp/vc properties as detailed in VC Data Model 2.0 and https://www.w3.org/TR/vc-jose-cose/#jose-header-parameters-and-jwt-claims. See also https://github.com/decentralized-identity/linked-vp/issues/15#issuecomment-1866203513
    // ...credentialTemplate,
    vc: credentialTemplate,
  };
  const headerVC = {
    alg: "EdDSA",
    kid: k0.id,
    typ: "'vc+ld+jwt'",
  };
  const vcJwt = await new jose.CompactSign(Buffer.from(JSON.stringify(payloadVC)))
    .setProtectedHeader(headerVC)
    .sign(await jose.importJWK(k0.privateKeyJwk));
  expect(vcJwt).toBeDefined();
  const presentationTemplate = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
    ],
    holder: k0.controller,
    type: ["VerifiablePresentation"],
    verifiableCredential: [vcJwt],
    id: "https://bar.example.com/verifiable-presentation.jsonld",
  };
  const payloadVP = {
    sub: k0.controller,
    iss: k0.controller,
    nbf: issuedDate.unix(),
    iat: issuedDate.unix(),
    exp: expirationDate.unix(),
    // To be debated whether to use or not use the vp/vc properties as detailed in VC Data Model 2.0 and https://www.w3.org/TR/vc-jose-cose/#jose-header-parameters-and-jwt-claims. See also https://github.com/decentralized-identity/linked-vp/issues/15#issuecomment-1866203513
    // ...presentationTemplate,
    vp: presentationTemplate,
  };
  const headerVP = {
    alg: "EdDSA",
    kid: k0.id,
    typ: "'vp+ld+jwt'",
  };
  vpJwt = await new jose.CompactSign(Buffer.from(JSON.stringify(payloadVP)))
    .setProtectedHeader(headerVP)
    .sign(await jose.importJWK(k0.privateKeyJwk));
  // TODO: how to verify it?
  expect(vpJwt).toBeDefined();
});

it("can write config to disk", async () => {
  fs.writeFileSync(
    path.resolve(__dirname, "../__fixtures__/linked-vp.json"),
    JSON.stringify(
      {
        linked_ld_vp: verifiablePresentation,
        linked_jwt_vp: vpJwt,
      },
      null,
      2,
    ),
  );
});
