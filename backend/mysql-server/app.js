const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

async function getObjects(name) {
    return [{
        id: 1,
        name: 'Aaa Bbb Ccc ' + name,
        code: 'ABC',
    }]
}

app.use(cors());

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
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
    objects = await getObjects('airports')
    res.json(objects);
});

app.get('/employees', async (req, res) => {
    res.status(200);
    objects = await getObjects('employees')
    res.json(objects);
});

app.get('/connections', async (req, res) => {
    res.status(200);
    objects = await getObjects('connections')
    res.json(objects);
});

app.get('/airplanes', async (req, res) => {
    res.status(200);
    objects = await getObjects('airplanes')
    res.json(objects);
});

app.get('/flights', async (req, res) => {
    res.status(200);
    objects = await getObjects('flights')
    res.json(objects);
});

app.get('/pilots', async (req, res) => {
    res.status(200);
    objects = await getObjects('pilots')
    res.json(objects);
});

app.get('/crew-members', async (req, res) => {
    res.status(200);
    objects = await getObjects('crew-members')
    res.json(objects);
});

app.get('/departures', async (req, res) => {
    res.status(200);
    objects = await getObjects('departures')
    res.json(objects);
});

app.get('/consumers', async (req, res) => {
    res.status(200);
    objects = await getObjects('consumers')
    res.json(objects);
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});