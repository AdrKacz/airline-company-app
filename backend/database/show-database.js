const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

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
    const client = new LambdaClient({ region: 'eu-west-3' });

    const command = new InvokeCommand({
        FunctionName: 'arn:aws:lambda:eu-west-3:010661011891:function:airline-company-app-rds-admin',
        Payload: JSON.stringify({
            'Query': `SHOW TABLES`,
        })
    });

    try {
        const data = await client.send(command);
        console.log(binArrayToJson(data.Payload));
    } catch (error) {
        console.error(error);
    } finally {
        console.log(`Job Done.`);
    }
})();
