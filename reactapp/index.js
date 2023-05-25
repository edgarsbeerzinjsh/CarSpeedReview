const express = require('express');
const cors = require('cors');
const myapp = express();

// serve up production assets

myapp.use(express.static('build'));
myapp.use(cors());
// let the react app handle any unknown route
// serve up index.html file if it doesn't recognize route
const path = require('path');

myapp.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// if not in production use the port 3000
const PORT = process.env.PORT || 3000;
console.log('server started on port:', PORT);
myapp.listen(PORT);