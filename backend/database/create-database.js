const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const fs = require('fs');

const binArrayToJson = function(binArray) {
    let str = '';
    for (var i = 0; i < binArray.length; i++) {
        str += String.fromCharCode(parseInt(binArray[i]));
    } 
    let object;
    try {
        object = JSON.parse(str);
    } catch (error) {
        object = str;
    }
    return object;
};

(async () => {
    // Read Model Definition
    let queries;
    try {
        const data = fs.readFileSync('./model.sql', 'utf-8');
        queries = data.split(';');
    } catch (error) {
        console.error(error);
        return;
    }
    const client = new LambdaClient({ region: 'eu-west-3' });
    // Loop over model synchronously to avoid dependency problem
    for (let index = 0; index < queries.length - 1; index++) {
        const query = queries[index].replace(/^\s+|\s+$/g, '');
        const command = new InvokeCommand({
            FunctionName: 'arn:aws:lambda:eu-west-3:010661011891:function:airline-company-app-rds-admin',
            Payload: JSON.stringify({
                'Query': query,
            })
        });
        try {
            const data = await client.send(command);
            console.log(`[${index}] Query`);
            console.log(query);
            console.log(`[${index}] Result`);
            console.log(binArrayToJson(data.Payload));
        } catch (error) {
            console.error(`[${index}] Query`)
            console.error(query);
            console.error(`[${index}] Error`);
            console.error(error);
        } finally {
            console.log(`[${index}] Job Done.`);
        }
        
    }
})();
