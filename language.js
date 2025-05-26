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
    };

    if (langEnButton) {
        langEnButton.addEventListener('click', () => setLanguage('en'));
    }
    if (langEsButton) {
        langEsButton.addEventListener('click', () => setLanguage('es'));
    }

    // Load saved language or default to English
    const savedLang = localStorage.getItem('alexWebsiteLanguage') || 'en';
    setLanguage(savedLang);
});
