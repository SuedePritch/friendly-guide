const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = 3001;
const uuid = require('./utils/uuid')

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
    res.sendFile(path.join(__dirname, 'db/db.json'));
})


app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id:uuid()
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
        res.sendFile(path.join(__dirname, 'public/notes.html'));
        }
    });
})

app.delete('/api/notes/:id', (req, res) => {
    const updatedNotesArray = []

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const notesData = JSON.parse(data);
            for (let i = 0; i < notesData.length; i++) {
                let noteById = notesData[i].id;
                if(noteById === req.params.id){
                    console.log(`deleted   ${noteById}`);
                }else{
                    updatedNotesArray.push(notesData[i])
                };
            fs.writeFile(
                './db/db.json',
                JSON.stringify(updatedNotesArray, null, 4),
                (writeErr) =>
                    writeErr
                    ? console.error(writeErr)
                    : console.info(`Successfull deleted`)
                    );
            }
            res.sendFile(path.join(__dirname, 'public/notes.html'));
        }})})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
