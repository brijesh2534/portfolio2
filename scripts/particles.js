class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.connections = [];
        
        this.resize();
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        const particleCount = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mousePosition.x = -1000;
            this.mousePosition.y = -1000;
        });
    }
    
    update() {
        // Update particles
        this.particles.forEach(particle => {
            particle.update(this.canvas.width, this.canvas.height, this.mousePosition);
        });
        
        // Update connections
        this.connections = [];
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const distance = this.getDistance(this.particles[i], this.particles[j]);
                if (distance < 120) {
                    this.connections.push({
                        start: this.particles[i],
                        end: this.particles[j],
                        opacity: 1 - (distance / 120)
                    });
                }
            }
        }
    }
    
    draw() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(connection => {
            this.ctx.beginPath();
            this.ctx.moveTo(connection.start.x, connection.start.y);
            this.ctx.lineTo(connection.end.x, connection.end.y);
            this.ctx.strokeStyle = `rgba(0, 191, 255, ${connection.opacity * 0.2})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            particle.draw(this.ctx);
        });
        
        // Draw mouse effect
        if (this.mousePosition.x > 0 && this.mousePosition.y > 0) {
            this.ctx.beginPath();
            this.ctx.arc(this.mousePosition.x, this.mousePosition.y, 50, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 191, 255, 0.03)';
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(this.mousePosition.x, this.mousePosition.y, 50, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(0, 191, 255, 0.1)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.reset(canvasWidth, canvasHeight);
        this.size = Math.random() * 3 + 1;
        this.baseSize = this.size;
        this.density = Math.random() * 30 + 1;
    }
    
    reset(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.003;
    }
    
    update(canvasWidth, canvasHeight, mouse) {
        // Basic movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Mouse interaction
        const mouseDistance = Math.sqrt(Math.pow(this.x - mouse.x, 2) + Math.pow(this.y - mouse.y, 2));
        if (mouseDistance < 100) {
            const force = (100 - mouseDistance) / 100;
            const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
            this.vx += Math.cos(angle) * force * 0.01;
            this.vy += Math.sin(angle) * force * 0.01;
            this.size = this.baseSize + force * 2;
        } else {
            this.size = this.baseSize;
        }
        
        // Apply drag
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // Boundary collision
        if (this.x < 0 || this.x > canvasWidth) {
            this.vx *= -0.8;
            this.x = Math.max(0, Math.min(canvasWidth, this.x));
        }
        if (this.y < 0 || this.y > canvasHeight) {
            this.vy *= -0.8;
            this.y = Math.max(0, Math.min(canvasHeight, this.y));
        }
        
        // Life cycle
        this.life -= this.decay;
        if (this.life <= 0) {
            this.reset(canvasWidth, canvasHeight);
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Create gradient
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(0, 191, 255, ${this.life * 0.8})`);
        gradient.addColorStop(0.5, `rgba(100, 255, 218, ${this.life * 0.4})`);
        gradient.addColorStop(1, `rgba(0, 191, 255, 0)`);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00BFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 191, 255, ${this.life * 0.3})`;
        ctx.fill();
        
        ctx.restore();
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('particles-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
    });
}