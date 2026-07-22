document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card');
    let currentIndex = 0;

    // Fungsi untuk memperbarui z-index dan posisi visual tumpukan kartu
    function updateStack() {
        cards.forEach((card) => {
            if (!card.classList.contains('swipe-out')) {
                let index = parseInt(card.getAttribute('data-index'));
                index = (index - currentIndex + cards.length) % cards.length;
                
                card.style.zIndex = cards.length - index;
                card.style.transform = `translateY(${index * 20}px) scale(${1 - index * 0.05})`;
            }
        });
    }

    // Interaksi klik pada kartu
    cards.forEach((card) => {
        card.addEventListener('click', function() {
            // Cek apakah kartu yang diklik adalah kartu teratas
            let index = parseInt(this.getAttribute('data-index'));
            let currentTopIndex = currentIndex % cards.length;

            if (index === currentTopIndex) {
                // Geser kartu keluar
                this.classList.add('swipe-out');
                currentIndex++;

                // Trigger ledakan confetti kecil saat ganti frame
                startConfetti(50); 
                
                updateStack();

                // Jika mencapai frame terakhir (Best wishes)
                if (currentIndex === cards.length - 1) {
                    setTimeout(() => {
                        startConfetti(300); // Ledakan besar
                    }, 400);
                }
            }
        });
    });
});

// --- LOGIKA ANIMASI CONFETTI ---
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const colors = ['#ff6b81', '#fbc2eb', '#a6c1ee', '#ffeb3b', '#4caf50', '#ff9a9e'];

function createConfetti(amount) {
    for (let i = 0; i < amount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            speedY: Math.random() * 4 + 2,
            speedX: Math.random() * 3 - 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * 360,
            rotSpeed: Math.random() * 5 - 2.5
        });
    }
}

function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        p.y += p.speedY;
        p.x += p.speedX;
        p.rot += p.rotSpeed;

        if (p.y > canvas.height) {
            particles.splice(index, 1);
        }
    });

    if (particles.length > 0) {
        requestAnimationFrame(drawConfetti);
    }
}

function startConfetti(amount) {
    createConfetti(amount);
    drawConfetti();
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});