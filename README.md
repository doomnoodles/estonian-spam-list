# estonian-spam-list
Spammy estonian sites adblock list

This repository contains a script to automatically detect Aliexpress redirects and add them to ```hosts.txt```.
Its also possible to manually add entries to  ```hosts.txt```. 
NB: ```sites.txt``` is generated from ```hosts.txt``` and may not be edited.

[Click here to subscribe to the list](https://subscribe.adblockplus.org/?location=https://raw.githubusercontent.com/doomnoodles/estonian-spam-list/main/sites.txt&title=Estonian%20spam-sites%20list)

## Aliexpress detection workflow

1. Execute ```npm install```
2. Create a file named ```unverified_links.txt```
3. Gather links from google using the bookmarklet and paste them in the file or write one url per line manually
4. Execute ```npm run verify```
5. Run results are in the ```results``` folder, and have been merged with ```hosts.txt``` and ```sites.txt```

## Bookmarklet
Easily copy every link on a Google search results page that doesnt contain "google"

1. Copy the code from [bookmarklet_google.js](https://github.com/doomnoodles/estonian-spam-list/blob/main/bookmarklet_google.js)
2. Create a new bookmark in your browser. In the URL field, type  ```javascript:``` and then right after that paste the code

## TODO
- [x] Bookmarklet to copy all links from a google search page
- [x] Script to check where the links go
- [ ] Improve workflow/reliability
- [x] Sites that look like et.xxxx.info should be made into a list that can be manually reviewed
- [x] Whitelist site if host contains aliexpress