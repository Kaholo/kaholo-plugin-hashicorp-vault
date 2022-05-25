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
* Vault URL - The URL to access the vault, including either http or https, the IP address and port of the Hashicorp Vault server. If not provided the plugin will try to use https://127.0.0.1:8200.
* Secrets Engine Version - either v1 or v2. If v1 namespaces are ignored, because v1 has no namespace features.

## Method: Get Secrets

**Description**

Get the values stored inside the vault secret. This is typically one or more key-value pairs.

**Parameters**

* Secret's Path - The path part of the URL that identifies the secret to retreive
* Namespace - The namespace in which the secret is stored.

## Method: Get Single Secret Value

**Description**

Gets one specific item from a secret. For example a secret at path `/emps/wilson` might contain username, password, and employee number. To retrieve only username, use this method and the value for the "Secret's Key" Paramater is `username`.

    Key                 Value
    ---                 -----
    eidnum              93287239486
    password            $apl30ekg%
    username            wilson.bob

**Parameters**

* Secret's Path - The path part of the URL that identifies the secret to retreive
* Secret's Key - The key of the key-value pair you wish to select from the secret
* Namespace - The namespace in which the secret is stored.

## Method: Set Secrets (Put)

**Description**

Sets or overwrites the value(s) of a new or existing secret in the vault. Secrets must be in the form of a well-formed JSON document in the Kaholo Vault or in the code layer. For example, `{"keyone": "sdagsdge23r523", "keytwo": "9348ty3948r9y4r"}`.

**Parameters**

* Secret's Path - The path part of the URL that identifies the secret to retreive
* Secret - The secret to set. This must be a JSON document stored in the Kaholo Vault.
* Namespace - The namespace in which the secret is stored.
