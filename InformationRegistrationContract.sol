pragma solidity ^0.5.10;

contract InformationRegistrationContract {
    // Model Information
    struct Information {
        uint informationNo;
        Customer customer;
    }

    // Models a Customer
    struct Customer {
        string name;
        address walletAddress;
    }

    // Read/write information
    mapping(uint => Information) private informationList;
    uint public informationCount;

    // Read/write balances
    mapping(address => uint) public balances;

    // Gets owner details 
    function getCustomer (uint _informationNo) public view returns (uint informationNo, string memory informationName, address walletAddress){
        return (informationList[_informationNo].informationNo, informationList[_informationNo].customer.name, informationList[_informationNo].customer.walletAddress);
    }

    // add specified amount of coins into specified recievers address
    function mintCoins(address receiever, uint amount) public {
        balances[receiever] += amount;
    }

    // send specified amount of coins from sender to reciever 
    function sendCoins(address sender, address receiever, uint amount) public{
        require(amount <= balances[sender], "insufficient balance.");
        balances[sender] -= amount;
        balances[receiever] += amount;
    }

    function registerNewInformation (string memory _customer, address _address, uint _amount) public {
        // deducts balance from buyer's wallet
        balances[_address] -= _amount;

        // register buyer
        informationCount ++;
        InformationRegistrationContract.Customer memory newCustomer = Customer(_customer, _address);
        informationList[informationCount] = Information(informationCount, newCustomer); // Creates new Information & stores it into informationList
    }

    function transferInformation (uint _informationNo, string memory _customer, address _address, uint _amount) public {
        // deduct from buyer's wallet and add to seller's wallet
        address receiever = informationList[_informationNo].customer.walletAddress;
        sendCoins(_address, receiever, _amount);

        // transfer informationList
        InformationRegistrationContract.Customer memory newCustomer = Customer(_customer, _address);
        informationList[_informationNo] = Information(_informationNo,  newCustomer); // Create new information and update the informationList with the new information
    }

    constructor() public {
        mintCoins(0x767b88DE49E14eaf65c616F22714BD703985dC22, 5000); // add 5000 coins into 1st wallet 
        mintCoins(0xfb484befF22dF9842b4BAa1d3871392c47c6a19b, 10000); // add 10000 coins into 2nd wallet 

        registerNewInformation("Customer 1", 0x767b88DE49E14eaf65c616F22714BD703985dC22, 1000); // Registers the 1st information to Customer 1 for 1000 coins
        registerNewInformation("Customer 2", 0xfb484befF22dF9842b4BAa1d3871392c47c6a19b, 1000); // Registers the next information to Customer 2

    }
}