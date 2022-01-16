# estonian-spam-list
Spammy estonian sites adblock list

[Click here to subscribe to the list](https://subscribe.adblockplus.org/?location=https://raw.githubusercontent.com/doomnoodles/estonian-spam-list/main/sites.txt&title=Estonian%20spam-sites%20list)

## Google bookmarklet
Easily copy every link on a Google search results page that doesnt contain "google"

1. Copy the code from [bookmarklet_google.js](https://github.com/doomnoodles/estonian-spam-list/blob/main/bookmarklet_google.js)
2. Create a new bookmark in your browser. In the URL field, type  ```javascript:``` and then right after that paste the code

## Workflow

1. Execute ```npm install```
2. Create a file named ```unverified_links.txt```
3. Gather links from google using the bookmarklet and paste them in the file or write one url per line manually
4. Execute ```npm run verify```
5. Results are in the ```results``` folder
6. Use some list deduplicating tool to merge with ```sites.txt```

## TODO
- [x] Bookmarklet to copy all links from a google search page
- [x] Script to check where the links go
- [ ] Improve workflow/reliability
