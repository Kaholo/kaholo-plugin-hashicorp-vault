const fetch = require("node-fetch");

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
    secretsPath: standardizedSecretsPath,
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
  const standardizedSecrets = prepareSecrets(secrets, secretsEngineVersion);

  const endpointData = await callVaultSecretAPIEndpoint(
    {
      vaultToken,
      vaultUrl,
      vaultNamespace,
      secretsPath: standardizedSecretsPath,
      secrets: standardizedSecrets,
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
  const standardizedSecrets = prepareSecrets(secrets, secretsEngineVersion);

  const endpointData = await callVaultSecretAPIEndpoint(
    {
      vaultToken,
      vaultUrl,
      vaultNamespace,
      secretsPath: standardizedSecretsPath,
      secrets: standardizedSecrets,
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

function prepareSecrets(secrets, version) {
  if (version === "v1") {
    return secrets;
  }

  return { data: secrets };
}

function extractData(secretsEngineVersion, endpointData) {
  if (!endpointData) {
    return "Operation completed successfully.";
  }

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

  const url = `${vaultUrl}/v1/${secretsPath}`;

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
  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) : null;
}

function handleErrors(endpointData) {
  if (!endpointData) {
    return;
  }

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
