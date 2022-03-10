require('dotenv').config()
const express = require('express');
const app = express();
const router = require('./router_join_tables');
const port = process.env.SERVER_PORT;
const morgan = require('morgan');
const cors = require('cors');

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// routes
app.use('/api', router);
app.use('/', router);

// listen to port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});