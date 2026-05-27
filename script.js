document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CUSTOM CURSOR LOGIC (SAFE) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 450, fill: 'forwards' });
        });

        document.addEventListener('mouseleave', () => {
            cursorDot.classList.add('hidden');
            cursorOutline.classList.add('hidden');
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.classList.remove('hidden');
            cursorOutline.classList.remove('hidden');
        });

        const interactiveElements = document.querySelectorAll('a, button, .hamburger');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseover', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
    }

    // --- 2. MAGNETIC LINKS/BUTTONS LOGIC ---
    const magneticElements = document.querySelectorAll('.magnetic-link, .magnetic-button');

    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transition = 'transform 0.1s linear';
            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        el.addEventListener('mouseleave', function () {
            this.style.transition = 'transform 0.3s cubic-bezier(0.78, 0.13, 0.15, 0.86)';
            this.style.transform = 'translate(0, 0)';
        });
    });

    // --- 3. SCROLL-TRIGGERED ANIMATIONS (INTERSECTION OBSERVER) ---
    const hiddenElements = document.querySelectorAll('.hidden');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        },
        {
            threshold: 0.2,
        }
    );

    hiddenElements.forEach((el) => observer.observe(el));

    // --- 4. RESPONSIVE NAVIGATION (HAMBURGER MENU) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle', isActive);
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    hamburger.classList.remove('toggle');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- 5. RESUME FILE CHECK (FOR DOWNLOAD BUTTON) ---
    const resumeUrl = 'Naga_Mahesh_Kona_Resume.pdf';
    const downloadResume = document.getElementById('download-resume');

    if (downloadResume) {
        fetch(resumeUrl, { method: 'HEAD' })
            .then((response) => {
                if (!response.ok) {
                    downloadResume.style.pointerEvents = 'none';
                    downloadResume.style.opacity = '0.6';
                    downloadResume.removeAttribute('href');
                } else {
                    downloadResume.setAttribute('href', resumeUrl);
                }
            })
            .catch(() => {
                // Fail silently in case of offline/blocked requests.
            });
    }

    // --- 6. MAILTO / SAY HELLO FALLBACK ---
    function showToast(message, timeout = 3500) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = 'rgba(15,16,20,0.96)';
        toast.style.color = '#fff';
        toast.style.padding = '10px 16px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.5)';
        toast.style.zIndex = 99999;
        toast.style.fontSize = '14px';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s ease';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, timeout);
    }

    const mailtoLink = document.querySelector('a[href^="mailto:"]');
    if (mailtoLink) {
        mailtoLink.addEventListener('click', (e) => {
            e.preventDefault();
            const href = mailtoLink.getAttribute('href');
            const email = href.replace(/^mailto:/i, '');

            try {
                window.location.href = href;
            } catch (err) {}

            try {
                window.open(href, '_blank');
            } catch (err) {}

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard
                    .writeText(email)
                    .then(() => {
                        showToast(`Email copied to clipboard: ${email}`);
                    })
                    .catch(() => {
                        showToast(`Couldn't copy email automatically. Please use: ${email}`);
                    });
            } else {
                try {
                    window.prompt('Copy this email address:', email);
                } catch (err) {
                    showToast(`Please use this email: ${email}`);
                }
            }
        });
    }

    // --- 7. TYPEWRITER EFFECT FOR HERO SUBTITLE ---
    const typewriterEl = document.querySelector('.typewriter');
    if (typewriterEl) {
        const text = typewriterEl.dataset.text || '';
        let i = 0;
        const speed = 40;
        const typer = () => {
            if (i <= text.length) {
                typewriterEl.textContent = text.slice(0, i);
                i++;
                setTimeout(typer, speed);
            }
        };
        const startSubtitle = () => setTimeout(typer, 260);
        window.startSubtitle = startSubtitle;
    }

    // --- 7b. TYPEWRITER FOR H1 TITLE (chained) ---
    const titleEl = document.querySelector('.typewriter-title');
    if (titleEl) {
        const titleText = titleEl.dataset.text || '';
        let j = 0;
        const titleSpeed = 60;
        const titleTyper = () => {
            if (j <= titleText.length) {
                titleEl.textContent = titleText.slice(0, j);
                j++;
                setTimeout(titleTyper, titleSpeed);
            } else {
                if (window.startSubtitle) window.startSubtitle();
            }
        };
        const heroTitleObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        titleTyper();
                        heroTitleObserver.disconnect();
                    }
                });
            },
            { threshold: 0.2 }
        );
        heroTitleObserver.observe(titleEl);
        setTimeout(() => {
            if (j === 0) titleTyper();
        }, 300);
    }

    // --- 8. HTML-AWARE TYPEWRITER FOR HERO PARAGRAPH ---
    const typePara = document.querySelector('.typewriter-paragraph');
    if (typePara) {
        const raw = typePara.dataset.text || '';
        const htmlType = (element, source, speed = 20, cb) => {
            let i = 0;
            const insert = () => {
                if (i >= source.length) {
                    if (cb) cb();
                    return;
                }
                if (source[i] === '<') {
                    const end = source.indexOf('>', i);
                    if (end === -1) {
                        i++;
                        setTimeout(insert, speed);
                        return;
                    }
                    element.innerHTML += source.slice(i, end + 1);
                    i = end + 1;
                    setTimeout(insert, speed);
                } else {
                    element.innerHTML += source[i];
                    i++;
                    setTimeout(insert, speed + Math.random() * 40);
                }
            };
            insert();
        };

        let started = false;
        const startTyping = () => {
            if (started) return;
            started = true;
            typePara.innerHTML = '';
            htmlType(typePara, raw, 18);
        };

        const paraObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) startTyping();
                });
            },
            { threshold: 0.2 }
        );
        paraObserver.observe(typePara);
        setTimeout(() => startTyping(), 1200);
    }

    // --- 9. AUTO-UPDATE FOOTER YEAR ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 10. SCROLL PROGRESS BAR ---
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY || window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${scrolled}%`;
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // --- 11. ACTIVE NAV LINK ON SCROLL ---
    const sections = document.querySelectorAll('main section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length && navItems.length) {
        const setActiveLink = () => {
            let currentId = '';
            const scrollY = window.scrollY + 120;

            sections.forEach((section) => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (scrollY >= top && scrollY < top + height) {
                    currentId = section.getAttribute('id') || '';
                }
            });

            navItems.forEach((link) => {
                const href = link.getAttribute('href') || '';
                const hash = href.startsWith('#') ? href.substring(1) : '';
                if (hash && hash === currentId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', setActiveLink, { passive: true });
        setActiveLink();
    }

    // --- 12. THEME TOGGLE (DARK/LIGHT) ---
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

    const setThemeIcon = (theme) => {
        if (!themeIcon) return;
        themeIcon.textContent = theme === 'light' ? '☀' : '☾';
    };

    const applyTheme = (theme) => {
        if (theme === 'light') {
            root.classList.add('light-theme');
        } else {
            root.classList.remove('light-theme');
        }
        setThemeIcon(theme);
    };

    let initialTheme = localStorage.getItem('nmk-theme');
    if (initialTheme !== 'light' && initialTheme !== 'dark') {
        // default to light if no preference saved
        initialTheme = 'light';
    }
    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = !root.classList.contains('light-theme');
            const newTheme = isLight ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('nmk-theme', newTheme);
        });
    }
});
