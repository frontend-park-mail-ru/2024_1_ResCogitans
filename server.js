const express = require('express');
const path = require('path');
require('dotenv').config({ path: '/' });

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/src', express.static(path.join(__dirname, 'src')));

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/docs', express.static(path.join(__dirname, 'docs')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server started');
});
