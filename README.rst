Batch Ether Transfer Utility
============================

Load addresses and ether amounts from a CSV file and transfer all in a single batch.

Helpful when you have a large amount of ethers need to be transferred to different accounts,
for example in an ICO refunding process due to newly published regulation rules, this utility
may earn you some more hours to sleep.


Usage
-----

.. code:: bash

    ## fill in the config options according to your own environment
    mv config.sample.js config.js

    npm install

    npm run process


Duplication detection is included.

I know you are already very tired, BE CAREFUL to make sure the CSV file is correct, it is very fast and no going back.