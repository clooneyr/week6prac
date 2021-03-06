const escrowSource = `#pragma version 5
txn ApplicationID
int 0
==
bnz main_l8
txn OnCompletion
int NoOp
==
bnz main_l3
err
main_l3:
txna ApplicationArgs 0
byte "opt_nft"
==
bnz main_l7
txna ApplicationArgs 0
byte "transfer"
==
bnz main_l6
err
main_l6:
itxn_begin
int axfer
itxn_field TypeEnum
txna Assets 0
itxn_field XferAsset
int 1
itxn_field AssetAmount
txn Sender
itxn_field AssetReceiver
itxn_submit
itxn_begin
int acfg
itxn_field TypeEnum
txna Assets 0
itxn_field ConfigAsset
txn Sender
itxn_field ConfigAssetManager
itxn_submit
int 1
return
main_l7:
txn Sender
byte "NFT_OWNER"
app_global_get
==
assert
itxn_begin
int axfer
itxn_field TypeEnum
txna Assets 0
itxn_field XferAsset
int 0
itxn_field AssetAmount
global CurrentApplicationAddress
itxn_field AssetReceiver
itxn_submit
int 1
return
main_l8:
byte "NFT_OWNER"
txna ApplicationArgs 0
app_global_put
int 1
return
`;

module.exports = escrowSource;