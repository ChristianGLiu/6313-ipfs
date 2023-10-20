// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract Document {
    bytes32 secretWords;

    function store(string memory word) public {
        secretWords = keccak256(abi.encodePacked(word));
    }

    function retrieve() public view returns (bytes32) {
        return secretWords;
    }

    function verify(bytes32 _message) public view returns (int256) {
        if (secretWords == _message) {
            return 1;
        } else {
            return 0;
        }
    }
}
