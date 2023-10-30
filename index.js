var Web3 = require('web3');
var create = require('ipfs-http-client');
// connect to the default API address http://localhost:5001
const client = create();
var MFS_path = '/files_';

let document = 'This is a purchase document!';
let defaultAcc;
let h, r, s, v;
let web3, myContract;

web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'));


var callStoreOnLocalGanache = async function () {
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  defaultAcc = web3.eth.defaultAccount;
  console.log(defaultAcc);
  myContract = new web3.eth.Contract(abi, contractAddr, { from: defaultAcc })
  // console.log(myContract);
  h = web3.utils.soliditySha3(document)
  var signature = await web3.eth.sign(h, defaultAcc) // using ECDSA
  // console.log("sig:", signature);
  client.files.write(MFS_path + h.replace("0x", ""),
    new TextEncoder().encode(signature),
    { create: true }).then(async r => {
      // console.log("")
      myContract.methods.setIpfsCid(h.replace("0x", ""))
        .send({ from: web3.eth.defaultAccount })
        .then(function (recippt) {
          console.log("callStoreOnLocalGanache recippt:", JSON.stringify(recippt, null, 4))
        }).
        catch(error => {
          console.log(error)
        }
        )

    }).catch(e => {
      console.log(e);
    });
}

var callRetrieveOnLocalGanache = async function () {
  myContract.methods.getIpfsCid()
    .call({ from: web3.eth.defaultAccount })
    .then(function (recippt) {
      console.log("callRetrieveOnLocalGanache recippt:", JSON.stringify(recippt, null, 4))
      client.files.stat(MFS_path + recippt, { hash: true }).then(async recipt => {
        let ipfsAddr = recipt.cid.toString();
        // console.log(ipfsAddr)
        const resp = await client.cat(ipfsAddr);
        let content = [];
        let raw = "";
        for await (const chunk of resp) {
          content = [...content, ...chunk];
          raw = Buffer.from(content).toString('utf8')
          // console.log(JSON.parse(raw))
          console.log(raw)
        }
        r = raw.slice(0, 66);
        console.log(r);
        s = "0x" + raw.slice(66, 130);
        console.log(s);
        v = "0x" + raw.slice(130, 132);
        v = web3.utils.toDecimal(v);
        v = v + 27;
        console.log(v);
      });
    }).
    catch(error => {
      console.log(error)
    }
    )
}


var verifyDocumentOnLocalGanache = async function (accountToBeVerified) {
  // call the verify function on the smart contract...

      // check if the accountToBeVerified is the same as the one returned by the smart contract

}

let contractAddr = '0x0f068bb44c0677E65c1E7e68a3f3da79Ea6313b8';
let abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newwords",
        "type": "string"
      }
    ],
    "name": "setIpfsCid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getIpfsCid",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_message",
        "type": "bytes"
      },
      {
        "internalType": "uint8",
        "name": "_v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "_r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_s",
        "type": "bytes32"
      }
    ],
    "name": "verify",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
];

callStoreOnLocalGanache().then(() => {
  setTimeout(function () {
    callRetrieveOnLocalGanache();
    setTimeout(function () {
      // call the verifyDocumentOnLocalGanache checking if the account returned by the smart contract is the same as the default account...

    }, 1500);
  }, 500);
})
  .catch(msg => {
    console.log(msg);
  });
