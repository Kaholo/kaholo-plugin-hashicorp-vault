const fetch = require("node-fetch");

const SECRET_ENDPOINT = "/v1/secret/data";

async function readSecrets(
  vaultToken,
  vaultUrl,
  vaultNamespace,
  secretsPath,
  secretsEngineVersion,
) {
  const standardizedSecretsPath = adjustPathToEngineVersion(secretsPath, secretsEngineVersion);

  const endpointData = await callVaultSecretAPIEndpoint({
    vaultToken,
    vaultUrl,
    vaultNamespace,
    standardizedSecretsPath,
  });

  handleErrors(endpointData);

  return extractData(secretsEngineVersion, endpointData);
}

async function putSecrets(
  vaultToken,
  vaultUrl,
  vaultNamespace,
  secretsPath,
  secrets,
  secretsEngineVersion,
) {
  const standardizedSecretsPath = adjustPathToEngineVersion(secretsPath, secretsEngineVersion);

  const endpointData = await callVaultSecretAPIEndpoint(
    {
      vaultToken,
      vaultUrl,
      vaultNamespace,
      standardizedSecretsPath,
      secrets,
    },
    "POST",
    {
      "Content-Type": "application/json",
    },
  );

  handleErrors(endpointData);

  return extractData(secretsEngineVersion, endpointData);
}

async function patchSecrets(
  vaultToken,
  vaultUrl,
  vaultNamespace,
  secretsPath,
  secrets,
  secretsEngineVersion,
) {
  const standardizedSecretsPath = adjustPathToEngineVersion(secretsPath, secretsEngineVersion);

  const endpointData = await callVaultSecretAPIEndpoint(
    {
      vaultToken,
      vaultUrl,
      vaultNamespace,
      standardizedSecretsPath,
      secrets,
    },
    "PATCH",
    {
      "Content-type": "application/merge-patch+json",
    },
  );

  handleErrors(endpointData);

  return extractData(secretsEngineVersion, endpointData);
}

function adjustPathToEngineVersion(path, version) {
  if (version === "v1") {
    return path;
  }

  const pathElements = path.split("/");
  pathElements.splice(1, 0, 'data');

  return pathElements.join("/");
}

function extractData(secretsEngineVersion, endpointData) {
  return secretsEngineVersion === "v1" ? endpointData.data : endpointData.data.data;
}

async function callVaultSecretAPIEndpoint(
  apiParams,
  method = "GET",
  headers = {},
) {
  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secrets,
  } = apiParams;

  const url = `${vaultUrl}${SECRET_ENDPOINT}/${secretsPath}`;

  const options = {
    method,
    headers: {
      "X-Vault-Token": vaultToken,
      "X-Vault-Namespace": vaultNamespace,
      ...headers,
    },
  };

  if (secrets) {
    options.body = JSON.stringify({ data: secrets });
  }

  const response = await fetch(url, options);
  return response.json();
}

function handleErrors(endpointData) {
  const { errors } = endpointData;
  if (errors) {
    const errorsString = errors.join("\n");
    throw new Error(`Endpoint returned errors:\n${errorsString}`);
  }
}

module.exports = {
  readSecrets,
  putSecrets,
  patchSecrets,
};
