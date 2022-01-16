import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { PromisePool } from '@supercharge/promise-pool'
import puppeteer from 'puppeteer';

const ADBLOCK_FILTER_HEADER = `[Adblock Plus 2.0]
! Title: Estonian spam sites list
! Version: 20220115
! Expires: 1 days
! Homepage: https://github.com/doomnoodles/estonian-spam-list
! License: CC0 1.0 Universal http://creativecommons.org/publicdomain/zero/1.0/legalcode

`;

const DONT_VERIFY_IF_HOST_CONTAINS = ["aliexpress", "google", "youtube", "wikipedia"];
const FORBID_REDIRECTS_TO = ["aliexpress.com"];
const RESULTS_DIR = "./results/";

const TAB_TIMEOUT = 10000; // 10 seconds
const MAX_BROWSER_TABS = 5;

class LoggerArray {
    #interval;
    #maxSize;
    #arr;

    constructor(interval, maxSize) {
        this.#interval = interval;
        this.#maxSize = maxSize;
        this.#arr = [];
    }
    push(element) {
        this.#arr.push(element);
        if(!(this.#arr.length % this.#interval)) {
            console.info(`Visited ${this.#arr.length}/${this.#maxSize} urls`);
        }
    }
    asArray() {
        return this.#arr;
    }
}

class PuppeteerPool {
    #maxTabs;
    #timeout;
    #browser;
    #visited;

    constructor(maxTabs, timeout) {
        this.#maxTabs = maxTabs;
        this.#timeout = timeout;
    }
    async visit(urls) {
        console.info(`Visiting ${urls.length} urls...`)
        this.#browser = await puppeteer.launch({ headless: true });
        this.#visited = new LoggerArray(10, urls.length);
        const res = await PromisePool.for(urls)
        .withConcurrency(this.#maxTabs)
        .process(async startUrl => {
            try {
                const page = await this.#browser.newPage();
                await page.goto(startUrl, { referer: "https://www.google.com/", timeout: this.#timeout, waitUntil: "networkidle2" });
                const endUrl = await page.url();
                await page.close();
                this.#visited.push(startUrl);
    
                return { startUrl, endUrl };
            } catch(error) {
                console.error(`Error at ${startUrl}: \n\t${error.message}`);
                this.#visited.push(startUrl);
                return { startUrl, error };
            }
        });
        this.#browser.close();
        return res;
    }
}

function isForbiddenUrl(resolvedUrl) {
    const { endUrl, error } = resolvedUrl;
    if(error) return false;

    const { host } = new URL(endUrl);
    for(let forbiddenHost of FORBID_REDIRECTS_TO) {
        if(host.includes(forbiddenHost)) {
            return true;
        }
    }
    return false;
}

function splitResolvedUrls(resolvedUrls) {
    let forbiddenUrls = [];
    let otherUrls = [];

    for(let resolvedUrl of resolvedUrls) {
        if(isForbiddenUrl(resolvedUrl)) {
            forbiddenUrls.push(resolvedUrl);
        } else {
            otherUrls.push(resolvedUrl);
        }
    }
    return { forbiddenUrls, otherUrls };
}

const wwwRegex = /^(www\.)/;
const etRegex = /^(et\.)/;
function removeRelevantSubdomains(str) {
    return str.replace(wwwRegex, "").replace(etRegex, "");
}

function getHosts(filename) {
    try {
        return readFileSync(filename, { encoding: 'utf8' })?.trim()?.split(/\r?\n/);
    } catch(e) {
        return [];
    }
}

const previousHosts = new Set(getHosts("hosts.txt"));
const lines = readFileSync("links_unverified.txt", { encoding: 'utf8' })?.trim()?.split(/\r?\n/);
const urls = Array.from(new Set(lines.filter(url => {
    const host = new URL(url).host;
    for(let str of DONT_VERIFY_IF_HOST_CONTAINS)
        if(host.includes(str)) 
            return false;
    if(previousHosts.has(host))
        return false;
    return true;
})));

console.info(`Detected ${lines.length} lines of input...`)
if(lines.length !== urls.length) {
    console.info(`Filtered out ${lines.length - urls.length} lines...`)
}

const resolvedUrls = (await new PuppeteerPool(MAX_BROWSER_TABS, TAB_TIMEOUT).visit(urls)).results;
const { forbiddenUrls, otherUrls } = splitResolvedUrls(resolvedUrls);

const suspiciousUrls = otherUrls.filter(resolvedUrl => {
    return resolvedUrl.startUrl.startsWith("et.");
}).map(resolvedUrl => resolvedUrl.startUrl);

if (!existsSync(RESULTS_DIR)){
    mkdirSync(RESULTS_DIR, { recursive: true });
}

const timestamp = Date.now();
const newForbiddenHosts = Array.from(new Set(forbiddenUrls.map(data => new URL(data.startUrl).host)));

const forbiddenHosts = Array.from(new Set([...previousHosts, ...newForbiddenHosts])).sort();

writeFileSync(`hosts.txt`, forbiddenHosts.join("\n"));
writeFileSync(`sites.txt`, ADBLOCK_FILTER_HEADER + forbiddenHosts.map(host => removeRelevantSubdomains(host)).sort().join("\n"));
writeFileSync(`${RESULTS_DIR}${timestamp}.json`, JSON.stringify(resolvedUrls, null, 2));
writeFileSync(`${RESULTS_DIR}${timestamp}-hosts.txt`, newForbiddenHosts.join("\n"));
if(suspiciousUrls.length) {
    console.info(`Suspicious url rate: ${suspiciousUrls.length}/${resolvedUrls.length}`);
    writeFileSync(`${RESULTS_DIR}${timestamp}-suspicious.txt`, suspiciousUrls.join("\n"));
}

console.info(`Spam url rate: ${forbiddenUrls.length}/${resolvedUrls.length}`);
console.info("Done.")