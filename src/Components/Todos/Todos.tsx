import "./Todos.css";
import { useState } from "react";

interface TodosProps {
  currentDay: number;
  daysOfMonth: number[];
}

type TodoType = {
  done: boolean;
  text: string;
};
type TodosType = {
  day: number;
  todos: TodoType[];
};

export const Todos: React.FC<TodosProps> = ({ currentDay, daysOfMonth }) => {
  const [todos, setTodos] = useState<TodosType[]>(
    daysOfMonth.map((day) => ({ day, todos: [] }))
  );
  const [value, setValue] = useState<string>("");

  return (
    <div className="todos">
      {todos.map((todo) =>
        todo.day === currentDay
          ? todo.todos.map((t) => (
              <div
                className="todo"
                onClick={() => {
                  let [newTodos] = todos.filter(
                    (todo) => todo.day === currentDay
                  );
                  let [doneTodo] = newTodos.todos.filter(
                    (todo) => todo.text === t.text
                  );
                  if (!doneTodo.done) {
                    doneTodo.done = true;
                    newTodos.todos = newTodos.todos.map((todo) =>
                      todo.text === t.text ? doneTodo : todo
                    );
                    setTodos(
                      todos.map((todo) =>
                        currentDay === todo.day ? newTodos : todo
                      )
                    );
                  } else {
                    doneTodo.done = false;
                    newTodos.todos = newTodos.todos.map((todo) =>
                      todo.text === t.text ? doneTodo : todo
                    );
                    setTodos(
                      todos.map((todo) =>
                        currentDay === todo.day ? newTodos : todo
                      )
                    );
                  }
                }}
              >
                <span className={t.done ? "done circle " : "circle"}></span>
                <div className={t.done ? "done" : ""}>{t.text}</div>
                <button
                  className="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    let [newTodos] = todos.filter(
                      (todo) => todo.day === currentDay
                    );
                    newTodos.todos = newTodos.todos.filter(
                      (todo) => todo.text !== t.text
                    );
                    setTodos(
                      todos.map((todo) =>
                        todo.day === currentDay ? newTodos : todo
                      )
                    );
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          : null
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value !== "") {
            let [newTodos] = todos.filter((todo) => todo.day === currentDay);
            newTodos.todos.push({ done: false, text: value });
            setValue("");
          }
        }}
      >
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit">Add todo</button>
      </form>
    </div>
  );
};
