## How to use it

1. Add your LinkedIN credentials to a .env

```env
- LINKEDIN_EMAIL
- LINKEDIN_PASSWORD=
```

2. Run `pnpm install` (pnpm is faster, but you can use npm/yarn)
3. Exec the parser with your filters

```bash
    node index.js date=pastWeek location=Brazil searchTerm=nodejsANDreact modality=remote
```

- \*`searchTerm`: string. you can use conditions `AND`, `&&`, `OR`, `||`. there can't be spaces between the terms.
- \*`location`: string
- `date`: one of "last24Hours", "pastWeek" or "pastMonth"
- `modality`: one of "hybrid", "onSite" or "remote"

ps: items that start with `*` are required.

After executing, scraping starts, executing in order:

1. [Sign in]
2. [Open "Jobs" page with all the filters applied, including pagination]
3. Go through each job details, parse every single one of them until the end of the page;
4. Once a page is done, we apply offset+25 to the filters, going to the next page, going back to step 2;
5. Once all pages are done, script ends;

You will see a browser opening, signing in to LinkedIn, going to the jobs page with the filters you provided and going through each job and after going through all jobs within a page, it stores all jobs to a .json.
