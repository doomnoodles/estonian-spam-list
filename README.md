# estonian-spam-list
Adblock filter list + hostsfile for blocking spammy estonian sites.

Sites in the list mostly fall under the following categories:
1. Fake web-stores (which usually redirect to aliexpress)
2. Autotranslated SEO sites
3. Phishing / malware / notifications

[Click here to subscribe to the list](https://subscribe.adblockplus.org/?location=https://raw.githubusercontent.com/doomnoodles/estonian-spam-list/main/output/sites.txt&title=Estonian%20spam-sites%20list)

## Contributing
Easy: Just make a pull request with links that should be added to the list.

Technical:
1. Add new entries to relevant files in the ```input``` directory.
2. (optional, requires nodejs) Compile the list, results are in ```output``` folder.
```sh
npm install
npm run sort
npm run compile
```

## Aliexpress detection workflow
It is possible to detect if sites redirect to aliexpress and automatically add them to the list

1. (only once) Execute ```npm install```
2. Create a file named ```unverified_links.txt```
3. Gather links from google using the bookmarklet and paste them in the file or write one url per line manually
4. Execute ```npm run scrape```
5. Run results are in the ```results``` folder, and the results are merged with ```input/fake-stores.txt```

## Bookmarklet
Easily copy every link on a Google search results page that doesnt contain "google"

1. Copy the code from [bookmarklet_copy_urls.js](https://github.com/doomnoodles/estonian-spam-list/blob/main/bookmarklet_copy_urls.js) or [bookmarklet_copy_hosts.js](https://github.com/doomnoodles/estonian-spam-list/blob/main/bookmarklet_copy_hosts.js)
2. Create a new bookmark in your browser. In the URL field, type  ```javascript:``` and then right after that paste the code

## TODO
- [x] Bookmarklet to copy all links from a google search page
- [x] Script to check where the links go
- [ ] Improve workflow/reliability
- [x] Sites that look like et.xxxx.info should be made into a list that can be manually reviewed
- [x] Whitelist site if host contains aliexpress
- [ ] Better suspicious site detector
  - [ ] too many ```<link rel="alternative">```s in head
  - [ ] non .ee domain if the search term is in estonian(especially .ru and .org)
  - [ ] asks notification permission
  - [ ] sales@xxx.xx email on page or any other non estonian emails
  - [ ] social buttons lead to the homepage of respective social media platform or nowhere