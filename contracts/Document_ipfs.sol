// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Document words
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Document {
    // string content;
    string documentIpfsCid;

    /**
     * @dev Store value in variable
     * @param newwords value to store
     */
    // function setContent(string memory newwords) public {
    //     content = newwords;
    // }

    /**
     * @dev Return value
     * @return value of 'content'
     */
    // function getContent() public view returns (string memory) {
    //     return content;
    // }

    /**
     * @dev Store value in variable documentIpfsCid
     * @param newwords value to store
     */
    function setIpfsCid(string memory newwords) public {
        documentIpfsCid = newwords;
    }

    /**
     * @dev Return value
     * @return value of 'documentIpfsCid'
     */
    function getIpfsCid() public view returns (string memory) {
        return documentIpfsCid;
    }


    /**
     * @dev verify encryted data
     * @param _message h = web3.utils.soliditySha3(document);signature = await web3.eth.sign(h, defaultAcc);
     * @param _v "0x" + signature.slice(130, 132); web3.utils.toDecimal(v); v + 27;
     * @param _r signature.slice(0, 66);
     * @param _s "0x" + signature.slice(66, 130);
     */
    function verify(
        bytes memory _message,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public pure returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix,_message));
        address signer = ecrecover(prefixedHash, _v, _r, _s);
        return signer;
    }
}
