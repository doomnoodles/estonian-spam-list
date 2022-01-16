import puppeteer from 'puppeteer';
import { PromisePool } from '@supercharge/promise-pool';
import { readFileSync } from "fs";

export function getFileLines(filename) {
    try {
        const str = readFileSync(filename, { encoding: 'utf8' })?.trim();
        return str.length ? str.split(/\r?\n/) : [];
    } catch(e) {
        return [];
    }
}

export function splitResolvedUrls(resolvedUrls, forbiddenArray) {
    let forbiddenUrls = [];
    let otherUrls = [];

    for(let resolvedUrl of resolvedUrls) {
        if(isForbiddenUrl(resolvedUrl, forbiddenArray)) {
            forbiddenUrls.push(resolvedUrl);
        } else {
            otherUrls.push(resolvedUrl);
        }
    }
    return { forbiddenUrls, otherUrls };
}

function isForbiddenUrl(resolvedUrl, forbiddenArray) {
    const { endUrl, error } = resolvedUrl;
    if(error) return false;

    const { host } = new URL(endUrl);
    for(let forbiddenHost of forbiddenArray) {
        if(host.includes(forbiddenHost)) {
            return true;
        }
    }
    return false;
}

const wwwRegex = /^(www\.)/;
const etRegex = /^(es?t\.)/;
const mRegex = /^(m\.)/;
export function removeRelevantSubdomains(str) {
    return str.replace(mRegex, "").replace(wwwRegex, "").replace(etRegex, "");
}

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

export class PuppeteerPool {
    #maxTabs;
    #timeout;
    #browser;
    #visited;

    constructor(maxTabs, timeout) {
        this.#maxTabs = maxTabs;
        this.#timeout = timeout;
    }
    async visit(urls) {
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
                console.error(`Error at ${startUrl} \n\t${error.message}`);
                this.#visited.push(startUrl);
                return { startUrl, error: error.message };
            }
        });
        this.#browser.close();
        return res;
    }
}