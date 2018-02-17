/*

  Copyright 2017 Dharma Labs Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

pragma solidity 0.4.19;

import "./MockContract.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract MockERC20Token is MockContract {
    function transfer(
        address _to,
        uint _amount
    )
        public
        returns (bool _success)
    {
        functionCalledWithArgs("transfer", getTransferArgsSignature(
            _to,
            _amount
        ));

        return true;
    }

    function wasTransferCalledWith(
        address _to,
        uint _amount
    )
        public
        view
        returns (bool wasCalled)
    {
        return wasFunctionCalledWithArgs("transfer", getTransferArgsSignature(
            _to,
            _amount
        ));
    }

    function transferFrom(
        address _from,
        address _to,
        uint _amount
    )
        public
        returns (bool _success)
    {
        functionCalledWithArgs("transferFrom", getTransferFromArgsSignature(
            _from,
            _to,
            _amount
        ));

        return true;
    }

    function wasTransferFromCalledWith(
        address _from,
        address _to,
        uint _amount
    )
        public
        view
        returns (bool wasCalled)
    {
        return wasFunctionCalledWithArgs("transferFrom", getTransferFromArgsSignature(
            _from,
            _to,
            _amount
        ));
    }

    function balanceOf(address _owner) public view returns(uint _balance) {
        return uint(getMockReturnValue("balanceOf", keccak256(_owner)));
    }

    function mockBalanceOfFor(address _owner, uint _balance) public {
        mockReturnValue("balanceOf", keccak256(_owner), bytes32(_balance));
    }

    function allowance(address _owner, address _to) public view returns(uint _allowance) {
        return uint(getMockReturnValue("allowance", keccak256(_owner, _to)));
    }

    function mockAllowanceFor(address _owner, address _to, uint _allowance) public {
        mockReturnValue("allowance", keccak256(_owner, _to), bytes32(_allowance));
    }

    function getTransferArgsSignature(
        address _to,
        uint _amount
    )
        internal
        pure
        returns (bytes32 args)
    {
        return keccak256(
            _to,
            _amount
        );
    }

    function getTransferFromArgsSignature(
        address _from,
        address _to,
        uint _amount
    )
        internal
        pure
        returns (bytes32 argsSignature)
    {
        return keccak256(
            _from,
            _to,
            _amount
        );
    }

    function getFunctionList()
        internal
        returns (string[10] functionNames)
    {
        return ["transfer", "transferFrom", "allowance", "balanceOf", "", "", "", "", "", ""];
    }
}
