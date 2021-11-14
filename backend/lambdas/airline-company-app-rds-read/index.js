const mysql = require('mysql');

exports.handler = async (event) => {
    // Create connection
    const connection = mysql.createConnection({
        host: process.env.RDS_HOST,
        user: process.env.RDS_USER,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
    })
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from VSCode!'),
    };
    return response;
};
