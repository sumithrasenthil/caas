const SHA256=require('crypto-js/sha256');
const EC =require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromaddres,toaddress,amount) {
        this.fromaddress= fromaddres;
        this.toaddress =toaddress;
        this.amount=amount;
    }
    calculateHash(){
        return SHA256(this.fromaddress +  this.toaddress + this.amount).toString();

    }
    signTransaction(signingKey){

        if(signingKey.getPublic('hex') !==this.fromaddress){
            throw new Error("Yoy can't sign other wallets");
        }
       const hashTx=this.calculateHash();
       const sign =signingKey.sign(hashTx,'base64');
       this.signature=sign.toDER('hex');
    }
    isValid(){
        if(this.fromaddress ===null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in the transactions');
        }
        const publicKey =ec.keyFromPublic(this.fromaddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
}
class Block{
    constructor(timestamp,transaction,previousHash='') {
        //this.index=index;
        this.timestamp =timestamp;
        this.transaction =transaction;
        this.previousHash =previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }
    calculateHash(){
        return SHA256( this.previousHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();

    }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash =this.calculateHash();
        }
        console.log("Block Mined :" + this.hash);
        console.log(this.nonce);
    }
    hasValidTransactions(){
        for(const tx of this.transaction){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

class Blockchain{
    constructor() {
        this.chain=[this.createGenesisBlock()];
        this.difficulty =1;
        this.pendingTransactions=[];
        this.minningreward =100;
    }
    createGenesisBlock(){
        return new Block("08/12/2010","genesis block","0");

    }
    getLatestBlock(){
        return this.chain[this.chain.length -1];

    }
    minePendingTransactions(minningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log(" Block successfully Mined:");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, minningRewardAddress, this.minningreward)
        ];
    }
    addTransaction(transaction){

        if(!transaction.fromaddress || !transaction.toaddress){
            throw new Error("transactions must include from address and to address");

        }
        if(!transaction.isValid()){
            throw new Error("Cannot add invalid transactions...");
        }

        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address){
        let balance =0;
        for(const block of this.chain){
            for(const trans of block.transaction){
                if(trans.fromaddress ===address){
                    balance -=trans.amount;
                }
                if(trans.toaddress ===address){
                    balance +=trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock =this.chain[i];
            const previousBlock =this.chain[ i-1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}


module.exports.Blockchain=Blockchain;
module.exports.Transaction=Transaction;

