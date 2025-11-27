// src/db/seed.ts

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { users, projects, tasks } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // --- Insert sample user ---
  const user: typeof users.$inferInsert = {
    name: "Alice Example",
    email: "alice@example.com",
  };

  await db.insert(users).values(user);
  console.log("✅ New user created!");

  // --- Insert sample project ---
  const project: typeof projects.$inferInsert = {
    name: "Demo Project",
    description: "A placeholder project for seeding",
    ownerId: 1, // assumes Alice gets id=1
  };

  await db.insert(projects).values(project);
  console.log("✅ New project created!");

  // --- Insert sample task ---
  const task: typeof tasks.$inferInsert = {
    title: "First Task",
    description: "This is a seeded task",
    projectId: 1, // assumes Demo Project gets id=1
    assigneeId: 1, // assigned to Alice
    completed: false,
  };

  await db.insert(tasks).values(task);
  console.log("✅ New task created!");

  // --- Query all users ---
  const allUsers = await db.select().from(users);
  console.log("📋 All users:", allUsers);

  // --- Update a task ---
  await db
    .update(tasks)
    .set({ completed: true })
    .where(eq(tasks.title, task.title));
  console.log("🔄 Task marked as completed!");

  // --- Delete the task (cleanup) ---
  await db.delete(tasks).where(eq(tasks.title, task.title));
  console.log("🗑️ Task deleted!");

  // --- Delete the project (cleanup) ---
  await db.delete(projects).where(eq(projects.name, project.name));
  console.log("🗑️ Project deleted!");

  // --- Delete the user (cleanup) ---
  await db.delete(users).where(eq(users.email, user.email));
  console.log("🗑️ User deleted!");
}

main().catch((err) => {
  console.error("❌ Seed script failed:", err);
  process.exit(1);
});