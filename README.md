# MMM-Fireworks

Example:

![Example of MMM-Fireworks](./MMM-Fireworks.png)

The MMM-Fireworks module brings a visually stunning fireworks display to your MagicMirror, designed to celebrate special occasions. 
The fireworks animation runs best in the fullscreen_above region, creating an immersive experience.
The start time and duration of the display are configurable via the config.js file.

## Installation

### Install

In your terminal, go to your [MagicMirror²][mm] Module folder and clone MMM-Fireworks:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/ChrisF1976/MMM-Fireworks.git
```

not needed but doesn't hurt: 
```bash
cd ~/MagicMirror/modules/MMM-Fireworks
npm install
```

### Update

```bash
cd ~/MagicMirror/modules/MMM-Fireworks
git pull
```

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```js
{
    module: "MMM-Fireworks",
    position: "fullscreen_above", // Required
    config: {
        startDateTime: "2024-12-31T23:59:59", // ISO format for the start time
        duration: 1*60*60*1000, // Duration in milliseconds (e.g., 1 hour)
    }
},
```

## Configuration options

Option|Possible values|Default|Description
------|---------------|-------|-----------
`startDateTime`|`string`|none|API key for authenticating requests to the event service. Get yours on https://serpapi.com.
`query`|`string`|`"Veranstaltungen Braunschweig"`|The search query for fetching events. Modify it to match the events you're looking for.
`location`|`string`|`"Germany"`|Location to restrict the event search to.
`updateInterval`|`integer`|`12*60*60*1000`|Interval (in milliseconds) for automatically refreshing the events list.
`hl`|`string`|`"de"`|Language for search results. Set it to the desired language code (e.g., `"en"` for English).
`gl`|`string`|`"de"`|Geolocation for search. Set it to the desired country code (e.g., `"us"` for the United States).
`googleDomain`|`string`|`"google.de"`|The Google domain to use for event search.
`moduleWidth`|`string`|`"400px"`|Configurable width for the module. You can adjust it to fit your layout.


## Credits
- Open AI
- my wife :-)

[mm]: https://github.com/MagicMirrorOrg/MagicMirror
