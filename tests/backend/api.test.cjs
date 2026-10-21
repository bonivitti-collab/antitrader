const { spawn } = require("node:child_process");
const { once } = require("node:events");

let server;
let baseUrl;
let output = "";

beforeAll(async () => {
  server = spawn(process.execPath, ["server.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: "0",
      GEMINI_API_KEY: "",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (data) => {
    output += data;
  });
  server.stderr.on("data", (data) => {
    output += data;
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    const match = output.match(/port (\d+)/);
    if (match && Number(match[1]) > 0) {
      baseUrl = `http://127.0.0.1:${match[1]}`;
      return;
    }
    if (server.exitCode !== null) throw new Error(output);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`API did not start: ${output}`);
});

afterAll(async () => {
  if (server && server.exitCode === null) {
    const exited = once(server, "exit");
    server.kill();
    await exited;
  }
});

test("health check is available without API credentials", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
});

test("opportunities are served as JSON", async () => {
  const response = await fetch(`${baseUrl}/api/opportunities`);
  expect(response.status).toBe(200);
  const opportunities = await response.json();
  expect(Array.isArray(opportunities)).toBe(true);
  expect(opportunities.length).toBeGreaterThan(0);
  expect(opportunities[0]).toHaveProperty("ticker");
});

test("deployment preserves frozen mode", async () => {
  const response = await fetch(`${baseUrl}/api/scan-status`);
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    isFrozen: true,
    nextScanTime: null,
    secondsUntilNextScan: 0,
  });
});
