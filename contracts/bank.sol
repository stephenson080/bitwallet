// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./account.sol";

contract Bank {
    address private admin;
    address private bankAddress;
    mapping(uint => Customer) public customers;
    uint private customersCount = 0;
    uint private currentCustomerIndex = 1;


    struct Customer {
        string username;
        address userAddress;
        bool created;
        address acctAddress;
    }

    event NewUser(address acctAddress);

    constructor(){
        admin = msg.sender;
        bankAddress = address(this);
    }


    function createAccount(string calldata username) public  {
        require(!customerExist(msg.sender), 'Already have an account');
        Customer storage customer = customers[currentCustomerIndex];
        Account newAccount = new Account(msg.sender, username);
        customer.created = true;

        customer.acctAddress = address(newAccount);

        emit NewUser(address(newAccount));
        
    }


    function getBankDetails() public view checkAdmin returns (address, address, uint){
        return (
            bankAddress,
            admin,
            customersCount
        );
    }

    function customerExist(address usAddress) private view returns(bool) {
        for(uint i = 1; i <= customersCount; i++){
            if(customers[i].userAddress == usAddress) {
                return true;
            }
        }
        return false;
    }

    function getCustomers() public view checkAdmin returns(uint){
        return customersCount;
    }

    modifier checkAdmin(){
        require(msg.sender == admin, "Oops! You are not Authorised to make this Transaction");
        _;
    }
}