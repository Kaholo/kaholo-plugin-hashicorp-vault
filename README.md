# Kaholo Hashicorp Vault Plugin
This plugin provides Kaholo pipeline actions that can access Hashicorp Vault. This includes both locally managed open source Hashicorp Vault servers and the Hashicorp Vault Cloud service. The vault listens for request as some HTTP or HTTPS endpoint, e.g. `http://192.168.88.156:8200`

Hashicorp Secrets are addressed by URL. The URL can determines the path, which secrets engine is used, the name of the secret, or can be used to trigger on-demand credentials. For example, `mysecrets/creds/gmail` might be the path for gmail account credentials stored in the generic key-value secrets engine (kv):

    Key     Value
    ---     -----
    pass    apl30ekg%%
    user    me@gmail.com
    
And path `aws/creds/ec2admin` might be AWS policy-linked credentials automatically generated on demand by Hashicorp Vault using the AWS secrets engine:

    Key                Value
    ---                -----
    lease_id           aws/creds/ec2admin/PvBlaTer9LoFlkcUXBt0vFqL
    lease_duration     768h
    lease_renewable    true
    access_key         AKIA3LQJ67WOWOWLQPXZ
    secret_key         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
    security_token     <nil>

The vault must be started and unsealed before the plugin will be able to access it. The endpoint must be network accessible from the Kaholo agent. Also ensure you choose the correct protocol for the endpoint (either http or https).

## Authentication and Authorization ##
Three fundamentally important configuration items are managed using the Accounts feature. These generally don't change unless you are using more than one Hashicorp Vault server or service.

* Token(Required) - Authentication token to access the vault. The value passed is of a vault type, meaning it needs to be saved as Kaholo vault item first. If you use the Hashicorp Vault CLI, you may find your token in `~/.vault-token`. Tokens look something like this: `hvs.hqvPPyzaYlJhX6z5IRWft9t0`
* Vault URL - The URL to access the vault, including either http or https, the IP address and port of the Hashicorp Vault server. For example `http://myvault.devtest.net:8200`.

The token is stored in the Kaholo Vault and then both token and Vault URL may be configured in a Kaholo Plugin Account. To access the plugin accounts, go to Settings | Plugins, search for the Hashicorp plugin, and click on the blue hyperlink 'Hashicorp Vault' that is the name of the plugin. The second tab, "Accounts" is where the plugin account is configured. Alternatively, by adding a Hashicorp Vault to a pipeline and selecting any method the Account parameter at the action level includes a "Add New Kaholo Account" feature that may also be used to configure the account. If an account is configured to be the default account, any new Hashicorp Vault actions created will inherit that account, by default.

## Method: Get Secrets
Get the values stored inside the vault secret. This is typically one or more key-value pairs.

### Parameter: Secret Path
The path of the secrets engine and secret. For a list of available secrets engine paths run command `vault secrets list`. If a secrets engine is at path `/kaholo/passwords/`, then the secrets for "joe.bloggs" might be found at path `/kaholo/passwords/joe.bloggs`.

### Parameter: Secrets Engine Version
Select the version of the secrets engine. If unknown, guessing is a good strategy.

### Parameter: Namespace
If using version 2 of a secrets engine provide the namespace here.

## Method: Get Single Secret Value
Gets one specific item from a secret. For example a secret at path `/emps/wilson` might contain username, password, and employee number. To retrieve only username, use this method and the value for the "Secret's Key" Paramater is `username`.

    Key                 Value
    ---                 -----
    eidnum              93287239486
    password            $apl30ekg%
    username            wilson.bob

### Parameter: Secret Path
The path of the secrets engine and secret. For a list of available secrets engine paths run command `vault secrets list`. If a secrets engine is at path `/kaholo/passwords/`, then the secrets for "joe.bloggs" might be found at path `/kaholo/passwords/joe.bloggs`.

### Parameter: Secret's Key
The Key identifying the value to be retrieved.

### Parameter: Secrets Engine Version
Select the version of the secrets engine. If unknown, guessing is a good strategy.

### Parameter: Namespace
If using version 2 of a secrets engine provide the namespace here.

## Method: Set Secret (Put)
Sets or overwrites the value(s) of a new or existing secret in the vault. Secrets must be in the form of a well-formed JSON document in the Kaholo Vault or in the code layer. For example, `{"keyone": "sdagsdge23r523", "keytwo": "9348ty3948r9y4r"}`.

### Parameter: Secret Path
The path of the secrets engine and secret. For a list of available secrets engine paths run command `vault secrets list`. If a secrets engine is at path `/kaholo/passwords/`, then the secrets for "joe.bloggs" might be found at path `/kaholo/passwords/joe.bloggs`.

### Parameter: Secret
A text string containing a JSON document. If using an object on the code layer use `JSON.stringify(object)`.

### Parameter: Secrets Engine Version
Select the version of the secrets engine. If unknown, guessing is a good strategy.

### Parameter: Namespace
If using version 2 of a secrets engine provide the namespace here.

## Method: Add Secret (Patch)
Adds to or edits parts of an existing secret. This method is available only in version 2 secrets engines.

### Parameter: Secret Path
The path of the secrets engine and secret. For a list of available secrets engine paths run command `vault secrets list`. If a secrets engine is at path `/kaholo/passwords/`, then the secrets for "joe.bloggs" might be found at path `/kaholo/passwords/joe.bloggs`.

### Parameter: Secret
A text string containing a JSON document. If using an object on the code layer use `JSON.stringify(object)`.

### Parameter: Secrets Engine Version
Select the version of the secrets engine. If unknown, guessing is a good strategy.

### Parameter: Namespace
The namespace of the secret in the version 2 secrets engine.

## Method: Run Vault Command
Runs any vault command using the hashicorp/vault Docker image. The authentication credentials and namespace are injected into the docker container using environment variables. Once the command finishes running the container is destroyed.

### Parameter: Command
The command to run, which must begin with `vault`. For example `vault secrets list`.

### Parameter: Namespace
The namespace in which to run the command, if required.

### Parameter: Output in JSON Format
If enabled, the VAULT_FORMAT environment variable will be set to "json", providing a Kaholo Final Result that is prettier and much easier to access by downstream actions using the code layer.
