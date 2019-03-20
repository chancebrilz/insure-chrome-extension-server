const fs = require('fs');
const es = require('event-stream');
const db = require('../db.js');

const { mongoose, Blacklist } = db;

/**
 * Constants
 */
const FILENAME = "./src/scripts/blacklist.txt";

/**
 * Wait for the database connection to open before running
 */
db.mongoose.connection.once('open', function() { 
    processFile(FILENAME);
});


/**
 * Read file line by line
 */
function processFile(inputFile) {
    let itemCount = 0;
    let items = [];

    console.log('Reading file...');

    const s = fs
        .createReadStream(inputFile)
        .pipe(es.split())
        .pipe(es.mapSync(function(line) {
                // pause the readstream
                s.pause();
                itemCount++;

                items.push({
                    url: new String(line),
                    malicious: true
                });

                // Batch insert
                if(itemCount % 100 === 0) {

                    // Print to screen the current status
                    if(itemCount % 10000 === 0) {
                        console.log(`Inserted ${itemCount.toLocaleString()} items.`);
                    }

                    // Insert
                    Blacklist.insertMany(items).then(function() {
                        items.length = 0;
                        s.resume();
                    });
                } else {
                    s.resume();
                }
            })
            .on('error', function(err) {
                console.log('Error while reading file.', err);
                process.exit()
            })
            .on('end', function() {
                console.log('Finished import.');
                process.exit()
            })
        );
        
}