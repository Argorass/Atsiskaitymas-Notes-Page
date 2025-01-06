document.addEventListener("DOMContentLoaded", () => {
  const noteForm = document.querySelector("#note-form"),
    noteTitleInput = document.querySelector("#note-title"),
    noteDescriptionInput = document.querySelector("#note-description"),
    notesContainer = document.querySelector("#notes-container");

  const getNotesFromLocalStorage = () => {
    const notesData = localStorage.getItem("notes");
    try {
      console.log("Įkeliami pastabos iš LocalStorage:", notesData);
      return notesData ? JSON.parse(notesData) : [];
    } catch (e) {
      console.error("Klaida įkeliant pastabas:", e);
      return [];
    }
  };

  const updateLocalStorage = (notes) => {
    try {
      console.log("Atnaujinamos pastabos LocalStorage:", notes);
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (e) {
      console.error("Klaida saugojant pastabas:", e);
    }
  };

  const loadNotes = () => {
    const notes = getNotesFromLocalStorage().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    notesContainer.innerHTML = "";
    notes.forEach(createNoteElement);
  };

  const createNoteElement = (note) => {
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card", note.completed && "completed");
    noteCard.innerHTML = `
        <h3 class="note-title">${note.title}</h3>
        <p class="note-description">${note.description}</p>
        <div class="note-actions">
          <button class="complete-btn">✓</button>
          <button class="delete-btn">🗑️</button>
        </div>`;

    const completeBtn = noteCard.querySelector(".complete-btn"),
      deleteBtn = noteCard.querySelector(".delete-btn"),
      noteDescription = noteCard.querySelector(".note-description");

    console.log(
      "Pridėjome mygtukus į pastabą:",
      completeBtn,
      deleteBtn,
      noteDescription
    );

    completeBtn.addEventListener("click", () => {
      console.log("Paspausta ant ✓ mygtuko");
      toggleNoteCompletion(note);
    });
    deleteBtn.addEventListener("click", () => {
      console.log("Paspausta ant šiukšliadėžės mygtuko");
      deleteNote(note);
    });
    noteDescription.addEventListener("click", () => {
      console.log("Paspausta ant aprašymo");
      toggleNoteCompletion(note);
    });

    notesContainer.appendChild(noteCard);
  };

  const toggleNoteCompletion = (note) => {
    console.log("Pastaba pažymėta kaip atlikta:", note);
    const notes = getNotesFromLocalStorage().map((n) =>
      n.title === note.title && n.description === note.description
        ? { ...n, completed: !n.completed }
        : n
    );
    updateLocalStorage(notes);
    loadNotes();
  };

  const deleteNote = (note) => {
    console.log("Ištrinamos pastaba:", note);
    const filteredNotes = getNotesFromLocalStorage().filter(
      (n) => n.title !== note.title || n.description !== note.description
    );
    updateLocalStorage(filteredNotes);
    loadNotes();
  };

  const saveNote = () => {
    const title = noteTitleInput.value,
      description = noteDescriptionInput.value;
    if (!title || !description) return alert("Prašome užpildyti visus laukus");

    const notes = getNotesFromLocalStorage();
    const newNote = {
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    console.log("Pridedama nauja pastaba:", newNote);
    notes.push(newNote);
    updateLocalStorage(notes);

    noteTitleInput.value = noteDescriptionInput.value = "";
    loadNotes();
  };

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveNote();
  });

  loadNotes();
});
