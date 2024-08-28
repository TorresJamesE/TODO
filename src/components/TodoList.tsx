import { useState } from "react";
import { ToDoForm } from "./Form";
import { TodoItem } from "./TodoItem";
import { type TodoItemT } from "../types/types";

/**
 *
 */
export function TodoList() {
  const [todos, setTodos] = useState<TodoItemT[]>([]);

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
      todos[idx].state = state;
      return todos;
    });
  }

  const listItems = todos.map((todo, index) => {
    return (
      <TodoItem
        onRemoveItem={() => removeToDoItem(index)}
        key={index}
        item={todo}
        onStateChange={(state) => handleStateChange(index, state)}
      />
    );
  });

  return (
    <div className="container">
      <ToDoForm onTodoAdd={onTodoAdd}></ToDoForm>
      {listItems.length > 0 ? (
        <ul className="todo-list">{listItems}</ul>
      ) : (
        <p>Add a To-Do to get started!</p>
      )}
    </div>
  );
}

// - Save todo in locally (in browser)
//   - fetch
//     - useEffect
//   - save
// - Save todo in a database
