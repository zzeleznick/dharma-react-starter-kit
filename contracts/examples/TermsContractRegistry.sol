pragma solidity 0.4.19;


contract TermsContractRegistry {
    mapping (bytes32 => address) public symbolToTermsContractAddress;

    function setSimpleInterestTermsContractAddress(
        address tokenAddress,
        address termsContract
    )
        public
    {
        symbolToTermsContractAddress[keccak256(
            tokenAddress,
            "SimpleInterestTermsContract"
        )] = termsContract;
    }

    function getSimpleInterestTermsContractAddress(
        address tokenAddress
    )
        public
        view
        returns (address)
    {
        return symbolToTermsContractAddress[keccak256(
            tokenAddress,
            "SimpleInterestTermsContract"
        )];
    }
}
