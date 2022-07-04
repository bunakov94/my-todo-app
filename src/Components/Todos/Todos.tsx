import "./Todos.css";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

interface TodosProps {
  currentDay: number;
  currentMonth: number;
  currentYear: number;
}

type TodoType = {
  done: boolean;
  text: string;
  priority: string;
  id: string;
};

type TodosType = {
  month: number;
  year: number;
  day: number;
  todos: TodoType[];
  id: string;
};

export const Todos: React.FC<TodosProps> = ({
  currentDay,
  currentMonth,
  currentYear,
}) => {
  const [allTodos, setAllTodos] = useState<TodosType[]>([]);
  const [value, setValue] = useState<string>("");
  const [editedText, setEditedText] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [todoWasDeleted, setTodoWasDeleted] = useState(false);
  const [priorityWasChanged, setPriorityWasChanged] = useState(false);
  const [todoWasDone, setTodoWasDone] = useState(false);
  const [todoWasUpdated, setTodoWasUpdated] = useState(false);
  const [todoWasAdded, setTodoWasAdded] = useState(false);
  const [ids, setIds] = useState<any>({});
  const [priority, setPriority] = useState<string>("None");
  const todosCollectionRef = collection(db, "all-todos");

  const getTodos = async () => {
    const data = await getDocs(todosCollectionRef);
    console.log(data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id })));
    setAllTodos(data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id })));
    console.log(allTodos);
  };

  const handleDeleteTodo = async () => {
    const todo = await doc(db, "all-todos", ids.dateId);
    const newFields = {
      todos: allTodos
        .filter((t: any) => t.id === ids.dateId)[0]
        .todos.filter((td: any) => td.id !== ids.todoId),
    };
    await updateDoc(todo, newFields);
    ids({});
    setTodoWasDeleted(false);
  };

  const handleAddTodo = async () => {
    let [todaysTodos] = allTodos.filter(
      (todo) =>
        todo.day === currentDay &&
        todo.month === currentMonth &&
        todo.year === currentYear
    );
    if (!todaysTodos) {
      //@ts-ignore
      todaysTodos = {
        day: currentDay,
        month: currentMonth,
        year: currentYear,
        todos: [
          {
            text: value,
            id: Date.now().toString(),
            priority: "None",
            done: false,
          },
        ],
      };
      await addDoc(todosCollectionRef, todaysTodos);
      setTodoWasAdded(false);
      setValue("");
    } else {
      const todo = await doc(db, "all-todos", todaysTodos.id);
      todaysTodos.todos.push({
        text: value,
        id: Date.now().toString(),
        priority: "None",
        done: false,
      });
      const newFields = {
        todos: todaysTodos.todos,
      };
      await updateDoc(todo, newFields);
      setTodoWasAdded(false);
      setValue("");
    }
  };

  const handleUpdateTodo = async () => {
    setShowModal(false)
    const todo = await doc(db, "all-todos", ids.dateId);
    const [changedTodo] = allTodos
      .filter((t: any) => t.id === ids.dateId)[0]
      .todos.filter((td) => td.id === ids.todoId);
    changedTodo.text = editedText
    let todos = allTodos
    .filter((t: any) => t.id === ids.dateId)[0]
    .todos
    todos = todos.map(todo => todo.id === changedTodo.id ? changedTodo : todo)
    await updateDoc(todo, {todos})
    setTodoWasUpdated(false)
  };

  const handleDoneTodo = async () => {
    const todo = await doc(db, "all-todos", ids.dateId);
    const [doneTodo] = allTodos
      .filter((t: any) => t.id === ids.dateId)[0]
      .todos.filter((td) => td.id === ids.todoId);
    doneTodo.done = true
    let todos = allTodos
    .filter((t: any) => t.id === ids.dateId)[0]
    .todos
    todos = todos.map(todo => todo.id === doneTodo.id ? doneTodo : todo)
    await updateDoc(todo, {todos})
    setTodoWasDone(false)
  };

  const handleChangePriority = async (priority: string) => {
    const todo = await doc(db, "all-todos", ids.dateId);
    const [changedTodo] = allTodos
      .filter((t: any) => t.id === ids.dateId)[0]
      .todos.filter((td) => td.id === ids.todoId);
    changedTodo.priority = priority
    let todos = allTodos
    .filter((t: any) => t.id === ids.dateId)[0]
    .todos
    todos = todos.map(todo => todo.id === changedTodo.id ? changedTodo : todo)
    await updateDoc(todo, {todos})
    setPriorityWasChanged(false)
  };

  useEffect(() => {
    console.log(allTodos);
    if (todoWasAdded) {
      handleAddTodo();
    } else if (todoWasDeleted) {
      handleDeleteTodo();
    } else if (todoWasUpdated) {
      handleUpdateTodo();
    } else if (priorityWasChanged) {
      handleChangePriority(priority);
    } else if (todoWasDone) {
      handleDoneTodo();
    }
    getTodos();
  }, [
    todoWasAdded,
    todoWasDeleted,
    todoWasUpdated,
    priorityWasChanged,
    todoWasDone,
  ]);
  debugger;
  return (
    <div className="todos">
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTodoWasUpdated(true);
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

      {allTodos.map((todaysTodos) =>
        todaysTodos &&
        todaysTodos.day === currentDay &&
        todaysTodos.todos &&
        todaysTodos.todos !== []
          ? todaysTodos?.todos?.map(
              (todo) =>
                todaysTodos.day === currentDay &&
                todaysTodos.month === currentMonth &&
                todaysTodos.year === currentYear && (
                  <div className="todo">
                    <span
                      onClick={() => {
                        setTodoWasDone(true);
                        setIds({ dateId: todaysTodos.id, todoId: todo.id });
                      }}
                      className={
                        todo.priority === "A"
                          ? "circle a-priority"
                          : todo.priority === "B"
                          ? "circle b-priority"
                          : todo.priority === "C"
                          ? "circle c-priority"
                          : "circle"
                      }
                    >
                      {todo.done && <>✓</>}
                    </span>
                    <div className={todo.done ? "done" : ""}>{todo.text}</div>
                    <button
                      style={{ fontSize: "15px" }}
                      className="button"
                      onClick={(e) => {
                        setIds({ dateId: todaysTodos.id, todoId: todo.id });
                        e.stopPropagation();
                        setTodoWasDeleted(true);
                      }}
                    >
                      ╳
                    </button>
                    <button
                      className="button"
                      onClick={() => {
                        setShowModal(true);
                        setEditedText(todo.text);
                        setIds({ dateId: todaysTodos.id, todoId: todo.id });
                      }}
                    >
                      ✎
                    </button>
                    <button
                      className="button"
                      onClick={() => {
                        setIds({ dateId: todaysTodos.id, todoId: todo.id });
                        setPriority("A");
                        setPriorityWasChanged(true);

                      }}
                    >
                      A
                    </button>
                    <button
                      className="button"
                      onClick={() => {
                        setIds({ dateId: todaysTodos.id, todoId: todo.id });
                        setPriority("B");
                        setPriorityWasChanged(true);

                      }}
                    >
                      B
                    </button>
                    <button
                      className="button"
                      onClick={() => {
                        setIds({ dateId: todaysTodos.id, todoId: todo.id });
                        setPriority("C");
                        setPriorityWasChanged(true);

                      }}
                    >
                      C
                    </button>
                    <button
                      className="button"
                      onClick={() => {
                        setIds({ dateId: todaysTodos.id, todoId: todo.id });
                        setPriorityWasChanged(true);
                        setPriority("None");
                      }}
                    >
                      ⚐
                    </button>
                  </div>
                )
            )
          : null
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTodoWasAdded(true);
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={"Add todo..."}
        />
        <button type="submit">+</button>
      </form>
    </div>
  );
};
