import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import puppeteer from 'puppeteer';

const FORBIDDEN_HOSTS = ["aliexpress.com"];
const RESULTS_DIR = "./results/";

const VISIT_TIMEOUT = 10000; // 10 seconds
const SIMULTANEOUS_VISITS = 10;
const urls = readFileSync("unverified_links.txt", { encoding: 'utf8' })?.trim()?.split(/\r?\n/);

const browser = await puppeteer.launch({ headless: true });

let resolvedUrls = [];
let visitedCount = 0;
const totalCount = urls.length;
console.log(`Visiting ${totalCount} urls...`);
while(true) {
    const chunkedUrls = urls.splice(0, SIMULTANEOUS_VISITS);
    visitedCount += chunkedUrls.length;
    if(chunkedUrls.length === 0) break;

    resolvedUrls = [...resolvedUrls, ...await Promise.all(chunkedUrls.map(startUrl => new Promise(async res => {
        try {
            const page = await browser.newPage();
            await page.goto(startUrl, { referer: "https://www.google.com/", timeout: VISIT_TIMEOUT, waitUntil: "networkidle2" });
            const endUrl = await page.url();
            await page.close();

            res({ startUrl, endUrl });
        } catch(error) {
            res({ startUrl, error });
        }
    })))];

    console.log(`Visited ${visitedCount}/${totalCount} urls`);
}

let spamUrls = [];
let otherUrls = [];

for(let data of resolvedUrls) {
    top: {
        const { startUrl, endUrl, error } = data;
        if(error) {
            console.error(`Encountered error at '${startUrl}': \n${error.toString()}`)
            otherUrls.push(data);
            break top;
        }

        const { host } = new URL(endUrl);
        for(let forbiddenHost of FORBIDDEN_HOSTS) {
            if(host.includes(forbiddenHost)) {
                spamUrls.push(data);
                break top;
            }
        }
        otherUrls.push(data);
    }
}

const wwwRegex = /^(www\.)/;
const timestamp = Date.now();
const spamHosts = Array.from(new Set(spamUrls.map(data => new URL(data.startUrl).host.replace(wwwRegex, ""))));

if (!existsSync(RESULTS_DIR)){
    mkdirSync(RESULTS_DIR, { recursive: true });
}

writeFileSync(`${RESULTS_DIR}${timestamp}-other.json`, JSON.stringify(otherUrls, null, 2));
writeFileSync(`${RESULTS_DIR}${timestamp}-urls.json`, JSON.stringify(spamUrls, null, 2));
writeFileSync(`${RESULTS_DIR}${timestamp}-hosts.txt`, spamHosts.join("\n"));

// console.log(spamUrls)
console.log(`Spam url rate: ${spamUrls.length}/${totalCount}`);
console.log("Done.")
await browser.close();