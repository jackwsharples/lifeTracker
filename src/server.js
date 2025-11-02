// src/server.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ----- setup
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// ===================== API ROUTES =====================
// ---- Classes
app.get("/api/classes", async (_req, res) => {
  const rows = await prisma.class.findMany({ orderBy: { createdAt: "desc" } });
  res.json(rows);
});
app.post("/api/classes", async (req, res) => {
  const created = await prisma.class.create({ data: { name: req.body.name } });
  res.json(created);
});

// ---- Work items
app.get("/api/work-items", async (_req, res) => {
  const rows = await prisma.workItem.findMany({ orderBy: { createdAt: "desc" } });
  res.json(rows);
});
app.post("/api/work-items", async (req, res) => {
  const { title, description, classId } = req.body;
  const created = await prisma.workItem.create({
    data: { title, description, classId, completed: false },
  });
  res.json(created);
});
app.patch("/api/work-items/:id", async (req, res) => {
  const updated = await prisma.workItem.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(updated);
});
app.delete("/api/work-items/:id", async (req, res) => {
  await prisma.workItem.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// ---- Important dates
app.get("/api/important-dates", async (_req, res) => {
  const rows = await prisma.importantDate.findMany({ orderBy: { date: "asc" } });
  res.json(rows);
});
app.post("/api/important-dates", async (req, res) => {
  const { title, date, description, classId } = req.body;
  const created = await prisma.importantDate.create({
    data: { title, date: new Date(date), description, classId },
  });
  res.json(created);
});
app.patch("/api/important-dates/:id", async (req, res) => {
  const { title, date, description } = req.body;
  const updated = await prisma.importantDate.update({
    where: { id: req.params.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(date !== undefined ? { date: new Date(date) } : {}),
      ...(description !== undefined ? { description } : {}),
    },
  });
  res.json(updated);
});
app.delete("/api/important-dates/:id", async (req, res) => {
  await prisma.importantDate.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// ---- Ideas
app.get("/api/ideas", async (_req, res) => {
  const rows = await prisma.idea.findMany({ orderBy: { createdAt: "desc" } });
  res.json(rows);
});
app.post("/api/ideas", async (req, res) => {
  const created = await prisma.idea.create({ data: { content: req.body.content } });
  res.json(created);
});
app.patch("/api/ideas/:id", async (req, res) => {
  const updated = await prisma.idea.update({
    where: { id: req.params.id },
    data: { content: req.body.content },
  });
  res.json(updated);
});
app.delete("/api/ideas/:id", async (req, res) => {
  await prisma.idea.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// ---- Events
app.get("/api/events", async (_req, res) => {
  const rows = await prisma.event.findMany({ orderBy: { date: "asc" } });
  res.json(rows);
});
app.post("/api/events", async (req, res) => {
  const { title, date, time, description } = req.body;
  const created = await prisma.event.create({
    data: { title, date: new Date(date), time, description },
  });
  res.json(created);
});
app.delete("/api/events/:id", async (req, res) => {
  await prisma.event.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// ---- Workouts
app.get("/api/workouts", async (_req, res) => {
  const rows = await prisma.workout.findMany({
    orderBy: { date: "desc" },
    include: { exercises: true },
  });
  res.json(rows);
});
app.post("/api/workouts", async (req, res) => {
  const { type, date, notes, exercises = [] } = req.body;
  const created = await prisma.workout.create({
    data: { type, date: new Date(date), notes: notes || null },
  });
  if (Array.isArray(exercises) && exercises.length) {
    await prisma.exercise.createMany({
      data: exercises.map((e) => ({
        name: e.name,
        sets: typeof e.sets === 'number' ? e.sets : 1,
        reps: Number(e.reps || 0),
        weight: Number(e.weight || 0),
        workoutId: created.id,
      })),
    });
  }
  const full = await prisma.workout.findUnique({
    where: { id: created.id },
    include: { exercises: true },
  });
  res.json(full);
});

// ---- Bike
// Ideas
app.get("/api/bike/ideas", async (_req, res) => {
  const rows = await prisma.bikeIdea.findMany({ orderBy: { createdAt: "desc" } });
  res.json(rows);
});
app.post("/api/bike/ideas", async (req, res) => {
  const created = await prisma.bikeIdea.create({ data: { content: req.body.content } });
  res.json(created);
});
app.patch("/api/bike/ideas/:id", async (req, res) => {
  const updated = await prisma.bikeIdea.update({
    where: { id: req.params.id },
    data: { content: req.body.content },
  });
  res.json(updated);
});
app.delete("/api/bike/ideas/:id", async (req, res) => {
  await prisma.bikeIdea.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// Events
app.get("/api/bike/events", async (_req, res) => {
  const rows = await prisma.bikeEvent.findMany({ orderBy: { date: "asc" } });
  res.json(rows);
});
app.post("/api/bike/events", async (req, res) => {
  const { title, date, description, type } = req.body;
  const created = await prisma.bikeEvent.create({
    data: { title, date: new Date(date), description, type },
  });
  res.json(created);
});
app.patch("/api/bike/events/:id", async (req, res) => {
  const { title, date, description, type } = req.body;
  const updated = await prisma.bikeEvent.update({
    where: { id: req.params.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(date !== undefined ? { date: new Date(date) } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(type !== undefined ? { type } : {}),
    },
  });
  res.json(updated);
});
app.delete("/api/bike/events/:id", async (req, res) => {
  await prisma.bikeEvent.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// ================== HEALTH + STATIC SPA ==================
app.get("/api/health", (_req, res) => res.status(200).json({ ok: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "../dist");
const indexFile = path.join(distDir, "index.html");

app.use(express.static(distDir));

// SPA fallback (no wildcards like "/*" to avoid path-to-regexp issues)
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
  res.status(404).send("index.html not found");
});

// ======================= START ==========================
const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`[boot] Listening on http://${HOST}:${PORT}`);
});
