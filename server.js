const express = require('express');

// use .env in dev mode
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');

//routes
const apiRouter = require('./routes/app-routes');

// Express settings
const app = express()
const port = 3003


// Bodyparser Middleware
app.use(multipart())
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Serve static files from public folder
app.use(express.static('client/public'));

// ---------------- API Routes ------------------
app.use('/api', apiRouter);


// --------------- App Routes --------------------
// Serve static content

// error handler
app.use((err, req, res, next) => {
     console.error(err.stack)
     res.status(500).send('Something broke!')
});

// Start Server
app.listen(process.env.port || process.env.PORT || port, () => console.log(`server is running on port ${port}`));
