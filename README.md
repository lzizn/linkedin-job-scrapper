1. Add your LinkedIN credentials to a .env

LINKEDIN_EMAIL
LINKEDIN_PASSWORD=

2. Run `npm install`
3. Exec the parser with your filters

`node index.js date=pastWeek location=Brazil searchTerm=nodejsANDreact modality=remote`

- `date`: one of "last24Hours", "pastWeek" or "pastMonth"
- `modality`: one of "hybrid", "onSite" or "remote"
- \*`searchTerm`: string. you can use conditions `AND`, `&&`, `OR`, `||`. there can't be spaces between the terms.
- \*`location`: string

ps: items that start with `*` are required.
