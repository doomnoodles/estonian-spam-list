import { getFileLines } from "./utils.js";
import { readdirSync, writeFileSync } from "fs";

console.info("Sorting input lists...\n");
readdirSync("./input", "utf8").forEach(filename => {
    console.info(`\t${filename}`);
    const lines = getFileLines(`./input/${filename}`);
    writeFileSync(`./input/${filename}`, lines.sort().join("\n") + "\n");
});
console.info("\nSorting complete");