# estonian-spam-list
Adblock filter list + hostsfile for blocking spammy estonian sites.

Sites in the list mostly fall under the following categories:
1. Fake web-stores (which usually redirect to aliexpress)
2. Autotranslated SEO sites
3. Phishing / malware / notifications

[Click here to subscribe to the list (uBlock origin, adblock (plus), ...)](https://subscribe.adblockplus.org/?location=https://raw.githubusercontent.com/doomnoodles/estonian-spam-list/main/output/sites.txt&title=Estonian%20spam-sites%20list)

Direct links to files:
[filter](https://raw.githubusercontent.com/doomnoodles/estonian-spam-list/main/output/sites.txt) and 
[hosts](https://raw.githubusercontent.com/doomnoodles/estonian-spam-list/main/output/hosts.txt).

## Contributing
Easy: Just make a pull request with links that should be added to the list.

Technical:
1. Add new entries to relevant files in the ```input``` directory
2. (optional, requires nodejs) Compile the list, results are in ```output``` folder
```sh
npm run sort
npm run compile
```

## Aliexpress detection workflow
It is possible to detect if sites redirect to aliexpress and automatically add them to the list

1. (only once) Run ```npm install```
2. Create a file named ```unverified_links.txt```
3. Gather links from google using the bookmarklet and paste them in the file
4. Run ```npm run scrape```
5. Results are merged with ```input/fake-stores.txt```, debug information in ```results``` folder

## Bookmarklet
Easily copy every link on a Google search results page that doesnt contain "google"

1. Copy the code from [bookmarklet_copy_urls.js](https://github.com/doomnoodles/estonian-spam-list/blob/main/bookmarklet_copy_urls.js) or [bookmarklet_copy_hosts.js](https://github.com/doomnoodles/estonian-spam-list/blob/main/bookmarklet_copy_hosts.js)
2. Create a new bookmark in your browser. In the URL field, type  ```javascript:``` and then right after that paste the code

## TODO
- [ ] Improve workflow/reliability