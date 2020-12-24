var express = require("express");
var fs = require("fs");
const path = require("path");

// Get pre-existing data from the DB.JSON file
var data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080

// Sets up the Express app to handle data parsing
// =============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/assets", express.static("public/assets"));

// Call Root HTML Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Call Note Taking HTML Page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Call
app.get("/api/notes", function(req, res) {
    res.json(data);
});

//Save
app.post("/api/notes", function(req, res) {
    // Set newNote to the (note) object provided by index.js and give it a uniqueID
    let newNote = req.body;
    let uniqueId = (data.length).toString();
    newNote.id = uniqueId;
    data.push(newNote);
    // Write to DB.JSON file with updated data
    fs.writeFileSync("./db/db.json", JSON.stringify(data), function(err) {
        if (err) throw (err);        
    }); 
    res.json(data);    
});

// Delete - index.js uses /api/notes/ + id
// make sure to use variable /:id and check notes against the ID provided
app.delete("/api/notes/:id", function(req, res) {
    let noteId = req.params.id;
    let newId = 0;
    // Remove based on ID with .filter
    data = data.filter(currentNote => { return currentNote.id != noteId });
    // Reassign ID number after .filter function
    for (currentNote of data) {
        currentNote.id = newId.toString();
        newId++;
    }
    // Rewrite DB.JSON file with updated data
    fs.writeFileSync("./db/db.json", JSON.stringify(data));
    res.json(data);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});