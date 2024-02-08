const {
  documentLoaderFactory,
  contexts,
} = require("@transmute/jsonld-document-loader");
const sec = require("@transmute/security-context");
const { driver } = require("@transmute/did-key-ed25519");

const context = require("../../../../contexts/v1/index.json");
const contextSchemaorg = require("../__fixtures__/schemaorg-all-https.json");

const documentLoader = documentLoaderFactory.pluginFactory
  .build({
    contexts: {
      ...contexts.W3C_Decentralized_Identifiers,
      ...contexts.W3C_Verifiable_Credentials,
      ...contexts.W3ID_Security_Vocabulary,
    },
  })
  .addContext({
    [sec.constants.ED25519_2018_v1_URL]: sec.contexts.get(sec.constants.ED25519_2018_v1_URL),
  })
  .addContext({
    "https://schema.org/": contextSchemaorg,
  })
  .addContext({
    "https://identity.foundation/linked-vp/contexts/v1": context,
  })
  .addResolver({
    "did:key:z6": {
      resolve: async (uri) => {
        const { didDocument } = await driver.resolve(uri, {
          accept: "application/did+ld+json",
        });
        return didDocument;
      },
    },
  })
  .buildDocumentLoader();

module.exports = { documentLoader };
