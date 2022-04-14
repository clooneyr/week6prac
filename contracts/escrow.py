from pyteal import *

def nft_escrow():

    contract_deployment = Seq([
            App.globalPut(Bytes("NFT_OWNER"), Txn.application_args[0]), 
            Approve(),
        ])


    optin_nft = Seq([   
        Assert(Txn.sender() == App.globalGet(Bytes("NFT_OWNER"))),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer, 
            TxnField.xfer_asset: Txn.assets[0],
            TxnField.asset_amount: Int(0),
            TxnField.asset_receiver: Global.current_application_address(),
            }),
        InnerTxnBuilder.Submit(),
        Approve(),
    ])


    buyer_address = Txn.sender()
    nft_amount = Int(1) 
    
    transfer_nft = Seq([
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
           # TxnField.asset_sender: escrow_address,
            TxnField.xfer_asset: Txn.assets[0],
            TxnField.asset_amount: nft_amount,
            TxnField.asset_receiver: buyer_address,
            }),
        InnerTxnBuilder.Submit(),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetConfig,
            TxnField.config_asset: Txn.assets[0],
            TxnField.config_asset_manager: buyer_address,
            }),
        InnerTxnBuilder.Submit(),
        Approve(),
    ])


    on_call_method = Txn.application_args[0]
    contract_interface = Cond(
        [on_call_method == Bytes("opt_nft"), optin_nft],
        [on_call_method == Bytes("transfer"), transfer_nft],
    )

    program_calls = Cond ( 
        [Txn.application_id() == Int(0), contract_deployment],
        [Txn.on_completion() == OnComplete.NoOp, contract_interface],
    )

    return program_calls

if __name__ == "__main__":
    with open("escrowSSC.teal", "w") as f:
        compiled = compileTeal(nft_escrow(), mode=Mode.Application, version=5)
        f.write(compiled)