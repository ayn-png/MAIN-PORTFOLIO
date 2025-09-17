/*=============== DYNAMIC DOCUMENT TITLE ===============*/
const originalTitle = document.title;
window.addEventListener('blur', () => { document.title = 'Come back 😥'; });
window.addEventListener('focus', () => { document.title = originalTitle; });

// --- MAIN FUNCTION TO INITIALIZE THE ENTIRE APPLICATION ---
// We wrap everything in a single function to be called when the page is fully loaded.
function initializeApp() {

    /*----- 1. THREE.JS 3D BACKGROUND -----*/
    function initThreeJS() {
        // Use a try...catch block to prevent a 3D error from stopping other scripts.
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const canvas = document.getElementById('bg-canvas');
            if (!canvas) return; // Exit if canvas isn't found

            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true // Important for transparent background
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const geometry = new THREE.IcosahedronGeometry(1.2, 0);
            const material = new THREE.MeshNormalMaterial({ wireframe: true });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            camera.position.z = 4;

            let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;

            function onDocumentMouseMove(event) {
                mouseX = (event.clientX - windowHalfX);
                mouseY = (event.clientY - windowHalfY);
            }
            document.addEventListener('mousemove', onDocumentMouseMove);

            const clock = new THREE.Clock();
            function animate() {
                targetX = mouseX * 0.001;
                targetY = mouseY * 0.001;
                
                // Smoother easing animation for mouse interaction
                mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
                mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);

                // Constant slow rotation
                mesh.rotation.z -= 0.002;

                renderer.render(scene, camera);
                window.requestAnimationFrame(animate);
            }
            animate();

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }
            window.addEventListener('resize', onWindowResize);
        } catch (error) {
            console.error("Three.js initialization failed:", error);
        }
    }

    /*----- 2. TYPING ANIMATION (Correctly Initialized) -----*/
    function initTypingAnimation() {
        try {
            if (document.querySelector('.typing')) {
                new Typed('.typing', {
                    strings: ['Frontend Developer', 'Backend Developer', 'Full-Stack Engineer', 'UI/UX Enthusiast'],
                    typeSpeed: 70,
                    backSpeed: 40,
                    loop: true
                });
            }
        } catch(error) {
            console.error("Typing animation failed:", error);
        }
    }

    /*----- 3. THEME TOGGLE -----*/
    function initThemeToggle() {
        const themeButtons = document.querySelectorAll('.change-theme, .change-theme-side');
        const body = document.body;
        
        function applyTheme() {
            const isLightMode = localStorage.getItem('lightMode') === 'true';
            body.classList.toggle('light-theme', isLightMode);
            themeButtons.forEach(button => {
                button.classList.toggle('fa-sun', isLightMode);
                button.classList.toggle('fa-moon', !isLightMode);
            });
        }
        applyTheme();

        themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const isLightMode = body.classList.toggle('light-theme');
                localStorage.setItem('lightMode', isLightMode);
                themeButtons.forEach(btn => {
                    btn.classList.toggle('fa-sun', isLightMode);
                    btn.classList.toggle('fa-moon', !isLightMode);
                });
            });
        });
    }

    /*----- 4. SCROLL REVEAL ANIMATION -----*/
    function initScrollReveal() {
        try {
            const sr = ScrollReveal({
                origin: 'top', distance: '60px', duration: 2500, delay: 400,
            });
            sr.reveal(`.home__data, .about__img-container, .about__data, .skills__content, .portfolio__card, .blog__card, .contact__form, .idea-generator-container`);
            sr.reveal(`.home__greeting, .home__name, .home__education`, { delay: 500 });
            sr.reveal(`.home__social`, { delay: 600 });
            sr.reveal(`.button`, { delay: 700, origin: 'bottom' });
        } catch (error) {
            console.error("ScrollReveal failed:", error);
        }
    }
    
    /*----- 5. SCROLLSPY (Active Link Highlighting) -----*/
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav__link, .side__nav-link');
        function scrollActive() {
            const scrollY = window.pageYOffset;
            sections.forEach(current => {
                const sectionHeight = current.offsetHeight,
                      sectionTop = current.offsetTop - 58,
                      sectionId = current.getAttribute('id'),
                      correspondingLink = document.querySelector(`.nav__link[href*="#${sectionId}"], .side__nav-link[href*="#${sectionId}"]`);
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active-link'));
                    if (correspondingLink) correspondingLink.classList.add('active-link');
                }
            });
        }
        window.addEventListener('scroll', scrollActive);
    }
    
    /*----- 6. EMAILJS CONTACT FORM -----*/
   (function() {
    emailjs.init("Xin5jBxl201TZcsvf"); // Your Public Key
})();

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');

    if (contactForm) {
        function sendEmail(e) {
            e.preventDefault();

            emailjs.sendForm('service_fpwp18e', 'template_qm2g8bo', contactForm)
                .then(() => {
                    contactMessage.textContent = '✅ Message sent successfully!';
                    setTimeout(() => { contactMessage.textContent = ''; }, 5000);
                    contactForm.reset();
                }, (error) => {
                    contactMessage.textContent = '❌ Message not sent (service error)';
                    console.error("EmailJS Error:", error);
                });
        }

        contactForm.addEventListener('submit', sendEmail);
    }
}


    /*----- 7. GEMINI AI GENERATOR -----*/
    function initAIGenerator() {
        const generateIdeaBtn = document.getElementById('generate-idea-btn');
        const ideaModal = document.getElementById('idea-modal');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        if (generateIdeaBtn) generateIdeaBtn.addEventListener('click', generateProjectIdea);
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => ideaModal.classList.add('hidden'));
        if (ideaModal) ideaModal.addEventListener('click', (event) => {
            if (event.target === ideaModal) ideaModal.classList.add('hidden');
        });
    }

    async function generateProjectIdea() {
        const ideaKeywordsInput = document.getElementById('idea-keywords');
        const ideaModal = document.getElementById('idea-modal');
        const loadingSpinner = document.getElementById('loading-spinner');
        const ideaOutput = document.getElementById('idea-output');

        const keywords = ideaKeywordsInput.value;
        if (!keywords.trim()) {
            alert('Please enter some keywords or technologies.');
            return;
        }

        ideaModal.classList.remove('hidden');
        loadingSpinner.classList.remove('hidden');
        ideaOutput.classList.add('hidden');
      
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const systemPrompt = `You are an expert project manager and web development mentor. Generate a creative and practical project idea based on a user's keywords, suitable for a developer's portfolio. The response must be a valid JSON object with the schema: {"title": "A Catchy Project Title", "description": "A concise one-paragraph project description.", "features": ["A key feature.", "Another key feature.", "A third, interesting feature."]}`;
        const userPrompt = `Generate a project idea based on these keywords: ${keywords}`;
        const payload = {
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" }
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API call failed: ${response.status}`);
            const result = await response.json();
            const candidate = result.candidates?.[0];
            if (!candidate?.content?.parts?.[0]?.text) throw new Error("Invalid API response structure.");
            
            const idea = JSON.parse(candidate.content.parts[0].text);
            ideaOutput.innerHTML = `<h4>${idea.title}</h4><p>${idea.description}</p><ul>${idea.features.map(f => `<li>${f}</li>`).join('')}</ul>`;
        } catch (error) {
            console.error("Error generating project idea:", error);
            ideaOutput.innerHTML = `<p>Sorry, an error occurred. Please try again.</p>`;
        } finally {
            loadingSpinner.classList.add('hidden');
            ideaOutput.classList.remove('hidden');
        }
    }

    // --- INITIALIZE ALL MODULES ---
    // This ensures all parts of the application are started.
    initThreeJS();
    initTypingAnimation();
    initThemeToggle();
    initScrollReveal();
    initScrollSpy();
    initContactForm();
    initAIGenerator();
}

// --- RUN THE APP ---
// CORRECTED: Use window.onload to wait for all external scripts (Three.js, Typed.js, etc.) to load.
window.onload = initializeApp;

