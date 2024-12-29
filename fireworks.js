class Fireworks {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particles = [];
        this.fireworkTrails = [];
        this.setup();
    }

    setup() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    start() {
        this.running = true;
        this.loop();
    }

    stop() {
        this.running = false;
    }

    loop() {
        if (!this.running) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }

    update() {
        // Add new fireworks
        if (Math.random() < 0.2) { // Increased frequency
            this.fireworkTrails.push(this.createFirework());
        }

        // Update firework trails
        this.fireworkTrails.forEach((fw) => {
            fw.y -= fw.vy;
            if (fw.y <= fw.explodeHeight) {
                this.createExplosion(fw.x, fw.y);
                fw.exploded = true;
            }
        });

        // Remove exploded fireworks
        this.fireworkTrails = this.fireworkTrails.filter((fw) => !fw.exploded);

        // Update particles
        this.particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02; // Gravity
            p.alpha -= 0.01;
        });

        // Remove faded particles
        this.particles = this.particles.filter((p) => p.alpha > 0);
    }

    render() {
        // Render firework trails
        this.fireworkTrails.forEach((fw) => {
            this.ctx.globalAlpha = 1;
            this.ctx.beginPath();
            this.ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = fw.color;
            this.ctx.fill();
        });

        // Render particles
        this.particles.forEach((p) => {
            this.ctx.globalAlpha = p.alpha;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        });
    }

    createFirework() {
        const x = Math.random() * this.width;
        const y = this.height;
        const explodeHeight = Math.random() * this.height * 0.5 + this.height * 0.2;
        const vy = Math.random() * 3 + 2;
        const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        return { x, y, vy, explodeHeight, color, exploded: false };
    }

    createExplosion(x, y) {
        const particleCount = 50; // More particles for each explosion
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 3 + 1;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const size = Math.random() * 3 + 1;
            const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
            const alpha = 1;
            this.particles.push({ x, y, vx, vy, size, color, alpha });
        }
    }
}
