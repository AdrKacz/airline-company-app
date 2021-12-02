require('dotenv').config();

const mysql = require('mysql');
const fs = require('fs');
const {connect, query} = require('../helpers/mysql-helpers');


(async () => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await connect(connection);

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
    for (let index = queries.length - 2; index >= 0; index--) {
        const q = queries[index].replace(/^\s+|\s+$/g, '');
        // Extract table name
        const raw_table = q.split(' ')[2];
        const table = raw_table.substring(1, raw_table.length - 3);
        const localQ = `DROP TABLE ${table}`;
        try {
            const result = await query(connection, localQ);
            console.log(`[${index}] Query`);
            console.log(localQ);
            console.log(`[${index}] Result`);
            console.log(result);
        } catch (error) {
            console.error(`[${index}] Query`);
            console.error(localQ);
            console.error(`[${index}] Error`);
            console.error(error);
        } finally {
            console.log(`[${index}] Job Done.`);
        }  
    }
    connection.end();
    return;
})();