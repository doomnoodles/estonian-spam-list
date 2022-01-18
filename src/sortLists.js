import { getFileLines } from "./utils.js";
import { readdirSync, writeFileSync } from "fs";

console.info("Sorting hostlists...\n");
readdirSync("./hosts", "utf8").forEach(filename => {
    console.info(`\t${filename}`);
    const lines = getFileLines(`./hosts/${filename}`);
    writeFileSync(`./hosts/${filename}`, lines.sort().join("\n"));
});
console.info("\nSorting complete");