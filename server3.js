// @ts-check
import { setTimeout } from "node:timers/promises";
import { AsyncLocalStorage } from "node:async_hooks";

// Stores the request ID
const idStore = new AsyncLocalStorage();

/** Handles a request */
async function handler() {
  // Generate a random request ID
  const id = Math.ceil(Math.random() * 1000000000).toString(36);
  idStore.run(id, async () => {
    logger(`Incoming request`);

    const data = await readData();
    logger(`Response: ${data}`);
  });
}

/** Reads data from a database */
async function readData() {
  logger(`Reading database`);
  const t = Math.ceil(Math.random() * 1000);
  await setTimeout(t);
  logger(`It took ${t}ms to read`);
  return Math.random();
}

/** Logs stuff */
function logger(msg) {
  // Get the ID (if any)
  const id = idStore.getStore() ?? "-----";
  console.log(`${id}: ${msg}`);
}

// Simulate 10 parallel requests
for (let i = 0; i < 10; i++) {
  logger(">> CLIENT: Sending request");
  handler();
}
// Read data 2 times outside of the handler. It should NOT log any client ID
for (let i = 0; i < 2; i++) {
  readData();
}
