
![Witchcraft](docs/src/assets/title.png)

Witchcraft is a Google Chrome extension for loading custom JavaScript and CSS directly from a folder on your local machine, injecting them into web pages that match specified URL patterns.

It works by matching every page domain against script file names available in the scripts folder. For instance, if one navigates to `google.com`, Witchcraft will try to load and run `google.com.js` and `google.com.css`.

For more information on how to install and use it, head to Witchcraft's [home page](//luciopaiva.com/witchcraft).

# Development

See [here](./development.md).

# Enterprise Administration

Witchcraft supports managed configuration via Chrome enterprise policies. IT administrators can enforce the server address so that end users cannot change it.

## Policy Properties

| Property | Type | Description |
|---|---|---|
| `serverAddress` | `string` | The URL of the Witchcraft server to fetch scripts from. When set, the user cannot override this value. |

When a managed `serverAddress` policy is active, the popup UI shows a lock icon and disables the address input field.

## Deployment Methods

Replace `<EXTENSION_ID>` below with the actual Chrome Web Store extension ID (e.g., `YOUR_EXTENSION_ID_HERE`).

### Windows — Group Policy / Registry

Set the following registry key:

```
HKLM\SOFTWARE\Policies\Google\Chrome\3rdparty\extensions\<EXTENSION_ID>\policy\serverAddress
```

Value type: `REG_SZ`
Value data: `http://192.168.1.100:5743`

You can also deploy this via a `.reg` file:

```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\3rdparty\extensions\<EXTENSION_ID>\policy]
"serverAddress"="http://192.168.1.100:5743"
```

### Google Admin Console (Chrome Browser Cloud Management)

1. Navigate to **Devices → Chrome → Apps & extensions → Users & browsers**.
2. Find or add the Witchcraft extension by its ID.
3. Under **Policy for extensions**, enter the JSON:

```json
{
  "serverAddress": {
    "Value": "http://192.168.1.100:5743"
  }
}
```

### macOS — Managed Preferences

Create or update the property list file at:

```
/Library/Managed Preferences/com.google.Chrome.extensions.<EXTENSION_ID>.plist
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>serverAddress</key>
    <string>http://192.168.1.100:5743</string>
</dict>
</plist>
```

### Linux — JSON Policy File

Create or update the file:

```
/etc/opt/chrome/policies/managed/witchcraft.json
```

```json
{
  "3rdparty": {
    "extensions": {
      "<EXTENSION_ID>": {
        "serverAddress": "http://192.168.1.100:5743"
      }
    }
  }
}
```

### Verifying

After deploying the policy, open `chrome://policy` in the browser to confirm the policy is applied. The Witchcraft extension popup will show a lock icon next to the address field when the policy is active.

# Credits

Witchcraft is my rendition of [defunkt](//github.com/defunkt)'s original extension, [dotjs](//github.com/defunkt/dotjs).

Images in the logo were provided by [Freepik](//www.flaticon.com/authors/freepik).
