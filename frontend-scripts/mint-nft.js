const algosdk = require('algosdk');
const counterSource = require('./escrow-teal');
const clearSource = require('./clear-teal');
const { encodeAddress, getApplicationAddress} = require('algosdk');


async function nftMinter() {

    try {
 

        const algosdk = require('algosdk');
		const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
		const port = '';
		const token = {'X-API-Key': ''}
		

		const algodClient = new algosdk.Algodv2(token, baseServer, port);
		let params = await algodClient.getTransactionParams().do();

        const senderSeed = "garage bright wisdom old fan mesh pull acquire clever pear era flight horror memory nerve ten hospital scorpion cricket erosion leader better hockey ability throw";
        let senderAccount = algosdk.mnemonicToSecretKey(senderSeed);
       
       

        let escrowID = 82833763 //change this
        let escrowAddress = getApplicationAddress(escrowID);
        amount = 1000000;
      


        const creator = senderAccount.addr;
        const defaultFrozen = false;
        const unitName = "TUT";
        const assetName = "tutorial";
        const assetURL = "https://gateway.pinata.cloud/ipfs/QmSF5GEeJpzZsmT9jygZ3XvweWThMeNFwMVriveiLVGzSx";
        let note = undefined;
        const manager = senderAccount.addr;
        const reserve = undefined;
        const freeze = undefined;
        const clawback = undefined;
        let assetMetadataHash = undefined;
        const total = 1;
        const decimals = 0;

        const mintNFT = algosdk.makeAssetCreateTxnWithSuggestedParams(
            creator,
            note,
            total,
            decimals,
            defaultFrozen,
            manager,
            reserve,
            freeze,
            clawback,
            unitName,
            assetName,
            assetURL,
            assetMetadataHash,
            params,
        );
        
     	let signedTxn = mintNFT.signTxn(senderAccount.sk);
   
	   
        // Submit the transaction
        let tx = (await algodClient.sendRawTransaction(signedTxn).do());

        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
        let transactionResponse = await algodClient.pendingTransactionInformation(tx.txId).do();

        //Get the completed Transaction
        console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    }
    catch (err) {
        console.log("err", err);
    }
    process.exit();
};

nftMinter();