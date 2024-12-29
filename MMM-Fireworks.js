Module.register("MMM-Fireworks", {
    defaults: {
        startDateTime: "2024-12-31T23:59:00", // ISO format
        duration: 60000, // Duration in milliseconds (e.g., 1 minute)
    },

    start: function () {
        this.fireworksActive = false;
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

        const fireworks = new Fireworks(canvas);
        fireworks.start();

        setTimeout(() => {
            this.stopFireworks(fireworks, container);
        }, this.config.duration);
    },

    stopFireworks: function (fireworks, container) {
        fireworks.stop();
        container.innerHTML = ""; // Clear the canvas
        this.fireworksActive = false;
    },

    getStyles: function () {
        return ["MMM-Fireworks.css"];
    },

    getScripts: function () {
        return ["fireworks.js"];
    }
});
