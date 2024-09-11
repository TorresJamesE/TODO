import { ToDoForm } from "./Form";
import { TodoItem } from "./TodoItem";
import { useState, useEffect } from "react";
import {
  ToDoAPISchema,
  ToDoGetAPIResponseSchema,
  type TodoItemT,
} from "../types/types";

export function TodoList() {
  const [todos, setTodos] = useState<TodoItemT[]>(() => {
    const itemsInStorage = localStorage.getItem("todoItems");

    if (!itemsInStorage) {
      return [];
    }
    const parsedItems = JSON.parse(itemsInStorage);

    return parsedItems;
  });

  useEffect(() => {
    async function getNotes(notesId: string | null | undefined) {
      const resp = await fetch(
        `${import.meta.env.VITE_NOTES_API_BASE_URL}/${notesId}`
      );

      const respBody = ToDoGetAPIResponseSchema.parse(await resp.json());
      setTodos(respBody.notes);
    }

    const notesId = localStorage.getItem("notesId");

    if (notesId) {
      getNotes(notesId);
    }
  }, []);

  function onTodoAdd(todoItem: TodoItemT) {
    return saveToDo(todoItem);
  }

  async function saveToDo(
    todoItem: TodoItemT,
    noteId?: string | null | undefined
  ) {
    const updatedTodos = { notes: [...todos, todoItem] };
    console.dir(updatedTodos);
    // TODO: Save the stuff. Kthx.
    const jsonPayload = JSON.stringify(updatedTodos);
    console.log(jsonPayload);

    const url = noteId
      ? `${import.meta.env.VITE_NOTES_API_BASE_URL}/${noteId}`
      : import.meta.env.VITE_NOTES_API_BASE_URL;
    const resp = await fetch(url, {
      method: "PUT",
      body: jsonPayload,
      headers: { "Content-Type": "application/json" },
    });

    const respJSON = await resp.json();
    console.log(respJSON);

    console.log(resp);
    const respBody = ToDoAPISchema.parse(respJSON);

    console.log(resp);
    console.log(respBody);
    if (respBody) {
      localStorage.setItem("notesId", respBody._id as string);
      return setTodos((prevTodos) => [...prevTodos, todoItem]);
    }
  }

  function removeToDoItem(idx: number) {
    setTodos((currentToDos) => {
      return currentToDos.filter((_, i) => i !== idx);
    });
  }

  function handleStateChange(idx: number, state: TodoItemT["state"]) {
    setTodos((prevToDos) => {
      const todos = [...prevToDos];
      todos[idx] = {
        ...todos[idx],
        state: state,
      };
      return todos;
    });
  }

  function handleInProgressItem(idx: number) {
    setTodos((currentToDos) => {
      const todos = [...currentToDos];
      const currentState = todos[idx].state;

      switch (currentState) {
        case "in progress":
          todos[idx] = {
            ...todos[idx],
            state: "incomplete",
          };
          break;
        case "incomplete":
        case "complete":
          todos[idx] = {
            ...todos[idx],
            state: "in progress",
          };
          break;
      }

      return todos;
    });
  }

  const listItems = todos
    .sort((a) => {
      return a.state === "in progress" ? -1 : 1;
    })
    .map((todo, index) => {
      return (
        <TodoItem
          onRemoveItem={() => removeToDoItem(index)}
          onStateChange={(state) => handleStateChange(index, state)}
          onClickItem={() => handleInProgressItem(index)}
          key={crypto.randomUUID()}
          item={todo}
        />
      );
    });

  return (
    <div className="container">
      <h1>TO-DO List</h1>
      <ToDoForm onTodoAdd={onTodoAdd}></ToDoForm>
      {listItems.length > 0 ? (
        <ul className="todo-list">{listItems}</ul>
      ) : (
        <p>Kinda lonely here...</p>
      )}
    </div>
  );
}

// - Update the todo app to set clicked items into a state of "in progress". Move "in progress" items to top of list.
// - Save todo in locally (in browser), when and how.
//  - Pull from browser locally.
//  - fetch
//  - useEffect
//  - save
// - Save todo in a database
