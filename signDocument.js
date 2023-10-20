var Web3 = require('web3');

let documentContent = '';
let defaultAcc;
let h, r, s, v;
let web3, myContract;
var setDocumentContentOnLocalGanache = async function () {
  web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'));
  const accounts = await web3.eth.getAccounts();
  defaultAcc = accounts[0];
  myContract = new web3.eth.Contract(abi, contractAddr, { from: defaultAcc })
  documentContent = "secret words";
  myContract.methods.setContent(documentContent)
    .send({ from: defaultAcc })
    .then(function (recippt) {
    }).
    catch(error => {
      console.log(error)
    }
    )
}

var signDocumentOnLocalGanache = async function () {
  myContract.methods.getContent().call({ from: defaultAcc })
    .then(async function (document) {
      console.log("getDocumentContentOnLocalGanache:", JSON.stringify(document, null, 4))
      // sign document
      h = web3.utils.soliditySha3(document)
      var signature = await web3.eth.sign(h, defaultAcc) // using ECDSA
      console.log("sig:", signature);
      r = signature.slice(0, 66);
      console.log(r);
      s = "0x" + signature.slice(66, 130);
      console.log(s);
      v = "0x" + signature.slice(130, 132);
      v = web3.utils.toDecimal(v);
      v = v + 27;
      console.log(v);
      verifyDocumentOnLocalGanache();
    }).
    catch(error => {
      console.log(error)
    }
    )
}

var verifyDocumentOnLocalGanache = async function () {
  // let web3 = new Web3("http://localhost:8545");
  console.log(defaultAcc);
  // function store(uint256 num)
  console.log(h, v, r, s)
  myContract.methods.verify(h, v, r, s)
    .call({ from: defaultAcc })
    .then(function (recippt) {
      console.log("verifyDocumentOnLocalGanache:", JSON.stringify(recippt, null, 4))
    }).
    catch(error => {
      console.log(error)
    }
    )
}

let contractAddr = '0x8c1335B3B603c5e66cAA535D6dbf96180C764c34';
let abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newwords",
        "type": "string"
      }
    ],
    "name": "setContent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContent",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
  }
];

setDocumentContentOnLocalGanache().then(recippt1 => {
  // console.log(recippt1);
  signDocumentOnLocalGanache().then(recippt2 => {
    // console.log(recippt2);
    // verifyDocumentOnLocalGanache();
  })
    .catch(msg2 => {
      console.log(msg2);
    });
})
  .catch(msg1 => {
    console.log(msg1);
  });
