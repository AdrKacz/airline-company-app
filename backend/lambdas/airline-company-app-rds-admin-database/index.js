const mysql = require('mysql');

// Create connection
const connection = mysql.createConnection({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
});

const errorResponse = (msg) => ({
    statusCode: 400,
    body: JSON.stringify(msg),
})

const query = (msg) => (
    new Promise((resolve, reject) => {
        connection.query(msg, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result)
        })
    }).catch((err) => {throw err})
)

exports.handler = async (event) => {
    if (!event.Action || !event.Database) {
        return errorResponse('No Action or Database Defined!');
    } else if (event.Action === 'Create') {
        const result = await query(`CREATE DATABASE ${event.Database}`)
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }
    } else if (event.Action === 'Drop') {
        const result = await query(`DROP DATABASE ${event.Database}`)
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }
    } else {
        return errorResponse('Action Unknown!');
    }    
};
