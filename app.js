const { bootstrap } = require("kaholo-plugin-library");

const vaultService = require("./vault.service");

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

  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secretsKey,
  } = params;

  const secrets = await getSecrets({
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
  });

  const secretValue = secrets[secretsKey];
  if (secretValue === undefined) {
    throw new Error("Secret not found");
  }

  return secretValue;
}

async function putSecrets(params) {
  validateParams(params);

  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secrets,
  } = params;

  return vaultService.createOrUpdateSecret(
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secrets,
  );
}

async function patchSecrets(params) {
  validateParams(params);

  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secrets,
  } = params;

  return vaultService.patchSecret(
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secrets,
  );
}

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

module.exports = bootstrap(
  {
    getSecrets,
    getSingleSecretValue,
    putSecrets,
    patchSecrets,
  },
  {},
);
