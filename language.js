document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerButton && mobileMenu) {
        hamburgerButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('mobile-menu-visible');
            const isExpanded = mobileMenu.classList.contains('mobile-menu-visible');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
            // Optional: Change hamburger icon to an 'X' when menu is open
            // const icon = hamburgerButton.querySelector('.hamburger-icon');
            // if (icon) {
            //     icon.textContent = isExpanded ? '✕' : '☰';
            // }
        });
    }

    // Language Switcher Logic
    const langEnButton = document.getElementById('lang-en');
    const langEsButton = document.getElementById('lang-es');
    const translatableElements = document.querySelectorAll('[data-lang-en], [data-lang-es]');

    const setLanguage = (lang) => {
        translatableElements.forEach(el => {
            const text = el.getAttribute(`data-lang-${lang}`);
            if (text) {
                // For input placeholders or values, you might need to check el.tagName
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.placeholder) el.placeholder = text;
                    // if (el.value) el.value = text; // Be careful with overwriting user input
                } else {
                    el.textContent = text;
                }
            }
        });
        localStorage.setItem('alexWebsiteLanguage', lang);
        // Optional: Add active class to the current language button
        if (langEnButton && langEsButton) {
            if (lang === 'es') {
                langEsButton.classList.add('active-lang');
                langEnButton.classList.remove('active-lang');
            } else {
                langEnButton.classList.add('active-lang');
                langEsButton.classList.remove('active-lang');
            }
        }

        // Update the text of the language buttons themselves
        if (langEnButton && langEsButton) {
            if (lang === 'es') {
                langEnButton.textContent = 'Inglés';
                langEsButton.textContent = 'Español';
            } else { // lang === 'en' or any other default
                langEnButton.textContent = 'English';
                langEsButton.textContent = 'Spanish';
            }
        }
    };

    if (langEnButton) {
        langEnButton.addEventListener('click', () => setLanguage('en'));
    }
    if (langEsButton) {
        langEsButton.addEventListener('click', () => setLanguage('es'));
    }

    // Load saved language or default to English
    let savedLang = localStorage.getItem('alexWebsiteLanguage') || 'en';
    // setLanguage(savedLang); // We'll call this after defining the new setLanguage

    // Transformer Info Toggle
    const transformerInfoButtons = document.querySelectorAll('.transformer-info-btn');
    transformerInfoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetBio = document.getElementById(targetId);
            if (targetBio) {
                const isHidden = targetBio.classList.toggle('hidden');
                // Update button text based on visibility and current language
                const currentLang = localStorage.getItem('alexWebsiteLanguage') || 'en';
                if (isHidden) {
                    button.textContent = button.getAttribute(`data-lang-${currentLang}-more`) || (currentLang === 'es' ? '¡Más Info!' : 'More Info!');
                } else {
                    button.textContent = button.getAttribute(`data-lang-${currentLang}-less`) || (currentLang === 'es' ? '¡Menos Info!' : 'Less Info!');
                }
            }
        });
    });

    // Ensure Transformer button text is updated on initial language load and switch
    // Store original setLanguage function if it's in the same scope or make it accessible
    const originalSetLanguage = setLanguage;

    // Redefine setLanguage to include Transformer button text updates
    window.setLanguage = (lang) => {
        originalSetLanguage(lang); // Call original language setting logic

        transformerInfoButtons.forEach(button => {
            const targetId = button.dataset.target;
            const targetBio = document.getElementById(targetId);
            if (targetBio) { // Check if targetBio exists
                if (targetBio.classList.contains('hidden')) {
                    button.textContent = button.getAttribute(`data-lang-${lang}-more`) || (lang === 'es' ? '¡Más Info!' : 'More Info!');
                } else {
                    button.textContent = button.getAttribute(`data-lang-${lang}-less`) || (lang === 'es' ? '¡Menos Info!' : 'Less Info!');
                }
            }
        });
    };

    // Call the enhanced setLanguage on initial load
    window.setLanguage(savedLang);

});
