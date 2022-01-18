import { writeFileSync, existsSync, mkdirSync } from "fs";
import { compileHosts, compileCustomFilters, removeRelevantSubdomains } from "./utils.js";

const d = new Date();
const VERSION = `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, "0")}${(d.getDate()).toString().padStart(2, "0")}`
const ADBLOCK_FILTER_HEADER = `[Adblock Plus 2.0]
! Title: Estonian spam sites list
! Version: ${VERSION}
! Expires: 1 days
! Homepage: https://github.com/doomnoodles/estonian-spam-list
! License: CC0 1.0 Universal http://creativecommons.org/publicdomain/zero/1.0/legalcode`;

const HOSTSFILE_HEADER = `# Estonian spam list version ${VERSION}
# License: CC0 1.0 Universal http://creativecommons.org/publicdomain/zero/1.0/legalcode
# Contribute: https://github.com/doomnoodles/estonian-spam-list

127.0.0.1  localhost
::1  localhost

`;

const HOSTS_SECTION = `\n\n! ---- Hosts section ----\n`;
const FILTER_SECTION = `\n\n! ---- Filter section ----\n`;

const HOSTS_LINE_START = "0.0.0.0 ";

!existsSync("./output/") && mkdirSync("./output/", { recursive: true });

console.info(`Started adblock list compilation...\n`);
const hosts = Array.from(compileHosts()).sort();

console.info(`Writing ${hosts.length} hosts into hosts.txt`);
writeFileSync(`./output/hosts.txt`, HOSTSFILE_HEADER + hosts.map(host => HOSTS_LINE_START + host).join("\n") + "\n");

const adblockHosts = Array.from(new Set(hosts.map(host => removeRelevantSubdomains(host)))).sort();
const adblockCustomFilters = Array.from(compileCustomFilters()).sort();

console.info(`Writing ${adblockHosts.length} hosts and ${adblockCustomFilters.length} custom filters into sites.txt`);
writeFileSync(`./output/sites.txt`, ADBLOCK_FILTER_HEADER + HOSTS_SECTION + adblockHosts.join("\n") + FILTER_SECTION + adblockCustomFilters.join("\n") + "\n");

console.info("\nList compilation done");