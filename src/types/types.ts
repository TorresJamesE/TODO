import { z } from "zod";

export const ToDoItemSchema = z.object({
  text: z.string(),
  state: z.enum(["complete", "incomplete", "in progress"]),
});

export type TodoItemT = z.infer<typeof ToDoItemSchema>;

export const ToDoAPISchema = z.object({
  _id: z.string().optional(),
  // notes: z.array(ToDoItemSchema),
});

export const ToDoGetAPIResponseSchema = z.object({
  notes: z.array(ToDoItemSchema),
});
