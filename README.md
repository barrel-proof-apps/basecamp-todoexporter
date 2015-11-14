# basecamp-todoexporter

this tool is useful for creating a csv that you can then import into whatever you want.  all you need is to specify the following:

* accountId (from your bascamp url) ex: 9999999
* projectId (from your bascamp url) ex: 1111111
* username (for basecamp) ex: u
* password (for basecamp) ex: p
* userAgent - needed by bascamp for all requests ex: Myapp (http://barrelproofapps.com)

this will stream a csv to stdout with the following columns:

* theme (maps to todo list)
* story (todo name)
* todoUrl (basecamp url)

installation

    npm install -g basecamp-todoexporter

usage:

    bcexporter --accountId 9999999 --projectId 1111111  --username u --password p --userAgent "Myapp (http://barrelproofapps.com)"

or save to a csv on your system (ex: estimates.csv):

    bcexporter --accountId 9999999 --projectId 1111111  --username u --password p --userAgent "Myapp (http://barrelproofapps.com)" > estimates.csv
