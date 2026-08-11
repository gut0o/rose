document.addEventListener('DOMContentLoaded', () => {

    const triggerOverlay = document.getElementById('triggerOverlay');
    const startButton = document.getElementById('startButton');
    const loadingBar = document.getElementById('loadingBar');
    const statusText = document.getElementById('statusText');
    const ambientLight = document.getElementById('ambientLight');
    const roseWrapper = document.getElementById('roseWrapper');
    const roseHead = document.getElementById('roseHead');
    const calyx = document.getElementById('calyx');
    const stem = document.getElementById('stem');
    const leafLeft = document.getElementById('leafLeft');
    const leafRight = document.getElementById('leafRight');
    const endText = document.getElementById('endText');
    const fallingPetalsEl = document.getElementById('fallingPetals');
    const scene = document.querySelector('.scene');

    // Peonies are much fuller than roses: many overlapping, rounded petals
    // build from a tight center into broad, softly opened outer layers.
    const PETAL_LAYERS = [
        { count: 5,  w: 22,  h: 34,  curl: 82,  delayBase: 0.00, tz: 3,  cls: 'petal-bud' },
        { count: 6,  w: 30,  h: 43,  curl: 72,  delayBase: 0.14, tz: 8,  cls: 'petal-core' },
        { count: 8,  w: 40,  h: 54,  curl: 58,  delayBase: 0.28, tz: 14, cls: 'petal-inner' },
        { count: 9,  w: 52,  h: 66,  curl: 42,  delayBase: 0.44, tz: 22, cls: 'petal-mid-inner' },
        { count: 10, w: 66,  h: 78,  curl: 24,  delayBase: 0.62, tz: 31, cls: 'petal-mid' },
        { count: 11, w: 82,  h: 91,  curl: 5,   delayBase: 0.82, tz: 41, cls: 'petal-outer' },
        { count: 12, w: 98,  h: 102, curl: -12, delayBase: 1.02, tz: 52, cls: 'petal-blush' },
        { count: 13, w: 112, h: 110, curl: -25, delayBase: 1.24, tz: 64, cls: 'petal-guard' },
    ];

    const SEPALS_COUNT = 5;

    const FALLING_PETAL_COLORS = [
        ['#ffffff', '#d7d9df'],
        ['#fffdf8', '#cfd2d8'],
        ['#f8f8f6', '#bcc1ca'],
        ['#ffffff', '#e2e3e7'],
    ];

    let fallingPetalInterval = null;


    function startCardLoader() {
        const duration = 2400;
        const steps = [
            { threshold: 20, text: 'Loading Love.css...' },
            { threshold: 50, text: 'Growing peony petals...' },
            { threshold: 80, text: 'Layering soft white petals...' },
            { threshold: 95, text: 'Optimizing 3D rendering...' },
            { threshold: 100, text: 'Ready to bloom!' }
        ];

        let startTimestamp = null;

        function animateLoader(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const percent = Math.floor(progress * 100);

            loadingBar.style.width = `${percent}%`;
            const activeStep = steps.find(s => percent <= s.threshold) || steps[steps.length - 1];
            statusText.textContent = activeStep.text;

            if (progress < 1) {
                requestAnimationFrame(animateLoader);
            } else {
                startButton.removeAttribute('disabled');
            }
        }

        requestAnimationFrame(animateLoader);
    }


    function createSepals() {
        const step = 360 / SEPALS_COUNT;
        for (let i = 0; i < SEPALS_COUNT; i++) {
            const sepal = document.createElement('div');
            sepal.className = 'sepal';
            const angle = i * step + (Math.random() - 0.5) * 5;
            const delay = 0.3 + i * 0.06;
            const curl = 18 + Math.random() * 8;

            sepal.style.setProperty('--sepal-angle', `${angle}deg`);
            sepal.style.setProperty('--sepal-curl', `${curl}deg`);
            sepal.style.setProperty('--sepal-delay', `${delay}s`);
            calyx.appendChild(sepal);
        }
    }

    function createPetals() {
        PETAL_LAYERS.forEach((layer, li) => {
            const angleStep = 360 / layer.count;
            const layerOffset = li * 24 + (Math.random() - 0.5) * 8;

            for (let i = 0; i < layer.count; i++) {
                const petal = document.createElement('div');
                petal.className = `petal ${layer.cls}`;

                const angle = layerOffset + i * angleStep + (Math.random() - 0.5) * 5;
                const delay = layer.delayBase + i * 0.05;
                const curlJitter = (Math.random() - 0.5) * 10;
                const scaleJitter = 0.90 + Math.random() * 0.18;
                const bloomDur = 1.9 + Math.random() * 0.55;

                petal.style.width = `${layer.w}px`;
                petal.style.height = `${layer.h}px`;
                petal.style.setProperty('--angle', `${angle}deg`);
                petal.style.setProperty('--curl', `${layer.curl + curlJitter}deg`);
                petal.style.setProperty('--scale', scaleJitter);
                petal.style.setProperty('--delay', `${delay}s`);
                petal.style.setProperty('--tz', `${layer.tz}px`);
                petal.style.setProperty('--bloom-dur', `${bloomDur}s`);
                petal.style.setProperty('--ruffle', `${46 + Math.random() * 12}%`);

                roseHead.appendChild(petal);
            }
        });
    }

    function growStem() {
        return new Promise(resolve => {
            stem.classList.add('grow');

            setTimeout(() => {
                leafLeft.classList.add('visible');
            }, 800);

            setTimeout(() => {
                leafRight.classList.add('visible');
            }, 1100);

            setTimeout(resolve, 2200);
        });
    }

    function bloom() {
        calyx.classList.add('visible');
        ambientLight.classList.add('visible');
        roseHead.classList.add('blooming');
    }

    function spawnFallingPetal() {
        if (fallingPetalsEl.childElementCount > 5) return;

        const petal = document.createElement('div');
        petal.className = 'falling-petal';

        const w = 10 + Math.random() * 12;
        const h = w * (1.25 + Math.random() * 0.15);
        const x = 20 + Math.random() * 60;
        const y = 3 + Math.random() * 10;
        const dur = 5.5 + Math.random() * 3.5;
        const delay = Math.random() * 0.6;

        const colors = FALLING_PETAL_COLORS[Math.floor(Math.random() * FALLING_PETAL_COLORS.length)];

        const sign = () => (Math.random() > 0.5 ? 1 : -1);
        const s1 = sign() * (15 + Math.random() * 25);
        const s2 = sign() * (10 + Math.random() * 20);
        const s3 = sign() * (20 + Math.random() * 30);
        const s4 = sign() * (10 + Math.random() * 15);

        petal.style.left = `${x}vw`;
        petal.style.top = `${y}vh`;
        petal.style.setProperty('--fp-w', `${w}px`);
        petal.style.setProperty('--fp-h', `${h}px`);
        petal.style.setProperty('--fp-c1', colors[0]);
        petal.style.setProperty('--fp-c2', colors[1]);
        petal.style.setProperty('--f-dur', `${dur}s`);
        petal.style.setProperty('--f-delay', `${delay}s`);
        petal.style.setProperty('--s1', `${s1}px`);
        petal.style.setProperty('--s2', `${s2}px`);
        petal.style.setProperty('--s3', `${s3}px`);
        petal.style.setProperty('--s4', `${s4}px`);

        fallingPetalsEl.appendChild(petal);

        setTimeout(() => {
            if (petal.parentNode) petal.remove();
        }, (dur + delay) * 1000 + 300);
    }

    function startFallingPetals() {
        for (let i = 0; i < 2; i++) {
            setTimeout(() => spawnFallingPetal(), i * 300);
        }

        fallingPetalInterval = setInterval(() => {
            spawnFallingPetal();
        }, 3200);
    }


    async function startAnimationSequence() {
        await growStem();
        await delay(100);
        bloom();

        setTimeout(() => {
            roseWrapper.classList.add('rotating');
        }, 2600);

        setTimeout(() => startFallingPetals(), 3400);

        setTimeout(() => {
            endText.classList.add('visible');
        }, 4600);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startButton.addEventListener('click', () => {
        triggerOverlay.classList.add('fade-out');

        setTimeout(() => {
            startAnimationSequence();
        }, 800);
    });
    createSepals();
    createPetals();

    setTimeout(() => {
        startCardLoader();
    }, 400);

});
