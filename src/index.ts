import { Account, Address, Balance, GasLimit, Mnemonic, NetworkConfig, ChainID, ProxyProvider, Transaction, TransactionPayload, UserSecretKey, UserSigner } from "@elrondnetwork/erdjs/out";
import BN from 'bn.js';

const main = async () => {
    const getPrivateKey = (): string => {
        const mnemonic = Mnemonic.fromString('xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx ')
        // console.log('mnemonic', mnemonic.deriveKey(0).hex())
        // console.log('mnemonic', mnemonic.deriveKey(1).hex())
        // console.log('mnemonic', mnemonic.deriveKey(2).hex())
        return mnemonic.deriveKey().hex();
    }

    let provider = new ProxyProvider("https://gateway.elrond.com", { timeout: 5000 });
    
    let signer = new UserSigner(UserSecretKey.fromString(getPrivateKey()));
    signer.getAddress()
    console.log('signer.getAddress()', signer.getAddress().bech32())

    // CRU token identifier
    const identifier = '4352552d613566346161'
    const unit = "000000000000000000";
    // CRU amount
    const amount = '9990' + unit;
    const amountHex = new BN(amount).toString(16);
    const payloadAmount = amountHex.length % 2 == 0 ? amountHex : '0' + amountHex

    const dest = "erd1dcgjvt3hcfyyav7jrq6a5dyl68nm0502wu4xzprgg474qm08hqxq20wkgc";

    const account = new Account(signer.getAddress());
    await account.sync(provider);

    // let payload = TransactionPayload
    //         .contractCall()
    //         .setFunction(new ContractFunction("transferToken"))
    //         .addArg()
    //         .addArg(new U32Value(1024))
    //         .build();

    // // setSpecialRole 
    // let tx = new Transaction({
    //     chainID: new ChainID('1'),
    //     nonce: account.nonce,
    //     gasLimit: new GasLimit(60000000),
    //     receiver: new Address("erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u"),
    //     value: Balance.egld(0),
    //     data: new TransactionPayload(`setSpecialRole@${identifier}@${account.address.hex()}@45534454526f6c654c6f63616c4d696e74`) 
    // });

    // // ESDTLocalMint
    // let tx = new Transaction({
    //     chainID: new ChainID('1'),
    //     nonce: account.nonce,
    //     gasLimit: new GasLimit(300000),
    //     receiver: new Address("erd1476h8qv68le2sd7pnwj3et9qpljwtr4ajjmzqf0syjetgrqjugjs4pfnzn"),
    //     value: Balance.egld(0),
    //     data: new TransactionPayload(`ESDTLocalMint@${identifier}@${payloadAmount}`) 
    //     // data: new TransactionPayload(`ESDTTransfer@${identifier}@${payloadAmount}`) 
    // });

    // ESDTTransfer
    let tx = new Transaction({
        chainID: new ChainID('1'),
        nonce: account.nonce,
        gasLimit: new GasLimit(500000),
        receiver: new Address(dest),
        value: Balance.egld(0),
        data: new TransactionPayload(`ESDTTransfer@${identifier}@${payloadAmount}`) 
    });

    try {
        NetworkConfig.getDefault().sync(provider);
    } catch (error) {
        console.error(error);
    }

    await signer.sign(tx);

    await tx.send(provider);

}

main().then().catch();
