import { useState } from "react";

/**
 *
 */
export function Todo() {
  const [todos, setTodos] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");

  function handleAddTodo(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key == "Enter") {
      setTodos((prevToDos) => {
        return [...prevToDos, inputText];
      });

      setInputText("");
    }
  }

  function removeToDoItem(idx: number) {
    setTodos((currentToDos) => {
      return currentToDos.filter((_, i) => i !== idx);
    });
  }

  const listItems = todos.map((todo, index) => {
    return (
      <div className="todo-item">
        <li key={todo}>{todo}</li>
        <div onClick={() => removeToDoItem(index)} className="remove-item">
          X
        </div>
      </div>
    );
  });

  return (
    <div className="container">
      <input
        onKeyDown={handleAddTodo}
        className="add-item"
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.currentTarget.value)}
      />
      {listItems.length > 0 ? (
        <ul className="todo-list">{listItems}</ul>
      ) : (
        <p>Add a To-Do to get started!</p>
      )}
    </div>
  );
}

// - Container
// - List of todos
//   - Incomplete
//   - Complete (strikethrough)
// - Add new todo input
// Remove todo item.
// - Save todo in locally
