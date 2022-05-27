const { promisify } = require("util");

const exec = promisify(require("child_process").exec);

const DOCKER_IMAGE_NAME = "vault";
const CLI_COMMAND = "vault";

async function executeCommand(command, auth) {
  const dockerCommand = createDockerCommand(command, auth);

  const result = await exec(dockerCommand);

  return result;
}

function createDockerCommand(command, auth) {
  const {
    token,
    address,
    namespace,
  } = auth;

  const enviromentalVariables = [
    `VAULT_TOKEN=${token}`,
    `VAULT_ADDR=${address}`,
  ];

  if (namespace) {
    enviromentalVariables.push(`VAULT_NAMESPACE=${namespace}`);
  }

  const environmentalVariablesArguments = createEnvironmentVariableArgumentsString(
    enviromentalVariables,
  );

  const sanitizedCommand = sanitizeCommand(command);

  // vault image requires IPC_LOCK capability, otherwise prints warnings
  const dockerCommand = `\
docker run --rm \
${environmentalVariablesArguments} \
--cap-add IPC_LOCK \
${DOCKER_IMAGE_NAME} \
${sanitizedCommand}`;

  return dockerCommand;
}

function createEnvironmentVariableArgumentsString(environmentVariables = []) {
  return environmentVariables.map(
    (environmentVariable) => `-e ${environmentVariable}`,
  ).join(" ");
}

function sanitizeCommand(command) {
  return command.startsWith(CLI_COMMAND)
    ? command
    : `${CLI_COMMAND} ${command}`;
}

module.exports = {
  executeCommand,
};