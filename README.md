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

## Features

### Fireworks Animation:
A vibrant and dynamic fireworks effect with colorful explosions and particle trails.
Animations simulate real fireworks with gravity, random directions, and fading effects.
### Configurable Start Time:
Trigger the fireworks display at a specific date and time, e.g., for New Year's Eve celebrations.
### Customizable Duration:
Define how long the fireworks animation runs.
### Full-Screen Display:
The module occupies the entire screen (fullscreen_above region) for maximum impact.
### No Sound:
Focuses purely on the visual effect, ideal for quiet celebrations.
### Responsive Design:
Automatically adjusts to the screen size and aspect ratio.



## Configuration options

Option|Possible values|Default|Description
------|---------------|-------|-----------
`startDateTime`|`string`|"2024-12-31T23:59:00"|Define the start time for the effect.
`duration`|`integer`|`1*60*60*1000`|Interval (in milliseconds) for animation. 1 hour in this example.

## How It Works

- The module listens for the specified startDateTime and triggers the fireworks display.
- Firework particles are generated using a canvas element with dynamic physics for lifelike effects.
- After the specified duration, the display automatically stops and clears the screen.

### Technical Details

- Rendering: Utilizes the HTML5 <canvas> element for smooth and efficient animations.
- Customization: Adjust parameters like particle count, explosion size, and firework frequency in the JavaScript file (fireworks.js).
- Dependencies: None required; the module uses native browser capabilities.

## Use Case

Perfect for occasions like:

- New Year's Eve: Kick off the new year with an exciting visual treat.
- Birthdays or Anniversaries: Highlight special moments with colorful displays.
- National Holidays: Celebrate with virtual fireworks that light up your MagicMirror.

## Credits
- Open AI
- my wife :-)

[mm]: https://github.com/MagicMirrorOrg/MagicMirror
