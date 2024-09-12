import { z } from "zod";

export const ToDoItemSchema = z.object({
  text: z.string(),
  state: z.enum(["complete", "incomplete", "in progress"]),
});

export type TodoItemT = z.infer<typeof ToDoItemSchema>;

export type ToDoAPIPutResponseT = {
  id: string;
};

export const ToDoAPISchema = z.object({
  id: z.string(),
});

export const ToDoGetAPIResponseSchema = z.object({
  notes: z.array(ToDoItemSchema),
});
