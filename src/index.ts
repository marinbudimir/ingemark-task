import { createInterface, Interface } from "readline";
import { createReadStream } from "fs";
import axios from "axios";

import { extractEmail, extractTitle, extractLastUrl } from "./utils/string.js";
import AsyncQueue from "./utils/queue.js";
import { delay } from "./utils/delay.js";
import { hashEmail } from "./utils/crypto.js";

type Result = {
  url: string;
  title?: string;
  email?: string;
};
const urlQueue = new AsyncQueue<string>();

function serializeObject(obj: Result) {
  const serializedEntries = Object.entries(obj)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key}: '${value}'`);

  return `{${serializedEntries.join(", ")}}`;
}

async function consumer() {
  const retriedUrls = new Set();
  while (true) {
    const url = await urlQueue.dequeue();

    try {
      const response = await axios.get(`https://${url}`);
      const title = extractTitle(response.data);
      const email = extractEmail(response.data);
      const emailHash = email ? hashEmail(email) : undefined;
      const result = { url, title, email: emailHash };
      const ser = serializeObject(result);

      console.log(ser);
    } catch (err: any) {
      if (!retriedUrls.has(url)) {
        retriedUrls.add(url);
        setTimeout(() => {
          urlQueue.enqueue(url);
        }, 60000);
      } else {
        console.error(`Error fetching ${url}: ${err.code}`);
      }
    }
    await delay(1000);
  }
}

async function producer(rl: Interface) {
  const uniqueUrls = new Set();
  for await (const line of rl) {
    let insideBrackets = false;
    let openInnerBrackets = 0;
    let buffer = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const prevChar = i > 0 ? line[i - 1] : "";

      if (prevChar === "\\" && (char === "[" || char === "]")) {
        continue;
      }

      if (!insideBrackets) {
        if (char === "[") {
          insideBrackets = true;
          buffer = "";
        }
      } else {
        if (char === "[") {
          openInnerBrackets++;
        } else if (char === "]") {
          if (openInnerBrackets == 0) {
            const url = extractLastUrl(buffer);
            if (url) {
              if (!uniqueUrls.has(url)) {
                urlQueue.enqueue(url);
              }
              uniqueUrls.add(url);
            }
            insideBrackets = false;
            continue;
          } else {
            openInnerBrackets--;
          }
        }
        buffer += char;
      }
    }
  }
}

(async () => {
  const inputPath = process.argv[2];
  if (inputPath) {
    const fileStream = createReadStream(inputPath);
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    producer(rl);
  } else {
    const rl = createInterface({
      input: process.stdin,
    });
    producer(rl);
  }

  await consumer();
})();
