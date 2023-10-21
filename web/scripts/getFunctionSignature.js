const web3Abi = require("web3-eth-abi");


const funcSignature = (abi, params) => {
  const functionSignature = web3Abi.encodeFunctionCall(abi, params);
    return(functionSignature)
}



console.log(funcSignature({
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
}, ["0x22B5E002B8B20727d12331e88778828fb4B14683", BigInt(69 * 10 ** 18)]))

module.exports = {
    funcSignature
}
