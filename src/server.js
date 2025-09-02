import express from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

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

// ---- serve the built frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "../dist/index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server listening on", PORT));
