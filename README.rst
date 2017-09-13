Batch Ether Transfer Utility
============================

Load addresses and ether amounts from a CSV file and transfer all in a single batch.

Helpful when you have a large amount of ethers need to be transferred to different accounts,
for example in an ICO refunding process due to newly published regulation rules, this utility
may earn you some more hours to sleep.

Configuration
-------------

The scripts utilized web3's personal API, for it to work you must enable it in your parity node first.
Start your parity node with the following command with do the trick:

.. code:: bash
    parity --jsonrpc-apis eth,net,web3,personal


Duplication detection works by loading a processed address list from file and check duplicates
before sending. After each run, updated processed list will be saved to another file in case
of exceptions caused data missing. You might want to config the processedListFile and the
processedListUpdateFile to the same file for convenience during multiple runs.

Usage
-----

.. code:: bash

    ## fill in the config options according to your own environment
    mv config.sample.js config.js

    npm install

    npm run process


Duplication detection is included.

I know you are already very tired, BE CAREFUL to make sure the CSV file is correct, it is very fast and no going back.
