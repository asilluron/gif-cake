# gif-cake
Super fast gifs powered by Giphy.

## Usage
### Show Window
* `cmd` + `alt` + `g`
### Hide Window
* `esc`
### See More Results
* `tab`
### Go Back a Page in Results
* `delete`

### Search
Type a query and hit `enter`. Reset to search by pressing A-Z

### Copy a Gif to Clipboard
Click on a gif image

## Development

### Prerequisites
* Node.js 22+
* npm 10+

### Setup
```sh
npm install
cp env-example .env
# Edit .env and set your VITE_GIPHY_TOKEN
```

### Running locally
```sh
npm start
```

### Building / Packaging
```sh
npm run package   # creates unpacked app
npm run make      # creates distributable (dmg, zip)
```

### Environment Variables
| Variable | Purpose |
|---|---|
| `VITE_GIPHY_TOKEN` | Giphy API key (required) |
| `APPLEID` | Apple ID for notarization (optional, release only) |
| `APPLEIDPASS` | App-specific password for notarization |
| `ASCPROVIDER` | Apple Team ID for notarization |

### Tech Stack
* **Electron 35** — macOS 26 compatible
* **React 18** with TypeScript 5
* **MUI (Material UI) v6**
* **Vite 5** via Electron Forge
* **axios-hooks 5** for Giphy API calls
