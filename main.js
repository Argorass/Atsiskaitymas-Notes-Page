document.addEventListener("DOMContentLoaded", () => {
  const noteForm = document.querySelector("#note-form");
  const noteTitleInput = document.querySelector("#note-title");
  const noteDescriptionInput = document.querySelector("#note-description");
  const notesContainer = document.querySelector("#notes-container");

  // Funkcija, kuri nuskaitys pastabas iš LocalStorage
  function getNotesFromLocalStorage() {
    const notesData = localStorage.getItem("notes");
    console.log("Įkeliami pastabos iš LocalStorage:", notesData);
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

  // Funkcija, kuri įkraus pastabas į puslapį
  function loadNotes() {
    const notes = getNotesFromLocalStorage();
    notesContainer.innerHTML = ""; // Išvalome esamus pastabas
    notes.forEach((note) => {
      createNoteElement(note);
    });
  }

  // Funkcija, kuri atnaujins LocalStorage su visomis pastabomis
  function updateLocalStorage(notes) {
    console.log("Atnaujinamos pastabos LocalStorage:", notes);
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (e) {
      console.error("Klaida saugojant pastabas:", e);
    }
  }

  // Funkcija, kuri sukuria pastabą DOM'e
  function createNoteElement(note) {
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card");
    if (note.completed) {
      noteCard.classList.add("completed"); // Jei pastaba atlikta, pridedame "completed" klasę
    }

    noteCard.innerHTML = `
            <h3 class="note-title">${note.title}</h3>
            <p class="note-description">${note.description}</p>
            <div class="note-actions">
                <button class="complete-btn">✓</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;

    // Susiejame mygtukus su funkcijomis
    const completeBtn = noteCard.querySelector(".complete-btn");
    const deleteBtn = noteCard.querySelector(".delete-btn");
    const noteDescription = noteCard.querySelector(".note-description");

    // Patikriname, ar mygtukai yra teisingai pasirinkti
    console.log(
      "Pridėjome mygtukus į pastabą:",
      completeBtn,
      deleteBtn,
      noteDescription
    );

    // Pritvirtiname įvykių klausytuvus
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
  }

  // Funkcija, kuri pažymi pastabą kaip atliktą arba ne
  function toggleNoteCompletion(note) {
    console.log("Pastaba pažymėta kaip atlikta:", note);
    const notes = getNotesFromLocalStorage();
    const updatedNotes = notes.map((n) => {
      if (n.title === note.title && n.description === note.description) {
        n.completed = !n.completed; // Pažymime kaip atliktą arba ne
      }
      return n;
    });

    updateLocalStorage(updatedNotes);
    loadNotes(); // Atnaujiname rodomas pastabas
  }

  // Funkcija, kuri ištrina pastabą
  function deleteNote(note) {
    console.log("Ištrinamos pastaba:", note);
    const notes = getNotesFromLocalStorage();
    const filteredNotes = notes.filter(
      (n) => n.title !== note.title || n.description !== note.description
    );
    updateLocalStorage(filteredNotes);
    loadNotes();
  }

  // Funkcija, kuri išsaugo naują pastabą
  function saveNote() {
    const title = noteTitleInput.value;
    const description = noteDescriptionInput.value;

    // Patikrinimas, ar yra užpildyti visi laukeliai
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

  // Formos pateikimo klausytuvo funkcija
  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveNote();
  });

  // Puslapio užkrovimas ir pastabų atvaizdavimas
  loadNotes();
});
