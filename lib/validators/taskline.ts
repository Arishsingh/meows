import { z } from "zod";

export const prioritySchema = z.enum(["low", "medium", "high"]);

export const taskCreateSchema = z.object({
  input: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).optional(),
  listKey: z.string().trim().min(1).optional(),
  listName: z.string().trim().optional(),
  order: z.number().int().optional(),
  done: z.boolean().optional(),
  dueAt: z.string().datetime().nullable().optional(),
  priority: prioritySchema.optional(),
  labels: z.array(z.string().trim().min(1)).optional(),
  recurrence: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional(),
});

export const taskUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).optional(),
  notes: z.string().optional().nullable(),
  done: z.boolean().optional(),
  listKey: z.string().trim().min(1).optional().nullable(),
  listName: z.string().trim().optional().nullable(),
  order: z.number().int().optional(),
  dueAt: z.string().datetime().nullable().optional(),
  priority: prioritySchema.optional(),
  labels: z.array(z.string().trim().min(1)).optional(),
  recurrence: z.string().trim().optional().nullable(),
  reminders: z.array(z.object({ id: z.string(), at: z.string().datetime(), label: z.string().optional(), createdAt: z.string().datetime() })).optional(),
  comments: z.array(z.object({ id: z.string(), body: z.string(), author: z.string(), createdAt: z.string().datetime() })).optional(),
});

export const listCreateSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  listKey: z.string().trim().optional(),
  order: z.number().int().optional(),
});

export const listUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional().nullable(),
  order: z.number().int().optional(),
});

export const commentCreateSchema = z.object({
  taskId: z.string().min(1),
  body: z.string().trim().min(1),
  author: z.string().trim().optional(),
});

export const commentDeleteSchema = z.object({
  taskId: z.string().min(1),
  commentId: z.string().min(1),
});

export const reminderCreateSchema = z.object({
  taskId: z.string().min(1),
  at: z.string().datetime(),
  label: z.string().trim().optional(),
});

export const reminderUpdateSchema = z.object({
  taskId: z.string().min(1),
  reminderId: z.string().min(1),
  at: z.string().datetime().optional(),
  label: z.string().trim().optional().nullable(),
});

export const reminderDeleteSchema = z.object({
  taskId: z.string().min(1),
  reminderId: z.string().min(1),
});

export const shareInviteSchema = z.object({
  listId: z.string().min(1),
  email: z.string().email(),
});

export const shareAcceptSchema = z.object({
  listId: z.string().min(1),
  inviteId: z.string().min(1).optional(),
});

export const filterSchema = z.object({
  query: z.string().optional(),
  listKey: z.string().optional(),
  status: z.enum(["all", "open", "done"]).optional(),
  priority: prioritySchema.optional(),
  label: z.string().optional(),
  due: z.string().optional(),
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
export type ListCreateInput = z.infer<typeof listCreateSchema>;
export type ListUpdateInput = z.infer<typeof listUpdateSchema>;
