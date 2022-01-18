import { readdirSync, writeFileSync } from "fs";
import { getFileLines, removeRelevantSubdomains } from "./utils.js";

const d = new Date();
const VERSION = `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, "0")}${(d.getDate()).toString().padStart(2, "0")}`
const ADBLOCK_FILTER_HEADER = `[Adblock Plus 2.0]
! Title: Estonian spam sites list
! Version: ${VERSION}
! Expires: 1 days
! Homepage: https://github.com/doomnoodles/estonian-spam-list
! License: CC0 1.0 Universal http://creativecommons.org/publicdomain/zero/1.0/legalcode

`;

const HOSTSFILE_HEADER = `# Estonian spam list version ${VERSION}
# License: CC0 1.0 Universal http://creativecommons.org/publicdomain/zero/1.0/legalcode
# Contribute: https://github.com/doomnoodles/estonian-spam-list

127.0.0.1  localhost
::1  localhost

`;

const HOSTS_LINE_START = "0.0.0.0 ";

console.info(`Started adblock list compilation...\n`);
const hosts = Array.from(new Set(readdirSync("./hosts", "utf8").flatMap(filename => getFileLines(`./hosts/${filename}`)))).sort();

console.info(`Writing ${hosts.length} hosts into hosts.txt`);
writeFileSync(`hosts.txt`, HOSTSFILE_HEADER + hosts.map(host => HOSTS_LINE_START + host).join("\n"));

const adblockHosts = Array.from(new Set(hosts.map(host => removeRelevantSubdomains(host)))).sort();
console.info(`Writing ${adblockHosts.length} hosts into sites.txt`);
writeFileSync(`sites.txt`, ADBLOCK_FILTER_HEADER + adblockHosts.join("\n"));

console.info("\nList compilation done");