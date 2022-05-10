const { bootstrap } = require("kaholo-plugin-library");

const vaultService = require("./vault.service");

function validateParams(params) {
  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
  } = params;

  if (!vaultToken) {
    throw new Error("Vault Token is missing.");
  }

  if (!vaultUrl) {
    throw new Error("Vault URL is missing.");
  }

  if (!vaultNamespace) {
    throw new Error("Vault Namespace is missing.");
  }
}

async function getSecrets(params) {
  validateParams(params);

  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
  } = params;

  return vaultService.readSecret(
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
  );
}

async function getSingleSecretValue(params) {
  validateParams(params);

  const { secretsKey } = params;

  const secrets = await getSecrets(params);

  const secretValue = secrets[secretsKey];
  if (secretValue === undefined) {
    throw new Error("Secret not found");
  }

  return secretValue;
}

async function createOrUpdateSecrets(params) {
  validateParams(params);

  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
  } = params;
}

async function patchSecrets(params) {
  validateParams(params);

  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
  } = params;
}

module.exports = bootstrap(
  {
    getSecrets,
    getSingleSecretValue,
    createOrUpdateSecrets,
    patchSecrets,
  },
  {},
);