const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const mysql = require('mysql');
const {connect, end,  query} = require('./helpers/mysql-helpers');
const connection = mysql.createConnection({
    host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'airlineapp',
});
connect(connection);

const allowedName = [
    'airport',
    'employee',
    'connection',
    'airplane',
    'flight',
    'pilot',
    'crewmember',
    'departure',
    'consumer'
];

const app = express();
const port = 8080;

async function getObjects(object) {
    const result = await query(connection, 'SELECT * FROM ??', [object])
    return result;
}

async function getObject(object, objectId) {
    return {
        id: objectId,
        name: 'Aaa Bbb Ccc ' + object,
        code: 'ABC',
    }
}

function parsedValues(values) {
    const parsed = {};
    Object.entries(values).forEach(([key, value]) => {
        parsed[key.replace(/-/g, '_')] = value
    });
    return parsed;
}

async function insertObject(object, values) {
    const result = await query(connection, 'INSERT INTO ?? SET ?', [object, parsedValues(values)])
    return result;
}

async function updateObject(object, values, objectId) {
    const result = await query(connection, 'UPDATE ?? SET ? WHERE id = ?', [object, parsedValues(values), objectId])
    return result;
}

async function deleteObject(object, objectId) {
    const result = await query(connection, 'DELETE FROM ?? WHERE id = ?', [object, objectId])
    return result;
}

app.use(cors());

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

app.use(bodyParser.json());

app.post('/create', async (req, res) => {
    console.log(req.body);
    const object = req.body.object.replace('-', '');
    console.log(object, allowedName.includes(object))
    if (!allowedName.includes(object)) {
        res.status(400);
        res.json({msg:'This object cannot be created'});
        return;
    }

    // Create object
    const data = req.body.data;
    delete data.id;
    await insertObject(object, data).catch((err) => {console.error(err); res.status(400)});
    res.json({msg:'Create'});
    
});
app.post('/update', async (req, res) => {
    console.log(req.body);
    const object = req.body.object.replace('-', '');
    console.log(object, allowedName.includes(object))
    if (!allowedName.includes(object)) {
        res.status(400);
        res.json({msg:'This object type cannot be updated'});
        return;
    }
    const objectId = req.body.objectId;
    // Check for untrusted data
    const item = await getObject(object, objectId);
    if (!item) {
        res.status(400);
        res.json({msg:'Item cannot be found'});
        return;
    }

    // Update object
    const data = req.body.data;
    delete data.id;
    await updateObject(object, data, objectId).catch((err) => {console.error(err); res.status(400)});
    res.json({msg:'Update'});
});
app.post('/delete', async (req, res) => {
    console.log(req.body);
    const object = req.body.object.replace('-', '');
    console.log(object, allowedName.includes(object))
    if (!allowedName.includes(object)) {
        res.status(400);
        res.json({msg:'This object type cannot be deleted'});
        return;
    }
    const objectId = req.body.objectId;
    // Check for untrusted data
    const item = await getObject(object, objectId);
    if (!item) {
        res.status(400);
        res.json({msg:'Item cannot be found'});
        return;
    }

    // Delete object
    await deleteObject(object, objectId).catch((err) => {console.error(err); res.status(400)});
    res.json({msg:'Delete'});
});

app.get('/flights/airports/:from-:to/date/:date', (req, res) => {
    const flight = {
        from: req.params.from,
        to: req.params.to,
        date: req.params.date
    };

    if (!flight.from || !flight.to || !flight.date) {
        res.status(400);
        res.send('Not all params are defined');
        return;
    }

    // DEV
    res.status(200);
    res.json([{
        from: 'AAA',
        to: 'BBB',
        departure: new Date(),
        arrival: new Date(Date.now() + 86400000 * Math.random()),
        price: 50,
    }]);
    return;
});

app.get('/airports', async (req, res) => {
    res.status(200);
    objects = await getObjects('airport')
    res.json(objects);
});

app.get('/employees', async (req, res) => {
    res.status(200);
    objects = await getObjects('employee')
    res.json(objects);
});

app.get('/connections', async (req, res) => {
    res.status(200);
    objects = await getObjects('connection')
    res.json(objects);
});

app.get('/airplanes', async (req, res) => {
    res.status(200);
    objects = await getObjects('airplane')
    res.json(objects);
});

app.get('/flights', async (req, res) => {
    res.status(200);
    objects = await getObjects('flight')
    res.json(objects);
});

app.get('/pilots', async (req, res) => {
    res.status(200);
    objects = await getObjects('pilot')
    res.json(objects);
});

app.get('/crew-members', async (req, res) => {
    res.status(200);
    objects = await getObjects('crewmember')
    res.json(objects);
});

app.get('/departures', async (req, res) => {
    res.status(200);
    objects = await getObjects('departure')
    res.json(objects);
});

app.get('/consumers', async (req, res) => {
    res.status(200);
    objects = await getObjects('consumer')
    res.json(objects);
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});