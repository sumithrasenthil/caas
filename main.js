const{ Blockchain, Transaction}=require('./src/blockchain');
const EC =require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey =ec.keyFromPrivate('1457009b3c3ebc20de745620371aa98f5698cb65e1798d03a06fc7212560b448');
const myWalletAddress=myKey.getPublic('hex');

 let caas =new Blockchain();
 const tx1 =new Transaction(myWalletAddress,'Public key goes here',10);
 tx1.signTransaction(myKey);
 caas.addTransaction(tx1);


console.log("starting the miner....");
caas.minePendingTransactions(myWalletAddress);
console.log('Balance of the Miner-address',caas.getBalanceOfAddress(myWalletAddress));

caas.chain[1].transaction[0].amount=1;

console.log('Is Chain Valid?',caas.isChainValid());



 // console.log("mininng block 1....");
 // caas.addBlock(new Block(1,"14/12/2019",{ car:'Innova' ,amount:200}));
 // console.log("Minning block 2.....");
 // caas.addBlock(new Block(2,"21/12/2019",{ amount:10000}));
//  console.log('Is Blockchain valid ?'+ caas.isChainValid());
//  caas.chain[1].data ={ amount:4};
//  caas.chain[1].hash =caas.chain[1].calculateHash();
// console.log('Is Blockchain valid ?'+ caas.isChainValid());

//console.log(JSON.stringify(caas,null,4));
