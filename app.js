async function loadStories() {
    const wrapper = document.getElementById('cardsWrapper');
    if (!wrapper) return;

    try {
        const response = await fetch('oykuler.json');
        const stories = await response.json();

        wrapper.innerHTML = '';

        if (stories.length <= 3) {
            wrapper.classList.add('center-items');
        } else {
            wrapper.classList.remove('center-items');
        }

        stories.forEach(story => {
            const cardHTML = `
                <a href="reader.html?id=${story.id}" class="book-card">
                    <div class="book tilt-card">
                        <div class="glare"></div>
                        <img src="${story.kapak}" alt="${story.baslik}">
                    </div>
                </a>
            `;
            wrapper.innerHTML += cardHTML;
        });

        initTiltEffect();

    } catch (err) {
        console.error("Öyküler yüklenirken hata oluştu:", err);
    }
}

function scrollSlider(distance) {
    const wrapper = document.getElementById('cardsWrapper');
    if (wrapper) {
        wrapper.scrollBy({
            left: distance,
            behavior: 'smooth'
        });
    }
}

function initTiltEffect() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8; 
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `${-rotateY * 1.2}px ${rotateX * 1.2 + 8}px 20px rgba(0,0,0,0.15)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.boxShadow = '-3px 6px 18px rgba(0, 0, 0, 0.12)';
        });
    });
}

document.addEventListener('DOMContentLoaded', loadStories);
