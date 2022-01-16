import { readdirSync, writeFileSync } from "fs";
import { getFileLines, removeRelevantSubdomains } from "./utils.js";

const ADBLOCK_FILTER_HEADER = `[Adblock Plus 2.0]
! Title: Estonian spam sites list
! Version: 20220115
! Expires: 1 days
! Homepage: https://github.com/doomnoodles/estonian-spam-list
! License: CC0 1.0 Universal http://creativecommons.org/publicdomain/zero/1.0/legalcode

`;

console.info(`Started adblock list compilation...`);
const hosts = Array.from(new Set(readdirSync("./hosts", "utf8").flatMap(filename => getFileLines(`./hosts/${filename}`)))).sort();

console.info(`Writing ${hosts.length} hosts into hosts.txt`);
writeFileSync(`hosts.txt`, hosts.join("\n"));

const adblockHosts = Array.from(new Set(hosts.map(host => removeRelevantSubdomains(host)))).sort();
console.info(`Writing ${adblockHosts.length} hosts into sites.txt`);
writeFileSync(`sites.txt`, ADBLOCK_FILTER_HEADER + adblockHosts.join("\n"));

console.info("Done.")