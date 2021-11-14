const mysql = require('mysql');

// Create connection
const connection = mysql.createConnection({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database : process.env.RDS_DATABASE,
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

    if (!event.Query) {
        return errorResponse('No Query Defined!');
    } else {
        const result = await query(event.Query);
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }
    }  
};
