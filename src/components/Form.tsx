import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

type ToDoFormProps = {
  onTodoAdd: (todo: string) => void;
};

type FormValues = {
  todo: string;
};

export function ToDoForm({ onTodoAdd }: ToDoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ criteriaMode: "all" });

  const onSubmit = handleSubmit(({ todo }: FormValues) => {
    onTodoAdd(todo);
    reset();
  });

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <label htmlFor="input-add-todo"></label>
      <input
        placeholder="Enter to-do..."
        type="text"
        id="input-add-todo"
        style={{
          padding: "5px",
        }}
        {...register("todo", {
          required: "This input is required",
          pattern: {
            value: /\w+/,
            message: "Cannot be blank.",
          },
          minLength: {
            value: 1,
            message: "This input must exceed 1 character.",
          },
        })}
      />
      <ErrorMessage
        errors={errors}
        name="todo"
        render={({ messages }) => {
          return messages
            ? Object.entries(messages).map(([type, message]) => (
                <p className="error" key={type}>
                  {message}
                </p>
              ))
            : null;
        }}
      />
      <button>Add TO-DO!</button>
    </form>
  );
}
