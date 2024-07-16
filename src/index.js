const express = require('express');
const app = express();
const path = require('path');

// Routers
const imageRouter = require('./routers/image');

app.use('/api/image', imageRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

/* Disabled since this doesn't have the required funny stuff to work and would be a security risk
app.get("/upload", (req, res) => {
    res.sendFile(path.join(__dirname, "/html/upload.html"));
});
*/

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});