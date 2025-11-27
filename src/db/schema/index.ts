// src/db/schema/index.ts

import { pgTable, serial, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";

/**
 * Users table
 * -----------
 * Represents people who use the task app.
 */
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Projects table
 * --------------
 * Groups tasks under a common project.
 */
export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 1000 }),
    ownerId: integer("owner_id")
        .notNull()
        .references(() => users.id), // project belongs to a user
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Tasks table
 * -----------
 * Individual tasks that belong to projects and are assigned to users.
 */
export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 2000 }),
    projectId: integer("project_id")
        .notNull()
        .references(() => projects.id), // task belongs to a project
    assigneeId: integer("assignee_id")
        .references(() => users.id), // optional: task assigned to a user
    completed: boolean("completed").default(false).notNull(),
    dueDate: timestamp("due_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});