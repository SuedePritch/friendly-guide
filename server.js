//import dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
//set port to 3001 if no environment variable is found
//heroku provides this environment variable
const PORT = process.env.PORT || 3001;
//simple helper to create unquire ids
const uuid = require('./utils/uuid')


// Setup for express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//get request that returns the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
//get request that returns notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});
//gets all notes from db.json
app.get('/api/notes', (req,res)=>{
    res.sendFile(path.join(__dirname, 'db/db.json'));
})

//adds new note to db.json
//retieves current array of notes
//adds new note to array
//overrights db.json with updated notes
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

//delete request
//reads all notes from db.json
//finds note with the correct id
//if note id is not the deleted it adds it to a new list
//overwrites db.json with updated notes
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
