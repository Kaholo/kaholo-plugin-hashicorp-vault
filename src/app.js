const request = require('request');

function getVaultRequestOptions(params, settings){
	// Get token from settings, and check it exists
	const token = (settings.token || ``).trim(); 
	if (!token){	
		throw `Not given token`;
	}
	// Get item key from parameters, and check it exists
	const itemKey = (params.itemKey || ``).trim();;
	if (!itemKey){
		throw `Not given item key`;
	}
	// Get namespace from parameters, and check it exists

	const namespace = (params.namespace || ``).trim();;
	if (namespace && !namespace.endsWith(`/`)){
		namespace += `/`;
	}
	// Get vault url from settings and add the path to the item wanted
	const vaultUrl = `${settings.vaultUrl || `http://127.0.0.1:8200`}/v1/${namespace}secret/data/${itemKey}`;

	return {
        url : vaultUrl,
        json : true,
        auth : {
			bearer: token,
            sendImmediately : true
		}
    };
}

async function sendHttpReq(requestOptions){
	return new Promise((resolve,reject)=>{
        request(requestOptions,function (err, response, _) {
            if(err){
                return reject(err);
            }
            resolve(response.body);
        });
    });
}
async function getVaultItem(action, settings){
	let requestOptions = getVaultRequestOptions(action.params, settings);
	requestOptions.method = `GET`;
	return sendHttpReq(requestOptions);
}

async function getSecret(action, settings){
	let getItemPromise = getVaultItem(action, settings);
	return getItemPromise.then((vaultItem) => {
		const dataItem = vaultItem.data.data;
		try {
			if (dataItem.value){
				return dataItem.value;
			}
		} catch {};
		return dataItem;
	});
}

async function setVaultItem(action, settings){
	let requestOptions = getVaultRequestOptions(action.params, settings);
	const itemVal = action.params.itemVal;
	if (!itemVal){
		throw "Not given value!"
	}
	requestOptions.method = `POST`;
	requestOptions.body = {data: {value: itemVal}}
	return sendHttpReq(requestOptions);
}

module.exports = {
    getVaultItem,
	getSecret,
	setVaultItem
}