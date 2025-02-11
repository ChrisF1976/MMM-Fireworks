Module.register("MMM-Fireworks", {
  defaults: {
    // Scheduling: an array of event objects with a start time and text message.
    startDateTime: [
      { time: "2025-02-09T07:00:00", text: "Happy Birthday, Homer!" },
      { time: "2025-10-03T07:00:00", text: "Happy Birthday, Lisa!" },
      { time: "2025-12-31T23:59:55", text: "Happy New Year to my Simpsons!" }
    ],
    duration: 6 * 60 * 60 * 1000, // Duration in milliseconds (6 hours)
    // p5 Fireworks settings:
    fireworkSpawnChance: 0.5,
    explosionParticleCount: 40,
    // Display settings:
    fullscreen: true,          // If false, use defined width/height.
    width: "400px",
    height: "500px",
    // Velocity settings for rocket particles:
    magnitude_high: -19,
    magnitude_low: -8,
    // Trailing effect transparency:
    transparency: 10,
    canvasOpacity: 0.5,
    // Module management:
    disableAllModules: false,
    keepModules: ["clock"],
    // Notification triggers:
    NotificationStart: "FireFireFire",
    NotificationStop: "StopFire",
    textNotification: "Fire!", //used if no text is received from notification
    // Default text for scheduled events (usually not needed):
    text: "Happy New Year!"
  },

  start: function () {
    this.fireworksActive = false;
    this.disabledModules = [];
    this._p5Instance = null;
    this.durationTimer = null; // Added to track the duration timer
  },

  // Create the module's container.
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
      wrapper.style.pointerEvents = "none";
    } else {
      wrapper.style.position = "relative";
      wrapper.style.width = this.config.width;
      wrapper.style.height = this.config.height;
    }
    
    // Create and append the text overlay element.
    if (this.config.text) {
      const textDiv = document.createElement("div");
      textDiv.id = "fireworksText";
      textDiv.className = "fireworks-text";
      textDiv.innerHTML = this.config.text;
      textDiv.style.display = "none"; // initially hidden
      wrapper.appendChild(textDiv);
    }
    
    return wrapper;
  },

  notificationReceived: function (notification, payload, sender) {
    if (notification === "DOM_OBJECTS_CREATED") {
      this.scheduleAllEvents();
    } else if (notification === this.config.NotificationStart) {
      var txt = (payload && payload.text) ? payload.text : this.config.textNotification;
      console.log("Received start notification: " + notification + " with text: " + txt);
      this.startFireworks(txt);
    } else if (notification === this.config.NotificationStop) {
      if (this.fireworksActive) {
        console.log("Received stop notification: " + notification);
        this.stopFireworks();
      } else {
        console.log("Received stop notification, but fireworks are not active. Ignoring.");
      }
    }
  },

  // Schedule each event from the startDateTime array.
  scheduleAllEvents: function () {
    const schedules = Array.isArray(this.config.startDateTime)
      ? this.config.startDateTime
      : [{ time: this.config.startDateTime, text: this.config.text }];
    const currentTime = Date.now();
    const duration = this.config.duration;
    const MAX_DELAY = 2147483647; // ~24.8 days in milliseconds
    const self = this;
    schedules.forEach(schedule => {
      const eventTime = new Date(schedule.time).getTime();
      let delay = eventTime - currentTime;
      if (delay < 0) {
        if (currentTime < eventTime + duration) {
          self.startFireworks(schedule.text);
        }
      } else {
        if (delay > MAX_DELAY) {
          setTimeout(() => self.scheduleAllEvents(), MAX_DELAY);
        } else {
          setTimeout(() => self.startFireworks(schedule.text), delay);
        }
      }
    });
  },

  // Start fireworks with the given text.
  startFireworks: function (text) {
    // If fireworks are already active, stop them first.
    if (this.fireworksActive) {
      this.stopFireworks();
    }
    const container = document.getElementById("fireworksContainer");
    container.classList.add("fullscreen");
    let textDiv = document.getElementById("fireworksText");
    if (!textDiv && this.config.text) {
      textDiv = document.createElement("div");
      textDiv.id = "fireworksText";
      textDiv.className = "fireworks-text";
      container.appendChild(textDiv);
    }
    if (textDiv) {
      textDiv.innerHTML = text || this.config.text;
      textDiv.style.display = "block";
    }
    this.fireworksActive = true;
    if (this.config.disableAllModules) {
      this.deactivateAndHideModules();
    }
    this.initializeP5();
    // Store the duration timer so we can clear it later.
    this.durationTimer = setTimeout(() => {
      this.stopFireworks();
    }, this.config.duration);
  },

  stopFireworks: function () {
    // Clear any pending duration timer.
    if (this.durationTimer) {
      clearTimeout(this.durationTimer);
      this.durationTimer = null;
    }
    if (this._p5Instance) {
      this._p5Instance.remove();
      this._p5Instance = null;
    }
    const container = document.getElementById("fireworksContainer");
    container.innerHTML = "";
    if (this.config.text) {
      const textDiv = document.createElement("div");
      textDiv.id = "fireworksText";
      textDiv.className = "fireworks-text";
      textDiv.innerHTML = this.config.text;
      textDiv.style.display = "none";
      container.appendChild(textDiv);
    }
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
      setInterval(function () {
        console.log("Performing full redraw (clear) every 2 minutes.");
        p.clear();
      }, 2 * 60 * 1000);
      
      p.setup = function () {
        const container = document.getElementById("fireworksContainer");
        p.createCanvas(container.offsetWidth, container.offsetHeight);
        p.canvas.style.opacity = config.canvasOpacity;
        p.colorMode(p.HSB, 255);
        gravity = p.createVector(0, 0.2);
        p.background(0);
        p.canvas.style.pointerEvents = "none";
      };
      
      p.draw = function () {
        p.background(0, 0, 0, config.transparency);
        if (p.random(1) < config.fireworkSpawnChance) {
          fireworks.push(new Firework(p, gravity, config.explosionParticleCount));
        }
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
  }
});
