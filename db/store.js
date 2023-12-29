// Import necessary modules
const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Convert callback-based functions to promise-based
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Define the Store class
class Store {
  // Read data from the file and parse it as JSON
  async read() {
    try {
      const notes = await readFileAsync('db/db.json', 'utf8');
      return [].concat(JSON.parse(notes));
    } catch (err) {
      // If there's an error (e.g., file not found), return an empty array
      return [];
    }
  }

  // Write data to the file
  async write(notes) {
    await writeFileAsync('db/db.json', JSON.stringify(notes));
  }

  // Get all notes from the file
  async getNotes() {
    try {
      return await this.read();
    } catch (err) {
      // If there's an error, return an empty array
      return [];
    }
  }

  // Add a new note to the file
  async saveNote(note) {
    const { title, text } = note;

    // Check if title and text are not blank
    if (!title || !text) {
      throw new Error("Note 'title' and 'text' cannot be blank");
    }

    // Create a new note with a unique id using uuid package
    const newNote = { title, text, id: uuidv1() };

    // Get existing notes, add the new note, write the updated notes to the file
    const notes = await this.getNotes();
    const updatedNotes = [...notes, newNote];

    await this.write(updatedNotes);
    
    console.log("Note Added");

    // Return the newly added note
    return newNote;
  }

  // Remove a note by its id from the file
  async removeNote(id) {
    // Get existing notes, filter out the note with the given id, write the filtered notes to the file
    const notes = await this.getNotes();
    const filteredNotes = notes.filter((note) => note.id !== id);

    await this.write(filteredNotes);
  }
}

// Export the Store class
module.exports = Store;
