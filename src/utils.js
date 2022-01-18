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