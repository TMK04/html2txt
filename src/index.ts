import axios from "axios";
import clipboardy from "clipboardy";
import { readFile } from "fs/promises";
import { convert } from "html-to-text";
import { resolve } from "path";

async function convertThenDoCoolStuff(html: string) {
  const text = convert(html).trim();
  // Print the text to the console
  console.log(text);
  // Copy text to clipboard
  clipboardy.write(text);
}

async function fetchUrl(url: string) {
  const response = await axios.get(url);
  if (!response.status.toString().startsWith("2")) {
    throw new Error("Failed to fetch the webpage.");
  }

  const html = response.data;
  if (typeof html !== "string") {
    throw new Error("Failed to convert the webpage to text.");
  }
  return html;
}

async function parseFile(path: string) {
  if (!path.endsWith(".html")) {
    throw new Error("Invalid filepath.");
  }
  const resolved_path = resolve(path);
  const html = await readFile(resolved_path, "utf-8");
  return html;
}

async function main() {
  const input = process.argv[2]; // e.g. https://www.google.com
  if (!input) {
    throw new Error("Please provide a URL.");
  }

  let html: string;
  // URL Regex
  if (input.match(/^(http|https):\/\/[^ "]+$/)) {
    html = await fetchUrl(input);
  } else {
    // Filepath
    html = await parseFile(input);
  }

  await convertThenDoCoolStuff(html);
}

main();
