import "./Todos.css";
import { useState } from "react";

interface TodosProps {
  currentDay: number;
  currentMonth: number;
  currentYear: number;
  daysOfMonth: number[];
}

type TodoType = {
  done: boolean;
  text: string;
  priority: string;
};
type TodosType = {
  month: number;
  year: number;
  day: number;
  todos: TodoType[];
};

export const Todos: React.FC<TodosProps> = ({
  currentDay,
  daysOfMonth,
  currentMonth,
  currentYear,
}) => {
  const [todos, setTodos] = useState<TodosType[]>(
    daysOfMonth.map((day) => ({
      day,
      month: currentMonth,
      year: currentYear,
      todos: [],
    }))
  );
  const [todo, setTodo] = useState<TodoType>();
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [editedText, setEditedText] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const handleDoneTodo = (t: TodoType) => {
    let [newTodos] = todos.filter(
      (todo) =>
        todo.day === currentDay &&
        todo.month === currentMonth &&
        todo.year === currentYear
    );
    let [doneTodo] = newTodos.todos.filter((todo) => todo.text === t.text);
    if (!doneTodo.done) {
      doneTodo.done = true;
      newTodos.todos = newTodos.todos.map((todo) =>
        todo.text === t.text ? doneTodo : todo
      );
      setTodos(
        todos.map((todo) =>
          currentDay === todo.day &&
          todo.month === currentMonth &&
          todo.year === currentYear
            ? newTodos
            : todo
        )
      );
    } else {
      doneTodo.done = false;
      newTodos.todos = newTodos.todos.map((todo) =>
        todo.text === t.text ? doneTodo : todo
      );
      setTodos(
        todos.map((todo) =>
          currentDay === todo.day &&
          todo.month === currentMonth &&
          todo.year === currentYear
            ? newTodos
            : todo
        )
      );
    }
  };

  const handleDelete = (t: TodoType) => {
    let [newTodos] = todos.filter(
      (todo) =>
        todo.day === currentDay &&
        todo.month === currentMonth &&
        todo.year === currentYear
    );
    newTodos.todos = newTodos.todos.filter((todo) => todo.text !== t.text);
    setTodos(
      todos.map((todo) =>
        todo.day === currentDay &&
        todo.month === currentMonth &&
        todo.year === currentYear
          ? newTodos
          : todo
      )
    );
  };

  const handleAddTodo = () => {
    if (value !== "") {
      let [newTodos]: TodosType[] | undefined = todos.filter(
        (todo) =>
          todo.day === currentDay &&
          todo.month === currentMonth &&
          todo.year === currentYear
      );
      if (
        newTodos &&
        !newTodos.todos.filter((todo) => todo.text === value)[0]
      ) {
        newTodos.todos.push({
          done: false,
          text: value,
          priority: "None",
        });
        setError("");
        setValue("");
        setTodos(
          todos.map((todo) =>
            currentDay === todo.day &&
            todo.month === currentMonth &&
            todo.year === currentYear
              ? newTodos
              : todo
          )
        );
      } else if (newTodos) {
        setError("You can't have two same tasks");
      } else {
        newTodos = {
          day: currentDay,
          month: currentMonth,
          year: currentYear,
          todos: [
            {
              done: false,
              text: value,
              priority: "None",
            },
          ],
        };
        setTodos([...todos, newTodos]);
      }
    }
  };

  const handleEdit = (t: TodoType) => {
    setShowModal(false);
    let [newTodos]: TodosType[] | undefined = todos.filter(
      (todo) =>
        todo.day === currentDay &&
        todo.month === currentMonth &&
        todo.year === currentYear
    );

    let [editedTodo] = newTodos.todos.filter((todo) => todo.text === t.text);
    editedTodo.text = editedText;
    newTodos.todos = newTodos.todos.map((todo) =>
      editedText === t.text ? editedTodo : todo
    );
    setTodos(
      todos.map((todo) =>
        currentDay === todo.day &&
        todo.month === currentMonth &&
        todo.year === currentYear
          ? newTodos
          : todo
      )
    );
  };

  const handleChangePriority = (p: string, t: TodoType) => {
    let [newTodos]: TodosType[] | undefined = todos.filter(
      (todo) =>
        todo.day === currentDay &&
        todo.month === currentMonth &&
        todo.year === currentYear
    );

    let [editedTodo] = newTodos.todos.filter((todo) => todo.text === t.text);
    editedTodo.priority = p;
    newTodos.todos = newTodos.todos.map((todo) =>
      t.text === todo.text ? editedTodo : todo
    );
    setTodos(
      todos.map((todo) =>
        currentDay === todo.day &&
        todo.month === currentMonth &&
        todo.year === currentYear
          ? newTodos
          : todo
      )
    );

  }

  return (
    <div className="todos">
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                todo && handleEdit(todo);
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

      <h2>Todos</h2>
      {todos.map((todo) =>
        todo.day === currentDay
          ? todo.todos.map(
              (t) =>
                todo.day === currentDay &&
                todo.month === currentMonth &&
                todo.year === currentYear && (
                  <div className="todo">
                    <span
                      onClick={() => handleDoneTodo(t)}
                      className={
                        t.priority === "A"
                          ? "circle a-priority"
                          : t.priority === "B"
                          ? "circle b-priority"
                          : t.priority === "C"
                          ? "circle c-priority"
                          : "circle"
                      }
                    >
                      {t.done && <>✓</>}
                    </span>
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
                        setTodo(t);
                        setEditedText(t.text);
                      }}
                    >
                      ✎
                    </button>
                    <button className="button" onClick={() => handleChangePriority("A", t)}>A</button>
                    <button className="button" onClick={() => handleChangePriority("B", t)}>B</button>
                    <button className="button" onClick={() => handleChangePriority("C", t)}>C</button>
                    <button className="button" onClick={() => handleChangePriority("None", t)}>⚐</button>
                  </div>
                )
            )
          : null
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTodo();
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={"Add todo..."}
        />
        <button type="submit">+</button>
      </form>
      {error}
    </div>
  );
};
