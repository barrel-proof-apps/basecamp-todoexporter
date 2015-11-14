# basecamp-todoexporter

this tool is useful for creating a csv that you can then import into whatever you want.  all you need is to specify the following:

* accountId (from your bascamp url) ex: 9999999
* projectId (from your bascamp url) ex: 1111111
* username (for basecamp) ex: u
* password (for basecamp) ex: p

this will create a csv with the following columns:

* theme (maps to todo list)
* story (todo name)
* url (basecamp url)

installation

    npm install -g basecamp-todoexporter

usage:

    bcexporter --accountId 9999999 --projectId 1111111  --username u --password p > estimates-website.csv


