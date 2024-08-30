import { useState, useEffect } from "react";
import { ToDoForm } from "./Form";
import { TodoItem } from "./TodoItem";
import { type TodoItemT } from "../types/types";

/**
 *
 */
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
    localStorage.setItem("todoItems", JSON.stringify(todos));
  }, [todos]);

  function onTodoAdd(todoItem: string) {
    setTodos((prevToDos) => {
      return [...prevToDos, { state: "incomplete", text: todoItem }];
    });
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
