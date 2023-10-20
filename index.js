var Web3 = require('web3');
import { create } from 'ipfs-http-client';
// connect to the default API address http://localhost:5001
const client = create();
var MFS_path = '/files_this_is_a_purchase_document';


var callStoreOnLocalGanache = async function () {
  // let web3 = new Web3("http://localhost:8545");
  var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'));
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  console.log(web3.eth.defaultAccount);
  // var CoursetroContract = new web3.eth.Contract(abi);
  // var Coursetro = CoursetroContract.at(contractAddr);
  var myContract = new web3.eth.Contract(abi, contractAddr, { from: web3.eth.defaultAccount })
  console.log(myContract);
  let secretWords = 'This is a purchase document!';
  // function store(uint256 num)
  myContract.methods.store(secretWords)
    .send({ from: web3.eth.defaultAccount })
    .then(function (recippt) {
      // console.log("recippt:", JSON.stringify(recippt, null, 4))
      const hashFromWeb3 = Web3.utils.keccak256(secretWords).toLowerCase();
      client.files.write(MFS_path,
        new TextEncoder().encode(hashFromWeb3),
        { create: true }).then(async r => {
          // console.log("")
        }).catch(e => {
          console.log(e);
        });

    }).
    catch(error => {
      console.log(error)
    }
    )
}

var callRetrieveOnLocalGanache = async function () {
  // let web3 = new Web3("http://localhost:8545");
  var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'));
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  console.log(web3.eth.defaultAccount);
  // var CoursetroContract = new web3.eth.Contract(abi);
  // var Coursetro = CoursetroContract.at(contractAddr);
  var myContract = new web3.eth.Contract(abi, contractAddr, { from: web3.eth.defaultAccount })

  console.log(myContract);
  // function store(uint256 num)
  myContract.methods.retrieve()
    .call({ from: web3.eth.defaultAccount })
    .then(function (recippt) {
      console.log("recippt:", JSON.stringify(recippt, null, 4))
    }).
    catch(error => {
      console.log(error)
    }
    )
}

var verifyDocumentOnLocalGanache = async function () {
  // let web3 = new Web3("http://localhost:8545");
  var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'));
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  console.log(web3.eth.defaultAccount);
  // var CoursetroContract = new web3.eth.Contract(abi);
  // var Coursetro = CoursetroContract.at(contractAddr);
  var myContract = new web3.eth.Contract(abi, contractAddr, { from: web3.eth.defaultAccount })

  client.files.stat(MFS_path, { hash: true }).then(async r => {
    let content = r.cid.toString();
    // console.log("created message on IPFS:", cid);
    myContract.methods.verify(content)
      .call({ from: defaultAcc })
      .then(function (recippt) {
        console.log("verifyDocumentOnLocalGanache:", JSON.stringify(recippt, null, 4))
      }).
      catch(error => {
        console.log(error)
      }
      )
    // console.log(content.toString());
  });

}

let contractAddr = '0x2D88e22d51Be3c52de75615CD252fdF717eCC0c6';
let abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "num",
        "type": "uint256"
      }
    ],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "retrieve",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

callStoreOnLocalGanache().then(() => {
  setTimeout(function () {
    // if (newState == -1) {
    callRetrieveOnLocalGanache();

    // }
  }, 500);
})
  .catch(msg => {
    console.log(msg);
  });
