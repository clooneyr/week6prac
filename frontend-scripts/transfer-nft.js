const algosdk = require('algosdk');
const counterSource = require('./escrow-teal');
const clearSource = require('./clear-teal');
const { encodeAddress, getApplicationAddress} = require('algosdk');


async function transfer() {

    try {
 
        const algosdk = require('algosdk');
		const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
		const port = '';
		const token = {'X-API-Key': ''}
		

		const algodClient = new algosdk.Algodv2(token, baseServer, port);
		let params = await algodClient.getTransactionParams().do();

        const senderSeed = "garage bright wisdom old fan mesh pull acquire clever pear era flight horror memory nerve ten hospital scorpion cricket erosion leader better hockey ability throw";
        let senderAccount = algosdk.mnemonicToSecretKey(senderSeed);
       

        const sender = senderAccount.addr;
        let note = undefined;
        const manager = senderAccount.addr;
        let closeRemainderTo = undefined;
        let revocationTarget = undefined;
        reserve = undefined;
        freeze = undefined;
        clawback = undefined;
        strictEmptyAddressChecking = false;
        nftID = 83730811;
        escrowaddr = "2KPDMPNG34SFAOU42VP6WWMMOE3KM6AUQHGFVVIP6RYJGR26V5YCAC6YRM";

          let transfer = algosdk.makeAssetTransferTxnWithSuggestedParams(
            sender,
            escrowaddr,
            closeRemainderTo,
            revocationTarget,
            1,
            note,
            nftID,
            params,
        );

        let management = algosdk.makeAssetConfigTxnWithSuggestedParams(
            sender,
            note,
            nftID,
            escrowaddr,
            reserve,
            freeze,
            clawback,
            params,
            strictEmptyAddressChecking,
        );


        let atomictxn = [transfer,management];
        let txgroup = algosdk.assignGroupID(atomictxn);


        let signedTx1 = transfer.signTxn(senderAccount.sk);
        let signedTx2 = management.signTxn(senderAccount.sk);
        
        let signedTxn = [];
        signedTxn.push(signedTx1);
        signedTxn.push(signedTx2);
       
	
        let tx = (await algodClient.sendRawTransaction(signedTxn).do());

        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
        let transactionResponse = await algodClient.pendingTransactionInformation(tx.txId).do();

        console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    }
    catch (err) {
        console.log("err", err);
    }
    process.exit();
};

transfer();