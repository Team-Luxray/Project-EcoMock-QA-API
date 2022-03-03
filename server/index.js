const express = require('express');
const app = express();
const router = require('./router');
const port = 3000;
const morgan = require('morgan');
const cors = require('cors');

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// routes
app.use('/api', router);

// listed to port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});