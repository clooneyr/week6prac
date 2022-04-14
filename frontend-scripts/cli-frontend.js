const algosdk = require('algosdk');
const counterSource = require('./escrow-teal');
const clearSource = require('./clear-teal');
const { encodeAddress, getApplicationAddress} = require('algosdk');

async function compileProgram(client, programSource) {
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(programSource);
    let compileResponse = await client.compile(programBytes).do();
    let compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, "base64"));
    return compiledBytes;
}
function bigIntToUint8Array(bn) {
  var hex = BigInt(bn.toString()).toString(16);
  if (hex.length % 2) {
    hex = '0' + hex;
  }

  var len = hex.length / 2;
  var u8 = new Uint8Array(len);

  var i = 0;
  var j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  return u8;
}

function EncodeUint(intOrString) {
  return bigIntToUint8Array(intOrString)
}
function EncodeBytes(utf8String) {
    let enc = new TextEncoder()
    return enc.encode(utf8String)
}

async function frontEnd() {

    try {
 
        const algosdk = require('algosdk');
		const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
		const port = '';
		const token = {'X-API-Key': ''}
		

		const algodClient = new algosdk.Algodv2(token, baseServer, port);
		let params = await algodClient.getTransactionParams().do();

        const senderSeed = "garage bright wisdom old fan mesh pull acquire clever pear era flight horror memory nerve ten hospital scorpion cricket erosion leader better hockey ability throw";
        let senderAccount = algosdk.mnemonicToSecretKey(senderSeed);
        let sender = senderAccount.addr;
        

       	let counterProgram = await compileProgram(algodClient, counterSource);
        let clearProgram = await compileProgram(algodClient, clearSource);
        let onComplete = algosdk.OnApplicationComplete.NoOpOC;


        let localInts = 0;
		let localBytes = 0;
		let globalInts = 10;
		let globalBytes = 10;

		let accounts = undefined;
        let foreignApps = undefined;
        let foreignAssets = undefined;
        let appID = 83732282//update


        let appAdmin = new algosdk.decodeAddress(sender);

        let appArgs = [];
        appArgs.push(appAdmin.publicKey);

        let appArgs2 = [];
        appArgs2.push(EncodeBytes('opt_nft'));
        //appArgs2.push(EncodeBytes('transfer'));

        let foreignAssets2 = [83730811]; // Change this to newly minted NFT
        let escrowAddress = getApplicationAddress(appID);
        console.log(escrowAddress);


        let deployContract = algosdk.makeApplicationCreateTxn(sender,params,onComplete,counterProgram,clearProgram,localInts,localBytes,globalInts,globalBytes,appArgs,accounts,foreignApps,foreignAssets);
     	let signedTxn = deployContract.signTxn(senderAccount.sk);
        
      //   let callContract = algosdk.makeApplicationNoOpTxn(sender, params, appID, appArgs2, accounts, foreignApps, foreignAssets2);
     	// let signedTxn = callContract.signTxn(senderAccount.sk);
	   
        // Submit the transaction
        let tx = (await algodClient.sendRawTransaction(signedTxn).do());

        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
        let transactionResponse = await algodClient.pendingTransactionInformation(tx.txId).do();
        let appId = transactionResponse['application-index'];

        //Get the completed Transaction
        console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
        console.log("The application ID is: " + appId)
 
    }
    catch (err) {
        console.log("err", err);
    }
    process.exit();
};

frontEnd();