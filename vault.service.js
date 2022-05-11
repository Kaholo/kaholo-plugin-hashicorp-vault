const fetch = require("node-fetch");

const SECRET_ENDPOINT = "/v1/secret/data";

async function readSecret(
  vaultToken,
  vaultUrl,
  vaultNamespace,
  secretsPath,
) {
  const endpointData = await callVaultSecretAPIEndpoint({
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
  });

  handleErrors(endpointData);

  return endpointData.data.data;
}

async function createOrUpdateSecret(
  vaultToken,
  vaultUrl,
  vaultNamespace,
  secretsPath,
  secrets,
) {
  const endpointData = await callVaultSecretAPIEndpoint(
    {
      vaultToken,
      vaultUrl,
      vaultNamespace,
      secretsPath,
      secrets,
    },
    "POST",
    {
      "Content-Type": "application/json",
    },
  );

  handleErrors(endpointData);

  return endpointData.data.data;
}

async function patchSecret(
  vaultToken,
  vaultUrl,
  vaultNamespace,
  secretsPath,
  secrets,
) {
  const endpointData = await callVaultSecretAPIEndpoint(
    {
      vaultToken,
      vaultUrl,
      vaultNamespace,
      secretsPath,
      secrets,
    },
    "PATCH",
    {
      "Content-type": "application/merge-patch+json",
    },
  );

  handleErrors(endpointData);

  return endpointData.data.data;
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

  let url = `${vaultUrl}${SECRET_ENDPOINT}/${secretsPath}`;

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
    throw new Error(`Endpoint returned errors: ${errors[0]}`);
  }
}

module.exports = {
  readSecret,
  createOrUpdateSecret,
  patchSecret,
};
