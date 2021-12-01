exports.connect = (connection) => (
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

exports.end = (connection) => (
    new Promise((resolve, reject) => {
        connection.end((err, result) => {
            if (err) {
                console.error('error ending: ' + err.stack);
                reject(err);
            }
            console.log('end connection with id ' + connection.threadId);
            resolve(result)
        })
    }).catch((err) => {throw err})
);

exports.query = (connection, q, params) => (
    new Promise((resolve, reject) => {
        const query = connection.query({
            sql: q,
            values: params,
        }, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result)
        });
        console.log('Query: ', query.sql);
    }).catch((err) => {throw err})
);

