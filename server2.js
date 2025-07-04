// @ts-check
import { setTimeout } from "node:timers/promises";

/** Handles a request */
async function handler() {
  // Generate a random request ID
  const id = Math.ceil(Math.random() * 1000000000).toString(36);
  logger(`${id}: Incoming request`);

  const data = await readData(id);
  logger(`${id}: Response: ${data}`);
}

/** Reads data from a database */
async function readData(id) {
  logger(`${id}: Reading database`);
  const t = Math.ceil(Math.random() * 1000);
  await setTimeout(t);
  logger(`${id}: It took ${t}ms to read`);
  return Math.random();
}

/** Logs stuff */
function logger(msg) {
  console.log(msg);
}

// Simulate 10 parallel requests
for (let i = 0; i < 10; i++) {
  logger(">> CLIENT: Sending request");
  handler();
}
