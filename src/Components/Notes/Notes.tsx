import "./Notes.css";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

interface NotesProps {
  currentDay: number;
  currentMonth: number;
  currentYear: number;
}

type NoteType = {
  text: string;
  id: string;
};

type NotesType = {
  month: number;
  year: number;
  day: number;
  notes: NoteType[];
  id: string;
};

export const Notes: React.FC<NotesProps> = ({
  currentDay,
  currentMonth,
  currentYear,
}) => {
  const [globalNotes, setGlobalNotes] = useState<any>([]);
  const [allNotes, setAllNotes] = useState<NotesType[]>([]);
  const [value, setValue] = useState<string>("");
  const [globalValue, setGlobalValue] = useState<string>("");
  const [editedText, setEditedText] = useState<string>("");
  const [globalEditedText, setGlobalEditedText] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [noteWasDeleted, setNoteWasDeleted] = useState(false);
  const [noteWasUpdated, setNoteWasUpdated] = useState(false);
  const [noteWasAdded, setNoteWasAdded] = useState(false);
  const [globalNoteWasDeleted, setGlobalNoteWasDeleted] = useState(false);
  const [globalNoteWasUpdated, setGlobalNoteWasUpdated] = useState(false);
  const [globalNoteWasAdded, setGlobalNoteWasAdded] = useState(false);
  const [ids, setIds] = useState<any>({});
  const notesCollectionRef = collection(db, "all-notes");
  const globalNotesCollectionRef = collection(db, "global-notes");

  const getNotes = async () => {
    const data = await getDocs(notesCollectionRef);
    setAllNotes(data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id })));
  };

  const getGlobalNotes = async () => {
    const data = await getDocs(globalNotesCollectionRef);
    setGlobalNotes(
      data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
    );
  };

  const handleDeleteNote = async () => {
    const note = await doc(db, "all-notes", ids.dateId);
    const newFields = {
      notes: allNotes
        .filter((t: any) => t.id === ids.dateId)[0]
        .notes.filter((td: any) => td.id !== ids.noteId),
    };
    await updateDoc(note, newFields);
    setIds({});
    setNoteWasDeleted(false);
  };

  const handleAddNote = async () => {
    let [todaysNotes] = allNotes.filter(
      (note) =>
        note.day === currentDay &&
        note.month === currentMonth &&
        note.year === currentYear
    );
    if (!todaysNotes) {
      //@ts-ignore
      todaysNotes = {
        day: currentDay,
        month: currentMonth,
        year: currentYear,
        notes: [
          {
            text: value,
            id: Date.now().toString(),
          },
        ],
      };
      await addDoc(notesCollectionRef, todaysNotes);
      setNoteWasAdded(false);
      setValue("");
    } else {
      const note = await doc(db, "all-notes", todaysNotes.id);
      todaysNotes.notes.push({
        text: value,
        id: Date.now().toString(),
      });
      const newFields = {
        notes: todaysNotes.notes,
      };
      await updateDoc(note, newFields);
      setNoteWasAdded(false);
      setValue("");
    }
  };

  const handleUpdateNote = async () => {
    setShowModal(false);
    const note = await doc(db, "all-notes", ids.dateId);
    const [changedNote] = allNotes
      .filter((t: any) => t.id === ids.dateId)[0]
      .notes.filter((td) => td.id === ids.noteId);
    changedNote.text = editedText;
    let notes = allNotes.filter((t: any) => t.id === ids.dateId)[0].notes;
    notes = notes.map((note) =>
      note.id === changedNote.id ? changedNote : note
    );
    await updateDoc(note, { notes });
    setNoteWasUpdated(false);
  };

  const handleGlobalDeleteNote = async () => {
    const note = await doc(db, "global-notes", ids.id);
    await deleteDoc(note);
    setIds({});
    setGlobalNoteWasDeleted(false);
  };

  const handleGlobalAddNote = async () => {
    await addDoc(globalNotesCollectionRef, {
      id: Date.now().toString(),
      note: globalValue,
    });
    setGlobalNoteWasAdded(false);
    setGlobalValue("");
  };

  const handleGlobalUpdateNote = async () => {
    setShowModal(false);
    const note = await doc(db, "global-notes", ids.id);
    await updateDoc(note, { note: globalEditedText });
    setGlobalNoteWasUpdated(false);
  };

  useEffect(() => {
    if (noteWasAdded) {
      handleAddNote();
    } else if (noteWasDeleted) {
      handleDeleteNote();
    } else if (noteWasUpdated) {
      handleUpdateNote();
    } else if (globalNoteWasAdded) {
      handleGlobalAddNote();
    } else if (globalNoteWasDeleted) {
      handleGlobalDeleteNote();
    } else if (globalNoteWasUpdated) {
      handleGlobalUpdateNote();
    }

    getNotes();
    getGlobalNotes();
  }, [
    noteWasAdded,
    noteWasDeleted,
    noteWasUpdated,
    globalNoteWasAdded,
    globalNoteWasDeleted,
    globalNoteWasUpdated,
  ]);
  return (
    <div className="notes">
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNoteWasUpdated(true);
              }}
            >
              <input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <button type="submit" style={{ width: "60px", fontSize: "15px" }}>
                Edit
              </button>
            </form>
          </div>
        </div>
      )}

      <h3>Notes</h3>

      {allNotes.map((todaysNotes) =>
        todaysNotes &&
        todaysNotes.day === currentDay &&
        todaysNotes.notes &&
        todaysNotes.notes !== []
          ? todaysNotes?.notes?.map(
              (note) =>
                todaysNotes.day === currentDay &&
                todaysNotes.month === currentMonth &&
                todaysNotes.year === currentYear && (
                  <div className="note">
                    <span className="circle">
                    <strong>-</strong>
                    </span>
                    <div>{note.text}</div>
                    <button
                      style={{ fontSize: "15px" }}
                      className="button"
                      onClick={(e) => {
                        setIds({ dateId: todaysNotes.id, noteId: note.id });
                        e.stopPropagation();
                        setNoteWasDeleted(true);
                      }}
                    >
                      ╳
                    </button>
                    <button
                      className="button"
                      onClick={() => {
                        setShowModal(true);
                        setEditedText(note.text);
                        setIds({ dateId: todaysNotes.id, noteId: note.id });
                      }}
                    >
                      ✎
                    </button>
                  </div>
                )
            )
          : null
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setNoteWasAdded(true);
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={"Add note..."}
        />
        <button type="submit">+</button>
      </form>

      <h3>Global Notes</h3>

      {globalNotes.map((note: any) => (
        <div className="note">
          <span className="circle">
            <strong>-</strong>
          </span>
          <div>{note.note}</div>
          <button
            style={{ fontSize: "15px" }}
            className="button"
            onClick={(e) => {
              setIds({ id: note.id });
              e.stopPropagation();
              setGlobalNoteWasDeleted(true);
            }}
          >
            ╳
          </button>
          <button
            className="button"
            onClick={() => {
              setShowModal(true);
              setGlobalEditedText(note.note);
              setIds({ id: note.id });
            }}
          >
            ✎
          </button>
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setGlobalNoteWasAdded(true);
        }}
      >
        <input
          value={globalValue}
          onChange={(e) => setGlobalValue(e.target.value)}
          placeholder={"Add note..."}
        />
        <button type="submit">+</button>
      </form>
    </div>
  );
};
