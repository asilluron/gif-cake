# gif-cake
Super fast gifs powered by Giphy. Filter lists, favorites and more.

## Usage
* Mac: 'cmd' + 'alt' + 'g'

## Development
It is recommended that you use Node ^v6 when building the project. The project dev build runs using a public Giphy beta key.

* Rename `config.example.js` to `config.js` in the `/app` folder
* ``` npm install ```
* ``` webpack ```
* ``` gulp ```

### Token module (collaborators only)
First ensure that you are using the EXACT same version of node as the nwjs version is using. (Currently 6.7.0)
``` npm install -g node-gyp ```
``` cd token ```
``` node-gyp configure ```
``` node-gyp build ```
``` cd ../ ```
``` gulp setup:token ```

### Deploy
``` npm run build ```
``` gulp ```

## Release
``` gulp compress-tar ```


