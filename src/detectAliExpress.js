import { writeFileSync, existsSync, mkdirSync } from "fs";
import { compileHosts, getFileLines, splitResolvedUrls } from "./utils.js";
import { PuppeteerPool } from "./utilsPuppeteer.js";

const SKIP_KNOWN_HOSTS = true;

const FAKE_STORES_PATH = `./input/fake-stores.txt`;
const UNVERIFIED_URLS_PATH = `./links_unverified.txt`;
const RESULTS_DIR = "./results/";

const DONT_VERIFY_IF_HOST_CONTAINS = ["aliexpress", "google", "youtube", "wikipedia", "eki.ee", "facebook", "instagram"];
const FORBID_REDIRECTS_TO = ["aliexpress.com"];

const TAB_TIMEOUT = 10000; // 10 seconds
const MAX_BROWSER_TABS = 5;

console.info(`Aliexpress detector started...`);

const knownBadHosts = compileHosts();
const oldForbiddenHosts = new Set(getFileLines(FAKE_STORES_PATH));
const unverifiedUrlLines = getFileLines(UNVERIFIED_URLS_PATH);

console.info(`Detected ${unverifiedUrlLines.length} lines of input...`);

const unverifiedUrls = Array.from(new Set(unverifiedUrlLines.filter(url => {
    const { host } = new URL(url);
    for(let str of DONT_VERIFY_IF_HOST_CONTAINS)
        if(host.includes(str)) 
            return false;
    if(SKIP_KNOWN_HOSTS && knownBadHosts.has(host))
        return false;
    return true;
})));

(unverifiedUrlLines.length !== unverifiedUrls.length) && console.info(`Filtered out ${unverifiedUrlLines.length - unverifiedUrls.length} lines...`);

console.info(`\nVisited 0/${unverifiedUrls.length} urls`);
const resolvedUrls = (await new PuppeteerPool(MAX_BROWSER_TABS, TAB_TIMEOUT).visit(unverifiedUrls)).results;
const { forbiddenUrls, otherUrls } = splitResolvedUrls(resolvedUrls, FORBID_REDIRECTS_TO);
// const suspiciousUrls = otherUrls.filter(resolvedUrl => { 
//     const { host, pathname } = new URL(resolvedUrl.startUrl);
//     return host.startsWith("et.") || host.startsWith("est.") || pathname.startsWith("/et/");
// }).map(resolvedUrl => resolvedUrl.startUrl);
console.info("\n");

const newForbiddenHosts = Array.from(new Set(forbiddenUrls.map(data => new URL(data.startUrl).host)));
const forbiddenHosts = Array.from(new Set([...oldForbiddenHosts, ...newForbiddenHosts])).sort();

writeFileSync(FAKE_STORES_PATH, forbiddenHosts.join("\n"));

const timestamp = Date.now();
!existsSync(RESULTS_DIR) && mkdirSync(RESULTS_DIR, { recursive: true });
writeFileSync(`${RESULTS_DIR}${timestamp}.json`, JSON.stringify(resolvedUrls, null, 2));
writeFileSync(`${RESULTS_DIR}${timestamp}-hosts.txt`, newForbiddenHosts.join("\n"));
// if(suspiciousUrls.length) {
//     console.info(`Suspicious urls: ${suspiciousUrls.length}/${resolvedUrls.length}`);
//     writeFileSync(`${RESULTS_DIR}${timestamp}-suspicious.txt`, suspiciousUrls.join("\n"));
// }

console.info(`Aliexpress urls: ${forbiddenUrls.length}/${resolvedUrls.length}\n`);
console.info("Done.")