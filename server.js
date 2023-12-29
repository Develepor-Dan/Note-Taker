const express = require('express');
const path = require('path');
const Store = require('./db/store');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const store = new Store(); // Create an instance of your Store class

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// New route to get all notes as JSON
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await store.getNotes();
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a note by ID
app.delete('/api/notes/:id', async (req, res) => {
     try {
       const { id } = req.params;
       await store.removeNote(id);
       res.json({ success: true, message: `Note with ID ${id} deleted successfully` });
     } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Internal Server Error' });
     }
   });

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
