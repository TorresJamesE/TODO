
import { useForm } from "react-hook-form";

type ToDoFormProps = {
    onTodoAdd: (todo: string) => void
}

type FormValues = {
 todo: string
}

export function ToDoForm({onTodoAdd}: ToDoFormProps) {
    const {register, handleSubmit, reset} = useForm<FormValues>();

    const onSubmit = handleSubmit(({todo}: FormValues) => {
        onTodoAdd(todo);
        reset()
    })

    return (
        <form onSubmit={onSubmit}>
            <input
            {...register("todo")}
            />
            <button>Add!</button>
        </form>
    )
}