# estonian-spam-list
An adblock list and a hostsfile containing spammy estonian sites.

Add new entries to relevant files in the ```hosts``` directory.

[Click here to subscribe to the list](https://subscribe.adblockplus.org/?location=https://raw.githubusercontent.com/doomnoodles/estonian-spam-list/main/sites.txt&title=Estonian%20spam-sites%20list)

## How to compile the lists

1. (only once) Execute ```npm install```
2. Execute ```npm run compile```
3. Results are stored in ```hosts.txt``` and ```sites.txt```

## Aliexpress detection workflow
It is possible to detect if sites redirect to aliexpress and automatically add them to the list

1. (only once) Execute ```npm install```
2. Create a file named ```unverified_links.txt```
3. Gather links from google using the bookmarklet and paste them in the file or write one url per line manually
4. Execute ```npm run aliexpress```
5. Run results are in the ```results``` folder, and the results are merged with ```hosts/aliexpress.txt```

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