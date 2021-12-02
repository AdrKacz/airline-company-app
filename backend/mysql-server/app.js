const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');

// ===== ===== ===== ===== =====
// Connection to SQL Database
const mysql = require('mysql');
const {connect, end,  query} = require('./helpers/mysql-helpers');
const connection = mysql.createConnection({
    host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'airlineapp',
});
connect(connection);

// ===== ===== ===== ===== =====
// Create App API
const app = express();
const port = 8080;

// ===== ===== ===== ===== =====
// Functions to access SQL Database
const allowedName = [
    'user',
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

async function getObjects(object) {
    const result = await query(connection, 'SELECT * FROM ??', [object])
    return result;
}

async function getObject(object, objectId) {
    const result = await query(connection, 'SELECT * FROM ?? where id = ?', [object, objectId])
    return result.length > 0 ? result[0] : undefined;
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

// ===== ===== ===== ===== =====
// App level middleware
app.use(cors());

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

app.use(bodyParser.json());

// ===== ===== ===== ===== =====
// Router for needed authentication as admin
const adminRouter = express.Router();

// Auth middleware - Secret should not be here, only for dev purpose ;)
adminRouter.use((req, res, next) => {
    console.log('Admin Requested Access');
    if (req.body && req.body.token) {
        const decoded = jwt.verify(req.body.token, 'secret');
        if (decoded && decoded.role === 'admin') {
            next();
        } else {
            res.status(401);
            res.json({msg:'Auth Token not valid'});
        }
    } else {
        res.status(401);
        res.json({msg:'Auth Token not found'});
    }    
});

adminRouter.post('/create', async (req, res) => {
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
adminRouter.post('/update', async (req, res) => {
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
adminRouter.post('/delete', async (req, res) => {
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

app.use('/admin', adminRouter);

// ===== ===== ===== ===== =====
// Open API, no need to auth

// Sign in
app.post('/signin', (req, res) => {
    // Yep, everyone is admin for now
    const token = jwt.sign({ role: 'admin' }, 'secret');
    res.json({status:'connected', token: token, isAdmin: true});
});

// Get Database
app.get('/flights/airports/:from-:to/date/:date', async (req, res) => {
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
    const dateInt = parseInt(flight.date)
    if (!dateInt) { // 0 will never happen, if it does update the code (0 <-> 1970)
        res.status(400);
        res.send('Date isn\'t an interger');
        return;
    }

    // Request to database 
    console.log(flight.from, flight.to)
    const date = new Date(parseInt(dateInt));
    const sqlQuery = `
    SELECT departure.date, flight.departure_time, flight.arrival_time, a_departure.name as name_departure, a_arrival.name as name_arrival
    FROM departure
    LEFT JOIN flight ON departure.flight_id = flight.id
    LEFT JOIN connection ON flight.connection_id = connection.id
    LEFT JOIN airport a_departure ON connection.departure_airport_id = a_departure.id
    LEFT JOIN airport a_arrival ON connection.arrival_airport_id = a_arrival.id
    WHERE DATE(departure.date) = ? AND a_departure.id = ? AND a_arrival.id = ?
    ORDER BY departure.date ASC
    `;
    const result = await query(connection, sqlQuery, [date.toJSON().slice(0, 10), flight.from, flight.to])
    console.log('Result Search Flights');
    console.log(result);

    // Map the result to correct type
    const data = result.map(f => {
        const [dh, dm, ds] = f.departure_time.split(':').map(s => parseInt(s));
        const [ah, am, as] = f.arrival_time.split(':').map(s => parseInt(s));
        const [departure, arrival] = [new Date(f.date), new Date(f.date)]
        departure.setHours(dh, dm, ds);
        arrival.setHours(ah, am, as);
        return {
        from: f.name_departure,
        to: f.name_arrival,
        departure: departure,
        arrival: arrival,
        price: 50, // can be calculated in function of time, distance, and user
    }});
    // DEV, for test only
    data.push({
        id: Math.floor(1000 * Math.random()),
        from: 'From Test Name - ' + flight.from,
        to: 'To Test Name - ' + flight.to,
        departure: new Date(date),
        arrival: new Date(date.valueOf() + 86400000 * Math.random()),
        price: 25,
    });

    res.status(200); 
    res.json(data);
    return;
});

app.get('/users', async (req, res) => {
    res.status(200);
    objects = await getObjects('user')
    res.json(objects);
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

// ===== ===== ===== ===== =====
// Start API
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});