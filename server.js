const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = 3001;
const db = require('./db/db.json')

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});
app.get('/api/notes', (req,res)=>{
    return res.json(db);
})


app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;
    const newNote = {
        title,
        text
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(newNote);
            fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
                writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
            );
        }
    });

    
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
