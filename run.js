
var fs = require("fs");
var Web3 = require("web3");
var FastCsv = require("fast-csv");
var BigNumber = require("bignumber.js");

var config = require('./config.js');

var listFile = config.listFile;
var processedListFile = config.processedListFile;
var processedListUpdateFile = config.processedListUpdateFile;
var etherAccount = config.etherAccount;
var etherAccountPassword = config.etherAccountPassword;
var localParity = config.localParity;
var gasPriceInEther = config.gasPriceInEther;
var gasLimit = config.gasLimit;

var processedList = {};

loadProcessedList();

console.log("Connecting to local parity node...");

var web3 = new Web3(new Web3.providers.HttpProvider(localParity));

if(!web3.isConnected())
{
    terminate("Connection failed!");
    return;
}

console.log("Connection established");

var targets = [];

var stream = fs.createReadStream(listFile);

var csvStream = FastCsv({
        trim: true,
        delimiter: '\t'
    })
    .on("data", function(data){

        if(data.length !== 2)
        {
            terminate('Invalid csv file');
            process.exit(1);
        }

        var address = data[0];
        var amount = new BigNumber(data[1]);

        if(!web3.isAddress(address))
        {
            terminate("Invalid address: " + address);
            process.exit(1);
        }

        targets.push({
            address: address,
            amount: amount
        });
    })
    .on("end", function() {
        console.log('Parsing finished');
        startTransfer();
    });

console.log("Parsing CSV file...");

stream.pipe(csvStream);

function startTransfer()
{
    console.log("Transfering...");
    console.log("...................................................................");
    transfer(0, function(){
        terminate("Transfer completed");
    });
}

function transfer(current, callback)
{
    if(current === targets.length)
    {
        callback();
        return;
    }

    var address = targets[current].address;
    var amount = targets[current].amount;

    if(typeof(processedList[address.toLowerCase()]) !== 'undefined')
    {
        terminate("Duplicate found: " + address);
        return;
    }

    doTransfer(current, address, amount, callback);
}

function doTransfer(current, address, amount, callback)
{
    web3.personal.sendTransaction(
        {
            from: etherAccount,
            to: address,
            value: web3.toWei(amount, "ether"),
            gasPrice: web3.toWei(gasPriceInEther, "ether"),
            gas: gasLimit
        },
        etherAccountPassword,
        (err, txHash) => {

            if(err)
            {
                terminate(err);
                return;
            }

            console.log("Current: " + current);
            console.log("Address: " + address);
            console.log("Amount: " + amount);
            console.log("TxHash: " + txHash);
            console.log("...................................................................");

            processedList[address.toLowerCase()] = 1;

            transfer(current + 1, callback);
        }
    );
}

function debugDoTransfer(current, address, amount, callback)
{
    console.log("Current: " + current);
    console.log("Address: " + address);
    console.log("Amount: " + amount);
    console.log("TxHash: abc");
    console.log("...................................................................");

    transfer(current + 1, callback);
}

function loadProcessedList()
{
    var duplicates = [];

    var lines = fs.readFileSync(processedListFile, 'utf-8')
        .split('\n')
        .filter(Boolean);

    lines.forEach(function(line){

        var trimLine = line.trim().toLowerCase();

        if(typeof(processedList[trimLine]) !== 'undefined')
        {
            duplicates.push(trimLine);
        }

        processedList[trimLine] = 1;
    });

    console.log("Duplicates in proccessed list: ");
    console.log(duplicates);
}

function saveProcessedList()
{
    var out = fs.createWriteStream(processedListUpdateFile);

    for(var k in processedList)
    {
        if(processedList.hasOwnProperty(k))
        {
            out.write(k + "\n");
        }
    }

    out.on("end", function() {
        out.end();
    });
}

function terminate(msg)
{
    console.log(msg);
    saveProcessedList();
    console.log('Terminated');
}