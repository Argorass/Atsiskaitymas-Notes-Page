document.addEventListener("DOMContentLoaded", () => {
  const noteForm = document.querySelector("#note-form");
  const noteTitleInput = document.querySelector("#note-title");
  const noteDescriptionInput = document.querySelector("#note-description");
  const notesContainer = document.querySelector("#notes-container");

  // Patikrinimas prieš bandant atlikti JSON.parse()
  function getNotesFromLocalStorage() {
    const notesData = localStorage.getItem("notes");

    if (!notesData) {
      return [];
    }

    try {
      return JSON.parse(notesData);
    } catch (e) {
      console.error("Klaida įkeliant pastabas:", e);
      return [];
    }
  }

  // Load notes from localStorage
  function loadNotes() {
    const notes = getNotesFromLocalStorage();
    notesContainer.innerHTML = ""; // Išvalome esamus elementus
    notes.forEach((note) => {
      createNoteElement(note);
    });
  }

  // Atnaujiname localStorage su visomis pastabomis
  function updateLocalStorage(notes) {
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (e) {
      console.error("Klaida saugojant pastabas:", e);
    }
  }

  // Sukuriame pastabą (note) DOM elementą
  function createNoteElement(note) {
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card");
    if (note.completed) {
      noteCard.classList.add("completed");
    }

    noteCard.innerHTML = `
            <h3 class="note-title">${note.title}</h3>
            <p class="note-description">${note.description}</p>
            <div class="note-actions">
                <button class="complete-btn">✓</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;

    // Pridedame įvykių klausytuvus mygtukams
    const completeBtn = noteCard.querySelector(".complete-btn");
    const deleteBtn = noteCard.querySelector(".delete-btn");
    const noteDescription = noteCard.querySelector(".note-description");

    completeBtn.addEventListener("click", () => toggleNoteCompletion(note));
    deleteBtn.addEventListener("click", () => deleteNote(note));
    noteDescription.addEventListener("click", () => toggleNoteCompletion(note));

    notesContainer.appendChild(noteCard);
  }

  // Toggle note completion (strike-through)
  function toggleNoteCompletion(note) {
    const notes = getNotesFromLocalStorage();
    const updatedNotes = notes.map((n) => {
      if (n === note) {
        n.completed = !n.completed; // Pažymime kaip atliktą arba ne
      }
      return n;
    });

    updateLocalStorage(updatedNotes);
    loadNotes(); // Atnaujiname rodomas pastabas
  }

  // Ištrinti pastabą
  function deleteNote(note) {
    const notes = getNotesFromLocalStorage();
    const filteredNotes = notes.filter((n) => n !== note);
    updateLocalStorage(filteredNotes);
    loadNotes();
  }

  // Išsaugome naują pastabą
  function saveNote() {
    const title = noteTitleInput.value;
    const description = noteDescriptionInput.value;

    if (!title || !description) {
      alert("Prašome užpildyti visus laukus");
      return;
    }

    const notes = getNotesFromLocalStorage();

    const newNote = {
      title,
      description,
      completed: false,
    };

    notes.push(newNote);
    updateLocalStorage(notes);

    noteTitleInput.value = ""; // Išvalome formos laukus
    noteDescriptionInput.value = "";
    loadNotes(); // Atnaujiname rodomas pastabas
  }

  // Formos pateikimas ir naujos pastabos kūrimas
  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveNote();
  });

  // Puslapio užkrovimas ir pastabų atvaizdavimas
  loadNotes();
});
