import cors from "cors";
import crypto from "crypto";
import express from "express";
import fs from "fs";
import { promisify } from "util";

const PORT = 8080;
const DATABASE_FILE = "database.json";
const BACKUP_FILE = "backup.json";
const app = express();

app.use(cors());
app.use(express.json());

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

interface Database {
  data: string;
  hash: string;
}

const readDatabase = async (): Promise<Database> => {
  try {
    const data = await readFile(DATABASE_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file:", error);
    return { data: "Hello World", hash: "" }; // Default value if file read fails
  }
};

const writeDatabase = async (database: Database): Promise<void> => {
  try {
    await writeFile(DATABASE_FILE, JSON.stringify(database, null, 2));
  } catch (error) {
    console.error("Error writing database file:", error);
  }
};

const readBackup = async (): Promise<Database> => {
  try {
    const data = await readFile(BACKUP_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading backup file:", error);
    return { data: "Hello World", hash: "" }; // Default value if file read fails
  }
};

const writeBackup = async (database: Database): Promise<void> => {
  try {
    await writeFile(BACKUP_FILE, JSON.stringify(database, null, 2));
  } catch (error) {
    console.error("Error writing backup file:", error);
  }
};

const generateHash = (data: string): string => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

const initializeDatabase = async (): Promise<void> => {
  let database = await readDatabase();
  if (!database.hash) {
    database.hash = generateHash(database.data);
    await writeDatabase(database);
  }

  let backup = await readBackup();
  if (!backup.hash) {
    backup.data = database.data;
    backup.hash = database.hash;
    await writeBackup(backup);
  }
};

initializeDatabase();

app.get("/", async (req, res) => {
  const database = await readDatabase();
  res.json(database);
});

app.post("/", async (req, res) => {
  if (!req.body.data || typeof req.body.data !== "string") {
    return res.status(400).json({ error: "Invalid data" });
  }

  let database = await readDatabase();
  database.data = req.body.data;
  database.hash = generateHash(database.data);
  await writeDatabase(database);

  let backup = await readBackup();
  backup.data = database.data;
  backup.hash = database.hash;
  await writeBackup(backup);

  res.sendStatus(200);
});

app.get("/verify", async (req, res) => {
  const database = await readDatabase();
  const currentHash = generateHash(database.data);
  res.json({ valid: currentHash === database.hash });
});

app.post("/recover", async (req, res) => {
  const backup = await readBackup();
  let database = await readDatabase();

  database.data = backup.data;
  database.hash = backup.hash;
  await writeDatabase(database);

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
