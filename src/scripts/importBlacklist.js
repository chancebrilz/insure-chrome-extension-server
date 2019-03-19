const fs = require('fs');
const es = require('event-stream');
const db = require('../db.js');

const Blacklist = db.Blacklist;

const FILENAME = "./src/scripts/blacklist.txt";

db.connection.connection.once('open', function() { 
    processFile(FILENAME);
});

function processFile(inputFile) {
    let itemCount = 0;
    let items = [];

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
                if(itemCount % 1000 === 0) {
                    Blacklist.insertMany(items).then(function() {
                        console.log(`Inserted ${itemCount} items.`);
                        items = [];
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