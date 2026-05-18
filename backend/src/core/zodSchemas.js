const { z } = require('zod');

// Authentication Schemas
const registerSchema = z.object({
  body: z.object({
    username: z.string().min(2, "Username must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

// Workspace Schemas
const createWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Workspace name must be at least 2 characters long"),
    isPublic: z.boolean().optional(),
  }),
});

// Event Schemas
const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().optional(),
    date: z.string().datetime({ message: "Invalid date format" }),
    location: z.string().optional(),
    workspaceId: z.string().optional(),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  createWorkspaceSchema,
  createEventSchema,
};
