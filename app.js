const { bootstrap } = require("@kaholo/plugin-library");

const vaultService = require("./vault.service");
const vaultCliService = require("./vault-cli.service");

function validateSecretsPath(secretsPath) {
  if (!secretsPath.includes("/")) {
    throw new Error("Invalid path. Cannot distinguish engine mount from secret subpath, eg. 'mount/my-secret'.");
  }
}

async function getSecrets(params) {
  const {
    vaultToken,
    vaultUrl,
    secretsEngineVersion,
    vaultNamespace,
    secretsPath,
  } = params;

  validateSecretsPath(secretsPath);

  return vaultService.readSecrets(
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secretsEngineVersion,
  );
}

async function getSingleSecretValue(params) {
  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsEngineVersion,
    secretsPath,
    secretsKey,
  } = params;

  validateSecretsPath(secretsPath);

  const secrets = await vaultService.readSecrets(
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secretsEngineVersion,
  );

  const secretValue = secrets[secretsKey];
  if (secretValue === undefined) {
    throw new Error("Secret not found");
  }

  return secretValue;
}

async function putSecrets(params) {
  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsEngineVersion,
    secretsPath,
    secrets,
  } = params;

  validateSecretsPath(secretsPath);

  return vaultService.putSecrets(
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secrets,
    secretsEngineVersion,
  );
}

async function patchSecrets(params) {
  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsEngineVersion,
    secretsPath,
    secrets,
  } = params;

  if (secretsEngineVersion === "v1") {
    throw new Error("Vault Secret Engine v1 does not support secrets addition (PATCH method).");
  }

  validateSecretsPath(secretsPath);

  return vaultService.patchSecrets(
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secrets,
    secretsEngineVersion,
  );
}

function runVaultCommand(params) {
  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    command,
    jsonOutput,
  } = params;

  return vaultCliService.executeCommand(
    command,
    {
      token: vaultToken,
      address: vaultUrl,
      namespace: vaultNamespace,
      jsonOutput: jsonOutput,
    },
  );
}

module.exports = bootstrap(
  {
    getSecrets,
    getSingleSecretValue,
    putSecrets,
    patchSecrets,
    runVaultCommand,
  },
  {},
);
