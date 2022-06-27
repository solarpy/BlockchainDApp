var Contracts = { InformationRegistrationContract: {
    abi:[
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "balances",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_informationNo",
                    "type": "uint256"
                }
            ],
            "name": "getCustomer",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "informationNo",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "informationName",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "walletAddress",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "informationCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "receiever",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "mintCoins",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_customer",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "_address",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "registerNewInformation",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "receiever",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "sendCoins",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_informationNo",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_customer",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "_address",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "transferInformation",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
    address: "0xf7bb1ec85984059704132c8a02fbbd2794d0eaeb",
    endpoint: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
}}

function InformationRegistrationApp(Contract){
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}

InformationRegistrationApp.prototype.onReady = function() {
    this.init(function () {
        $('#message').append("DApp loaded successfully");
    });
    this.bindButtons(); // bind the button to their respective functions
    this.loadInformationRegistration();
}

InformationRegistrationApp.prototype.init = function (cb) {  // given
    // enable and connect to MetaMask
    if (window.ethereum) {
        this.web3 = new Web3(ethereum);
        try {
            ethereum.enable();
        } catch (error) {
        }
    }
    // Create the contract interface using the ABI provided in the configuration.
    var contract_interface = this.web3.eth.contract(this.Contract.abi);
    // Create the contract instance for the specific address provided in the configuration.
    this.instance = contract_interface.at(this.Contract.address);
    cb();
}

if (typeof (Contracts) === "undefined") var Contracts = { InformationRegistrationContract: { abi: [] } };  // refer to onready
var informationRegistrationApp = new InformationRegistrationApp(Contracts['InformationRegistrationContract']);
$(document).ready(function () {
    informationRegistrationApp.onReady();
});

InformationRegistrationApp.prototype.getInformationCount = function (cb) {
    this.instance.informationCount(function (error, informationCount) {
        cb(error, informationCount);
    });
};

InformationRegistrationApp.prototype.getCustomer = function (informationNo, cb) {
    this.instance.getCustomer(informationNo, function (error, information) {
        cb(error, information);
    });
};

InformationRegistrationApp.prototype.loadInformationRegistration = function () {
    var that = this;

    this.getInformationCount(function (error, informationCount) {
        if (error) {
            console.log(error)
        }
        $("#message").text("Information Count: " + informationCount);
        $("#informationListResults").empty(); //empty the information registration list table
        for (let i = 1; i <= informationCount; i++) {
            var informationNo = i;
            that.getCustomer(informationNo, function (error, information) {
                if (error) {
                    console.log(error)
                }
                var number = information[0];
                var customer = information[1];
                var wallet = information[2];
                var informationTemplate = "<tr><td>" + number + "</td><td>" + customer + "</td></tr>"
                $("#informationListResults").append(informationTemplate);
            });
        }

        var nextInformationCount = informationCount.toNumber() + 1;
        $("#newInformationNo").val(nextInformationCount);
        $("#newInformationNo").attr('disabled', true);

    });
}

InformationRegistrationApp.prototype.bindButtons = function() {
    var that = this;

    $(document).on("click", "#button-register", function() {
        that.registerNewInformation(); //calls the registerNewInformation function when the button-register is clicked
    });
    $(document).on("click", "#button-transfer", function() {
        that.transferInformation(); 
    });
    $(document).on("click", "#button-balance", function() {
        that.showAddressBalance();
    });
}

InformationRegistrationApp.prototype.registerNewInformation = function(){
    // Get input for information number and customer
    var newInformationNo = $("#newInformationNo").val();
    var newCustomer = $("#newCustomer").val();
    var newAddress = $("#newAddress").val();
    var newAmount = $("#newAmount").val();
    $("#message").text("Registering " + newInformationNo + " to " + newCustomer);

    this.instance.registerNewInformation(newCustomer,newAddress,newAmount,
        //gas required to execute the transaction
        { from: this.web3.eth.accounts[0], gas: 1000000, gasPrice: 1000000000, gasLimit:
1000000 },
        function(){
            if(error){
                console.log(error);
            }
            else{
                if (receipt.status == 1){
                    $("#newInformationNo").val("");
                    $("#newCustomer").val("");
                    $("#newAddress").val("");
                    $("newAmount").val("");
                    that.loadInformationRegistration();
                }
                else{
                    $("#message").text("Registration Failed");
                }
            }
        }
    )
}

InformationRegistrationApp.prototype.transferInformation = function() {
    // get input values for address and amount
    var txfInformationNo = $("#txfInformationNo").val();
    var txfCustomer = $("#txfCustomer").val();
    var txfAddress = $("#txfAddress").val();
    var txfAmount = $("#txfAmount").val();
    $("#message").text("Transfering " + txfInformationNo + " to " + txfCustomer);

    this.instance.transferInformation(txfInformationNo, txfCustomer,txfAddress,txfAmount,
        // gas required to execute the transaction
    { from: this.web3.eth.accounts[0], gas: 1000000, gasPrice: 1000000000, gasLimit: 1000000
    },
        function() {
            if(error) {
                console.log(error);
            }
            else {
                    if(receipt.status == 1) {
                        $("#txfInformationNo").val("");
                        $("#txfCustomer").val("");
                        $("#txfAddress").val("");
                        $("#txfAmount").val("");
                        that.loadInformationRegistration();
                    }
                    else {
                        $("#message").text("Transfer Failed");
                }
            }
        }
    )
}

InformationRegistrationApp.prototype.getBalance = function(address, cb){
    this.instance.balances(address,function(error, result) {
        cb(error, result)
    })
}

InformationRegistrationApp.prototype.showAddressBalance = function(hash, cb) {

    var address = $("#walletAddress").val();

    this.getBalance(address, function(error, balance) {
        if(error) {
            console.log(error)
        }
        $("#showbalance").text("Wallet Balance: " + balance.toNumber());
    })
}