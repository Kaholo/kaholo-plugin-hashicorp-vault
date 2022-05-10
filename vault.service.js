const fetch = require("node-fetch");

const SECRET_ENDPOINT = "/v1/secret/data";

async function readSecret(
  vaultToken,
  vaultUrl,
  vaultNamespace,
  secretsPath,
) {
  const endpointData = await callVaultSecretEndpoint({
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
  const endpointData = await callVaultSecretEndpoint(
    {
      vaultToken,
      vaultUrl,
      vaultNamespace,
      secretsPath,
      secrets,
    },
    {
      method: "POST",
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
  const endpointData = await callVaultSecretEndpoint({
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secrets,
  }, {
    method: "PATCH",
    headers: {
      "Content-type": "application/merge-patch+json",
    },
  });

  handleErrors(endpointData);

  return endpointData.data.data;
}

function generateUrlWithParams(url, params) {
  const urlParams = new URLSearchParams(params);

  return `${url}?${urlParams.toString()}`;
}

async function callVaultSecretEndpoint(
  apiParams,
  requestParams = {
    method: "GET",
    headers: {},
    urlParams: [],
  },
) {
  const {
    vaultToken,
    vaultUrl,
    vaultNamespace,
    secretsPath,
    secrets,
  } = apiParams;

  const {
    urlParams,
    method,
    headers,
  } = requestParams;

  let url = `${vaultUrl}${SECRET_ENDPOINT}/${secretsPath}`;
  if (urlParams.length > 0) {
    url = generateUrlWithParams(url, urlParams);
  }

  const options = {
    method,
    headers: {
      "X-Vault-Token": vaultToken,
      "X-Vault-Namespace": vaultNamespace,
      ...headers,
    },
  };

  if (secrets) {
    options.body = JSON.stringify(secrets);
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
