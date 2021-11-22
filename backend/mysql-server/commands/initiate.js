const mysql = require('mysql');
const fs = require('fs');

(async () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'airlineapp',
    });

    const connect = () => (
        new Promise((resolve, reject) => {
            connection.connect((err, result) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    reject(err);
                }
                console.log('connected as id ' + connection.threadId);
                resolve(result)
            })
        }).catch((err) => {throw err})
    );

    const query = (q) => (
        new Promise((resolve, reject) => {
            connection.query(q, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result)
            })
        }).catch((err) => {throw err})
    );

    await connect();

    // Read Model Definition
    let queries;
    try {
        const data = fs.readFileSync('../database/model.sql', 'utf-8');
        queries = data.split(';');
    } catch (error) {
        console.error(error);
        connection.end();
        return;
    }

    // Loop over model synchronously to avoid dependency problem
    for (let index = 0; index < queries.length - 1; index++) {
        const q = queries[index].replace(/^\s+|\s+$/g, '');
        try {
            const result = await query(q);
            console.log(`[${index}] Query`);
            console.log(q);
            console.log(`[${index}] Result`);
            console.log(result);
        } catch (error) {
            console.error(`[${index}] Query`);
            console.error(q);
            console.error(`[${index}] Error`);
            console.error(error);
        } finally {
            console.log(`[${index}] Job Done.`);
        }  
    }
    connection.end();
    return;
})();