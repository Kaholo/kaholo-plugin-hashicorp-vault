# kaholo-plugin-hashicorp-vault
Kaholo plugin for communicating with a hashicorp vault Key Value server, version 2.

## Settings ##

* Vault URL - The URL to access the vault. If not provided the plugin will use http://127.0.0.1:8200.
* Token(Required) - Authentication token to access the vault. The value passed is of a vault type, meaning it needs to be saved as Kaholo vault item first.

## Method: Get Secret

**Description**

Get the value of a secret stored inside the vault.

**Parameters**

* Item key(Required) - The key of the secret to retrive. 
* Namespace - The namespace in which the secret is stored.

## Method: Get Item

**Description**

Get the item containing the secret. The item contains both the secret itself, and all it's metadata. 

**Parameters**

* Item key(Required) - The key of the secret to retrive. 
* Namespace - The namespace in which the secret is stored.

## Method: Set Item

**Description**

Set the value of a new or existing secret in the vault.

**Parameters**

* Item key(Required) - The key of the secret to set it's value. Can be either key of an existing secret or a new key.
* Namespace - The namespace in which to store the secret.
* value(Required) - The value to set to the secret. The value passed is of a vault type - meaning it needs to be saved as Kaholo vault item first.
