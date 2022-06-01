const { promisify } = require("util");

const exec = promisify(require("child_process").exec);

const DOCKER_IMAGE_NAME = "vault";
const CLI_COMMAND = "vault";

async function executeCommand(command, auth) {
  const environmentalVariables = createEnviromentalVariables(auth);

  const dockerCommand = createDockerCommand(command, environmentalVariables);

  const result = await exec(dockerCommand, {
    env: environmentalVariables,
  });

  return result;
}

function createDockerCommand(command, enviromentalVariables) {
  const environmentalVariablesArgumentsString = Object.entries(enviromentalVariables)
    .map(([variableName]) => `-e ${variableName}=$${variableName}`)
    .join(" ");

  const sanitizedCommand = sanitizeCommand(command);

  // vault image requires IPC_LOCK capability, otherwise prints warnings
  const dockerCommand = `\
docker run --rm \
${environmentalVariablesArgumentsString} \
--cap-add IPC_LOCK \
${DOCKER_IMAGE_NAME} \
${sanitizedCommand}`;

  return dockerCommand;
}

function createEnviromentalVariables(auth) {
  const {
    token,
    address,
    namespace,
  } = auth;

  const environmentalVariables = {
    VAULT_TOKEN: token,
    VAULT_ADDR: address,
  };

  if (namespace) {
    environmentalVariables.VAULT_NAMESPACE = namespace;
  }

  return environmentalVariables;
}

function sanitizeCommand(command) {
  const prefixedCommand = command.startsWith(CLI_COMMAND)
    ? command
    : `${CLI_COMMAND} ${command}`;

  return `$(echo ${prefixedCommand})`;
}

module.exports = {
  executeCommand,
};
