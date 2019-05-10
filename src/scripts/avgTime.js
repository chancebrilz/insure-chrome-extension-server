const db = require('../db.js');

const { Log } = db;

/**
 * Constants
 */
const FILENAME = "./src/scripts/blacklist.txt";

/**
 * Wait for the database connection to open before running
 */
db.mongoose.connection.once('open', function() { 
    Log.find({}).then(response => {
      const itemCount = response.length;

      console.log(`Found ${itemCount} logs.`);

      const sum = response.reduce((sum, item) => {
        return sum + item.length;
      }, 0); 

      console.log(`Average lookup time: ${sum/itemCount}ms`);

      process.exit();
    });
});