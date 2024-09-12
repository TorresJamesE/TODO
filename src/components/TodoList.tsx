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
      const apiUrlGet = notesId
        ? `${import.meta.env.VITE_NOTES_API_BASE_URL}/${notesId}`
        : import.meta.env.VITE_NOTES_API_BASE_URL;

      const resp = await fetch(apiUrlGet);

      const respJson = await resp.json();
      try {
        ToDoGetAPIResponseSchema.parse(respJson);
      } catch (error) {
        console.log(error);
      }

      setTodos(respJson.notes);
    }

    const notesId = localStorage.getItem("notesId");

    if (notesId) {
      getNotes(notesId);
    }
  }, []);

  function onTodoAdd(todoItem: TodoItemT) {
    return saveToDo(todoItem);
  }

  async function saveToDo(todoItem: TodoItemT) {
    const updatedTodos = [...todos, todoItem];
    const respJSON = await saveToAPI(updatedTodos);

    // TODO: Add some user indication that the request failed.
    // TODO: Graceful degradation if server is down!
    if (respJSON && !localStorage.getItem("notesId")) {
      localStorage.setItem("notesId", respJSON.id);
      return setTodos((prevTodos) => [...prevTodos, todoItem]);
    }
  }

  function removeToDoItem(idx: number) {
    setTodos((currentToDos) => {
      const updatedToDos = currentToDos.filter((_, i) => i !== idx);
      saveToAPI(updatedToDos);
      return updatedToDos;
    });
  }

  function handleStateChange(idx: number, state: TodoItemT["state"]) {
    setTodos((prevToDos) => {
      const todos = [...prevToDos];
      todos[idx] = {
        ...todos[idx],
        state: state,
      };

      saveToAPI(todos);
      return todos;
    });
  }

  /**
   * Saves notes via API.
   *
   * @param todos TodoItemT[]
   * @returns ToDoAPIPutResponseT
   */
  async function saveToAPI(todos: TodoItemT[]) {
    const notesId = localStorage.getItem("notesId");
    const jsonPayload = JSON.stringify({ notes: todos });
    console.log(jsonPayload);

    const url = notesId
      ? `${import.meta.env.VITE_NOTES_API_BASE_URL}/${notesId}`
      : import.meta.env.VITE_NOTES_API_BASE_URL;

    const resp = await fetch(url, {
      method: "PUT",
      body: jsonPayload,
      headers: { "Content-Type": "application/json" },
    });

    const respJSON = await resp.json();
    console.log(respJSON);
    const { success, data, error } = ToDoAPISchema.safeParse(respJSON);

    if (success) {
      return data;
    } else {
      console.log(error);
    }
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
      saveToAPI(todos);
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
        <p>Kinda lonely here...Add something!</p>
      )}
    </div>
  );
}
