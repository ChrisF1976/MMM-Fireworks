Module.register("MMM-Fireworks", {
    defaults: {
        startDateTime: "2024-12-31T23:59:00", // ISO format
        duration: 60000, // Duration in milliseconds
    },

    start: function () {
        this.fireworksActive = false;
        this.disabledModules = [];
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.id = "fireworksContainer";
        return wrapper;
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            this.scheduleFireworks();
        }
    },

    scheduleFireworks: function () {
        const startTime = new Date(this.config.startDateTime).getTime();
        const currentTime = Date.now();
        const delay = startTime - currentTime;

        if (delay > 0) {
            setTimeout(() => this.startFireworks(), delay);
        } else {
            console.warn("Fireworks start time has already passed.");
        }
    },

    startFireworks: function () {
        this.fireworksActive = true;
        const container = document.getElementById("fireworksContainer");
        container.classList.add("fullscreen");

        const canvas = document.createElement("canvas");
        canvas.id = "fireworksCanvas";
        container.appendChild(canvas);

        this.deactivateAndHideModules(); // Suspend and hide modules

        const fireworks = new Fireworks(canvas, {
            maxRockets: 5,
            rocketSpawnInterval: 100,
            numParticles: 80,
        });
        fireworks.start();

        setTimeout(() => {
            this.stopFireworks(fireworks, container);
        }, this.config.duration);
    },

    stopFireworks: function (fireworks, container) {
        fireworks.stop();
        container.innerHTML = ""; // Clear the canvas
        this.fireworksActive = false;
        this.reactivateAndShowModules(); // Reactivate and show modules
    },

   deactivateAndHideModules: function () {
        MM.getModules().enumerate((module) => {
            if (module.name !== "MMM-Fireworks") {
                // Suspend the module if possible
                if (module.suspend) {
                    module.suspend();
                }
                // Hide the module with an empty callback function
                module.hide(500, () => {}); // Provide an empty callback function
                this.disabledModules.push(module);
            }
        });
    },

    reactivateAndShowModules: function () {
        this.disabledModules.forEach((module) => {
            // Resume the module if it was suspended
            if (module.resume) {
                module.resume();
            }
            // Show the module with an empty callback function
            module.show(500, () => {}); // Provide an empty callback function
        });
        this.disabledModules = []; // Clear the list
    },

    getStyles: function () {
        return ["MMM-Fireworks.css"];
    },

    getScripts: function () {
        return ["fireworks.js"];
    },
});
