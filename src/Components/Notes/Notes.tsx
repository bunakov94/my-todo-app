import "./Notes.css";
import { useState } from "react";

interface NotesProps {
  currentDay: number;
  currentMonth: number;
  currentYear: number;
  daysOfMonth: number[];
}

type NoteType = {
  done: boolean;
  text: string;
  priority: string;
};
type NotesType = {
  month: number;
  year: number;
  day: number;
  notes: NoteType[];
};

export const Notes: React.FC<NotesProps> = ({
  currentDay,
  daysOfMonth,
  currentMonth,
  currentYear,
}) => {
  const [notes, setNotes] = useState<NotesType[]>(
    daysOfMonth.map((day) => ({
      day,
      month: currentMonth,
      year: currentYear,
      notes: [],
    }))
  );
  const [globalNotes, setGlobalNotes] = useState<string[]>([]);
  const [globalNoteValue, setGlobalNoteValue] = useState<string>("");
  const [globalNote, setGlobalNote] = useState<string>("");
  const [note, setNote] = useState<NoteType>();
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [editedText, setEditedText] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (t: NoteType) => {
    let [newNotes] = notes.filter(
      (note) =>
        note.day === currentDay &&
        note.month === currentMonth &&
        note.year === currentYear
    );
    newNotes.notes = newNotes.notes.filter((note) => note.text !== t.text);
    setNotes(
      notes.map((note) =>
        note.day === currentDay &&
        note.month === currentMonth &&
        note.year === currentYear
          ? newNotes
          : note
      )
    );
  };

  const handleAddNote = () => {
    if (value !== "") {
      let [newNotes]: NotesType[] | undefined = notes.filter(
        (note) =>
          note.day === currentDay &&
          note.month === currentMonth &&
          note.year === currentYear
      );
      if (
        newNotes &&
        !newNotes.notes.filter((note) => note.text === value)[0]
      ) {
        newNotes.notes.push({
          done: false,
          text: value,
          priority: "None",
        });
        setError("");
        setValue("");
        setNotes(
          notes.map((note) =>
            currentDay === note.day &&
            note.month === currentMonth &&
            note.year === currentYear
              ? newNotes
              : note
          )
        );
      } else if (newNotes) {
        setError("You can't have two same tasks");
      } else {
        newNotes = {
          day: currentDay,
          month: currentMonth,
          year: currentYear,
          notes: [
            {
              done: false,
              text: value,
              priority: "None",
            },
          ],
        };
        setNotes([...notes, newNotes]);
      }
    }
  };

  const handleAddGlobalNote = () => {
    setGlobalNotes([...globalNotes, globalNoteValue]);
    setGlobalNoteValue("");
  };

  const handleEdit = (t: NoteType) => {
    setShowModal(false);
    let [newNotes]: NotesType[] | undefined = notes.filter(
      (note) =>
        note.day === currentDay &&
        note.month === currentMonth &&
        note.year === currentYear
    );

    let [editedNote] = newNotes.notes.filter((note) => note.text === t.text);
    editedNote.text = editedText;
    newNotes.notes = newNotes.notes.map((note) =>
      editedText === t.text ? editedNote : note
    );
    setNotes(
      notes.map((note) =>
        currentDay === note.day &&
        note.month === currentMonth &&
        note.year === currentYear
          ? newNotes
          : note
      )
    );
    setNote(undefined);
  };

  const handleGlobalNoteEdit = () => {
    setShowModal(false);
    setGlobalNotes(
      globalNotes.map((note) =>
        note === globalNote && !globalNotes.includes(globalNote)
          ? editedText
          : note
      )
    );
    setGlobalNote("");
  };

  const handleDeleteGlobalNote = (note: string) => {
    setGlobalNotes(globalNotes.filter((n) => n !== note));
  };

  return (
    <div className="notes">
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                note && handleEdit(note);
                globalNote && handleGlobalNoteEdit();
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

      <h2>Notes</h2>
      {notes.map((note) =>
        note.day === currentDay
          ? note.notes.map(
              (t) =>
                note.day === currentDay &&
                note.month === currentMonth &&
                note.year === currentYear && (
                  <div className="note">
                    <span className="circle">●</span>
                    <div className={t.done ? "done" : ""}>{t.text}</div>
                    <button
                      style={{ fontSize: "15px" }}
                      className="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(t);
                      }}
                    >
                      ╳
                    </button>
                    <button
                      className="button"
                      onClick={() => {
                        setShowModal(true);
                        setNote(t);
                        setEditedText(t.text);
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
          handleAddNote();
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={"Add note..."}
        />
        <button type="submit">+</button>
      </form>
      {error}

      <h2>Global Notes</h2>
      <div>
        {globalNotes.map((note) => (
          <div className="note">
            <span className="circle">●</span>
            <div>{note}</div>
            <button
              style={{ fontSize: "15px" }}
              className="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteGlobalNote(note);
              }}
            >
              ╳
            </button>
            <button
              className="button"
              onClick={() => {
                setShowModal(true);
                setGlobalNote(note);
                setEditedText(note);
              }}
            >
              ✎
            </button>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddGlobalNote();
        }}
      >
        <input
          value={globalNoteValue}
          onChange={(e) => setGlobalNoteValue(e.target.value)}
          placeholder={"Add note..."}
        />
        <button type="submit">+</button>
      </form>
    </div>
  );
};
