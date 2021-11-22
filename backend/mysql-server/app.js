const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

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

app.get('/airports', (req, res) => {
    res.status(200);
    res.json([
        {
            name: 'Aaa Bbb Ccc',
            code: 'ABC',
        },
        {
            name: 'Bbb Bbb Ddd',
            code: 'BBD',
        }
    ]);
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});