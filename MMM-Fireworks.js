Module.register("MMM-Fireworks", {
  defaults: {
    startDateTime: "2025-12-31T23:59:30", // ISO format start time
    duration: 6 * 60 * 60 * 1000,          // Duration in milliseconds (6 hours)
    // p5 Fireworks settings:
    fireworkSpawnChance: 0.5,              // Chance each frame to spawn a new firework
    explosionParticleCount: 40,            // Number of particles per explosion
    // Display settings:
    fullscreen: true,                      // If false, use the defined width/height.
    width: "400px",
    height: "500px",
    // Velocity settings for rocket particles:
    magnitude_high: -19,
    magnitude_low: -8,
    // Trailing effect transparency (alpha value for background):
    transparency: 10,
    // New canvas opacity (0.0 = fully transparent, 1.0 = fully opaque)
    canvasOpacity: 0.5,
    // Module management settings:
    disableAllModules: true,               // Set to false so other modules remain visible.
    keepModules: [],                       // Array of module names to keep active.
    // Text overlay:
    text: "Happy New Year!"
  },

  start: function () {
    this.fireworksActive = false;
    this.disabledModules = [];
    this._p5Instance = null;
  },

  // Create the module's container.
  // If fullscreen is true, force full screen; otherwise use the defined width/height.
  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.id = "fireworksContainer";
    if (this.config.fullscreen) {
      wrapper.style.position = "fixed";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      wrapper.style.width = "100vw";
      wrapper.style.height = "100vh";
      wrapper.style.zIndex = "9999";
      wrapper.style.background = "transparent";
    } else {
      wrapper.style.position = "relative";
      wrapper.style.width = this.config.width;
      wrapper.style.height = this.config.height;
    }
    
    // Create and append the text overlay element (initially hidden).
    if (this.config.text) {
      const textDiv = document.createElement("div");
      textDiv.id = "fireworksText";
      textDiv.className = "fireworks-text";
      textDiv.innerHTML = this.config.text;
      textDiv.style.display = "none"; // Hidden by default; shown during fireworks.
      wrapper.appendChild(textDiv);
    }
    
    return wrapper;
  },

  notificationReceived: function (notification, payload, sender) {
    if (notification === "DOM_OBJECTS_CREATED") {
      this.scheduleFireworks();
    }
  },

  scheduleFireworks: function () {
    const MAX_DELAY = 2147483647; // Maximum delay in ms (~24.8 days)
    const startTime = new Date(this.config.startDateTime).getTime();
    const currentTime = Date.now();
    const duration = this.config.duration;

    if (currentTime < startTime) {
      let delay = startTime - currentTime;
      if (delay > MAX_DELAY) {
        setTimeout(() => this.scheduleFireworks(), MAX_DELAY);
      } else {
        setTimeout(() => this.startFireworks(), delay);
      }
    } else if (currentTime < startTime + duration) {
      this.startFireworks();
    } else {
      console.warn("Fireworks time window has already passed.");
    }
  },

  startFireworks: function () {
    this.fireworksActive = true;
    const container = document.getElementById("fireworksContainer");
    container.classList.add("fullscreen");
    
    // Show the text overlay during the fireworks period.
    const textDiv = document.getElementById("fireworksText");
    if (textDiv) {
      textDiv.style.display = "block";
    }
    
    // Do not hide other modules if disableAllModules is false.
    if (this.config.disableAllModules) {
      this.deactivateAndHideModules();
    }
    
    this.initializeP5();
    setTimeout(() => {
      this.stopFireworks();
    }, this.config.duration);
  },

  stopFireworks: function () {
    if (this._p5Instance) {
      this._p5Instance.remove();
      this._p5Instance = null;
    }
    const container = document.getElementById("fireworksContainer");
    container.innerHTML = "";
    this.fireworksActive = false;
    if (this.config.disableAllModules) {
      this.reactivateAndShowModules();
    }
  },

  deactivateAndHideModules: function () {
    const self = this;
    MM.getModules().enumerate(function (module) {
      if (
        module.name !== "MMM-Fireworks" &&
        self.config.keepModules.indexOf(module.name) === -1
      ) {
        console.log("Hiding module: " + module.name);
        module.hide(500, () => {});
        if (module.suspend) {
          module.suspend();
        }
        self.disabledModules.push(module);
      }
    });
  },

  reactivateAndShowModules: function () {
    const self = this;
    this.disabledModules.forEach(function (module) {
      console.log("Showing module: " + module.name);
      module.show(500, () => {});
      if (module.resume) {
        module.resume();
      }
    });
    this.disabledModules = [];
  },

  // Integrated p5.js fireworks sketch.
  initializeP5: function () {
    if (this._p5Instance) return;
    const self = this;
    const config = this.config;
    this._p5Instance = new p5(function (p) {
      let fireworks = [];
      let gravity;
      // Optional: clear the canvas fully every 2 minutes to remove ghost trails.
      setInterval(function () {
        console.log("Performing full redraw (clear) every 2 minutes.");
        p.clear();
      }, 2 * 60 * 1000);
      
      p.setup = function () {
        const container = document.getElementById("fireworksContainer");
        p.createCanvas(container.offsetWidth, container.offsetHeight);
        // Set the canvas opacity to the configured value.
        p.canvas.style.opacity = config.canvasOpacity;
        p.colorMode(p.HSB, 255);
        gravity = p.createVector(0, 0.2);
        p.background(0);
      };
      
      p.draw = function () {
        // Use a semi-transparent background for the trailing effect.
        p.background(0, 0, 0, config.transparency);
        
        // Spawn a new firework with the specified probability.
        if (p.random(1) < config.fireworkSpawnChance) {
          fireworks.push(new Firework(p, gravity, config.explosionParticleCount));
        }
        
        // Update and render fireworks.
        for (let i = fireworks.length - 1; i >= 0; i--) {
          fireworks[i].update();
          fireworks[i].show();
          if (fireworks[i].done()) {
            fireworks.splice(i, 1);
          }
        }
      };
      
      // --- Particle Class ---
      class Particle {
        constructor(p, x, y, hu, isFirework) {
          this.p = p;
          this.pos = p.createVector(x, y);
          this.isFirework = isFirework;
          if (this.isFirework) {
            // Rocket's upward velocity based on config values.
            this.vel = p.createVector(0, p.random(config.magnitude_high, config.magnitude_low));
          } else {
            this.vel = p5.Vector.random2D();
            this.vel.mult(p.random(2, 10));
          }
          this.acc = p.createVector(0, 0);
          this.lifespan = 255;
          this.hu = hu;
        }
        applyForce(force) {
          this.acc.add(force);
        }
        update() {
          if (!this.isFirework) {
            this.vel.mult(0.9);
            this.lifespan -= 4;
          }
          this.vel.add(this.acc);
          this.pos.add(this.vel);
          this.acc.mult(0);
        }
        done() {
          return this.lifespan < 0;
        }
        show() {
          this.p.strokeWeight(this.isFirework ? 4 : 2);
          this.p.stroke(this.hu, 255, 255, this.lifespan);
          this.p.point(this.pos.x, this.pos.y);
        }
      }
      
      // --- Firework Class ---
      class Firework {
        constructor(p, gravity, explosionCount) {
          this.p = p;
          this.hu = p.random(255);
          this.firework = new Particle(p, p.random(p.width), p.height, this.hu, true);
          this.exploded = false;
          this.particles = [];
          this.gravity = gravity;
          this.explosionCount = explosionCount;
        }
        done() {
          return this.exploded && this.particles.length === 0;
        }
        update() {
          if (!this.exploded) {
            this.firework.applyForce(this.gravity);
            this.firework.update();
            if (this.firework.vel.y >= 0) {
              this.exploded = true;
              this.explode();
            }
          }
          for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].applyForce(this.gravity);
            this.particles[i].update();
            if (this.particles[i].done()) {
              this.particles.splice(i, 1);
            }
          }
        }
        explode() {
          for (let i = 0; i < this.explosionCount; i++) {
            let particle = new Particle(this.p, this.firework.pos.x, this.firework.pos.y, this.hu, false);
            this.particles.push(particle);
          }
        }
        show() {
          if (!this.exploded) {
            this.firework.show();
          }
          for (let particle of this.particles) {
            particle.show();
          }
        }
      }
    }, document.getElementById("fireworksContainer"));
  },
  
  getStyles: function () {
    return ["MMM-Fireworks.css"];
  },
  
  getScripts: function () {
    return ["https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.min.js"];
  },
});
