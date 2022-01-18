import { getFileLines } from "./utils.js";
import { readdirSync, writeFileSync } from "fs";

console.info("Sorting input lists...\n");
readdirSync("./input/hosts/", "utf8").forEach(filename => {
    console.info(`\t${filename}`);
    const lines = getFileLines(`./input/hosts/${filename}`);
    writeFileSync(`./input/hosts/${filename}`, lines.sort().join("\n") + "\n");
});
console.info("\nSorting complete");