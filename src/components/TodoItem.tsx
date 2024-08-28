import { type TodoItemT } from "../types/types";

type TodoItemProps = {
  item: TodoItemT;
  onRemoveItem: () => void;
  onStateChange: (state: TodoItemT["state"]) => void;
};

// TODO: Add functionality to keep track of what you have done/not done (incomplete versus complete).
export function TodoItem({ item, onRemoveItem, onStateChange }: TodoItemProps) {
  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newState = event.currentTarget.checked ? "complete" : "incomplete";
    onStateChange(newState);
  }

  return (
    <li
      style={{
        display: "flex",
        gap: "10px",
        listStyle: "none",
      }}
    >
      <input
        type="checkbox"
        checked={item.state === "complete"}
        onChange={handleOnChange}
      />
      <span
        style={{
          textDecoration: item.state === "complete" ? "line-through" : "none",
          ...(item.state === "complete" && { color: "grey" }),
        }}
      >
        {item.text}
      </span>
      <span onClick={onRemoveItem}>X</span>
    </li>
  );
}
