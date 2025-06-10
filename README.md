# Node.js `AsyncLocalStorage` explained

This repo explains what [`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage) is with simple example.

To run the examples you only need Node.js installed. You don't need to add any dependency

---

## The scene

Imagine you have a server with:

- a `handler` function that handles requests
- a `readData` function that reads data from a database
- a `logger` functon that logs things to the console

The code in `server1.js` simulates this scenario with a fake server.

Run the code with `node server1.js` to simulate 10 parallel requests

## The problem

One problem we see in the logs is the lack of context. We don't know which of the responses (and times) are related to which request.

- One easy solution is to pass the `id` created in the handler to the logger everytime we want to log something.
- The problem is that we need to pass `requestId` to all functions, even the ones that are unrelated, only to have nice logs.

You can see the updated code in `server2.js`. Run it with `node server2.js`.

And we can't create a global variable `requestId` because requests are incoming in parallel

## AsyncLocalStorage

`AsyncLocalStorage` lets us create a "store" that will contain information available in an entire execution context.

- It is like "running a function in a thread" and being able to store information only for that thread.

By using `AsyncLocalStorage`, we can create a store that contains the request ID and run the entire handler in a "thread attached to the store".

```js
// Stores the data in the thread.
// The store itself is a global variable but not its content
const idStore = new AsyncLocalStorage();

/** Handles a request */
async function handler() {
  // Here (outside of idStore.run), getStore returns undefined
  console.log(idStore.getStore());
  // Generate a random request ID
  const id = Math.ceil(Math.random() * 1000000000).toString(36);
  idStore.run(id, async () => {
    // Here `getStore` returns the ID
    console.log(idStore.getStore());

    // If I call `getStore()` inside `f2()` now it will get the ID
    f2();
  });

  // If I call `getStore()` inside `f2()` now it will NOT get any ID
  f2();
}
```

See the updated code in `server3.js`. Notice how `readData` function does NOT accept any parameters. Notice also that logger is not being called with ID anymore
