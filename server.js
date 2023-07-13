require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/auth.router');
const userRouter = require('./routes/user.router');
const options = { origin: process.env.DOMAIN_CLIENT, credentials: true };

app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', authRouter);
app.use('/api', require('./routes/user.router'));

app.get('/', (req, res) => {
    res.json({ msg: 'Hello' });
});

app.use((req, res, next) => {
    return res.status(400).send({
        status: 400,
        msg: 'NOT FOUND'
    });
});

app.use((err, req, res, next) => {
    if (err) {
        res.status(err.status).send({
            status: err.status,
            msg: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`App is running on port::: ${PORT}`);
});
