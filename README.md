# MMM-Fireworks

Example:

![Example of MMM-Fireworks](./MMM-Fireworks.mov)

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
            startDateTime: "2025-12-31T23:59:30", // ISO format start time
            duration: 6 * 60 * 60 * 1000,          // Duration in milliseconds (6 hours)
            // p5 Fireworks settings:
            fireworkSpawnChance: 0.2,              // Chance each frame to spawn a new firework - adjust carefuly beased on your hardware
            explosionParticleCount: 30,            // Number of particles per explosion - adjust carefuly beased on your hardware
            // Display settings:
            fullscreen: false,                     // If false, use the defined width/height.
            width: "400px",
            height: "500px",
            // Velocity settings for rocket particles:
            magnitude_high: -25,                    //adjust to your screen size. Try a little.
            magnitude_low: -8,                      //adjust to your screen size. Try a little.
            // Trailing effect transparency (alpha value for background):
            transparency: 60,                       //min: 0 max: 255 - best is around 50 for a nice effect
            // Module management settings:
            disableAllModules: true,                // If true, hide all other modules during fireworks. No visible effect in fullscreen.
            keepModules: [""],                      // Array of module names to keep active (e.g., "clock")
            // Text overlay:
            text: "Happy New Year!",
            },
},
```

## Features

### Schedules the Display: 
Starts the fireworks effect at a configured date and time for a specified duration.
### Customizable Appearance:
Allows you to adjust parameters such as rocket velocity, explosion particle count, and trailing transparency.
### Flexible Layout:
Can run in full-screen mode or within defined dimensions.
### Module Management:
Optionally hides other modules during the fireworks display (with exceptions you can configure).
### Text Overlay:
Displays customizable overlay text (e.g., "Happy New Year!") with CSS-controlled styling and positioning.

## Configuration options

| Parameter              | Type                     | Default Value                      | Description          |
|------------------------|--------------------------|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `startDateTime`        | String (ISO date)        | `"2025-12-31T23:59:30"`             | The date and time when the fireworks should start. The module checks this value against the current time to decide when to launch the fireworks effect.     |
| `duration`             | Number (milliseconds)    | `6 * 60 * 60 * 1000` (6 hours)       | The length of time (in milliseconds) that the fireworks effect will remain active after it starts.                                                            |
| `fireworkSpawnChance`  | Number (0–1)             | `0.5`                              | The probability that a new firework is spawned on each frame of the p5.js sketch. A higher value means more frequent fireworks.                             |
| `explosionParticleCount` | Number                 | `40`                               | The number of particles generated when a firework (rocket) explodes. Increasing this value will create a denser explosion effect.                           |
| `fullscreen`           | Boolean                  | `false`                            | If set to `true`, the module’s container will cover the entire viewport. If `false`, it will use the dimensions defined by `width` and `height`.            |
| `width`                | String                   | `"400px"`                          | The width of the module’s container when `fullscreen` is `false`.                                                                                           |
| `height`               | String                   | `"500px"`                          | The height of the module’s container when `fullscreen` is `false`.                                                                                          |
| `magnitude_high`       | Number                   | `-19`                              | The higher (more negative) bound for the initial upward velocity of the rocket particles. Determines how fast they launch upward.                           |
| `magnitude_low`        | Number                   | `-8`                               | The lower (less negative) bound for the initial upward velocity of the rocket particles. Determines the slowest upward speed before explosion.              |
| `transparency`         | Number (0–255)           | `10`                               | The alpha value used in the `p.background()` call to create the trailing effect. Lower values mean the background is more transparent.                      |
| `disableAllModules`    | Boolean                  | `true`                             | If set to `true`, all other modules (except those specified in `keepModules`) will be hidden (and suspended) during the fireworks effect.                  |
| `keepModules`          | Array of Strings         | `["clock"]`                        | A list of module names that should remain active even when `disableAllModules` is `true`. For example, if you want to keep a clock module visible, list its name here. |
| `text`                 | String                   | `"Happy New Year!"`                | The text that will be overlaid on the module during the fireworks period. Its styling (font, size, color, position) is controlled via the CSS file.         |


## Use Case
Perfect for occasions like:
- New Year's Eve: Kick off the new year with an exciting visual treat.
- Birthdays or Anniversaries: Highlight special moments with colorful displays.
- National Holidays: Celebrate with virtual fireworks that light up your MagicMirror.

## Credits
- Open AI
- my wife :-)

[mm]: https://github.com/MagicMirrorOrg/MagicMirror
