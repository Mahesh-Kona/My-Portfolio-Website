document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CUSTOM CURSOR LOGIC ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hide cursor when leaving the window
    document.addEventListener('mouseleave', () => {
        cursorDot.classList.add('hidden');
        cursorOutline.classList.add('hidden');
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.classList.remove('hidden');
        cursorOutline.classList.remove('hidden');
    });

    // Add hover effect to the cursor
    const interactiveElements = document.querySelectorAll('a, button, .hamburger');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });

    // --- 2. MAGNETIC LINKS/BUTTONS LOGIC ---
    const magneticElements = document.querySelectorAll('.magnetic-link, .magnetic-button');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transition = 'transform 0.1s linear';
            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        el.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.3s cubic-bezier(0.78, 0.13, 0.15, 0.86)';
            this.style.transform = 'translate(0, 0)';
        });
    });

    // --- 3. SCROLL-TRIGGERED ANIMATIONS (INTERSECTION OBSERVER) ---
    const hiddenElements = document.querySelectorAll('.hidden');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the element is visible
    });

    hiddenElements.forEach((el) => observer.observe(el));

    // --- 4. RESPONSIVE NAVIGATION (HAMBURGER MENU) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });
    
    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
            }
        });
    });

    // --- 5. RESUME FILE CHECK ---
    // Verify resume.pdf exists; if not, show a friendly message and disable download
    const resumeUrl = 'Naga_Mahesh_Kona_Final_Resume.pdf';
    const resumeMessage = document.getElementById('resume-message');
    const downloadResume = document.getElementById('download-resume');

    if (resumeMessage && downloadResume) {
        fetch(resumeUrl, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    resumeMessage.textContent = "Resume file not found in the site folder. Please add 'Naga_Mahesh_Kona_Final_Resume.pdf' to the project to enable preview and download.";
                    downloadResume.style.pointerEvents = 'none';
                    downloadResume.style.opacity = '0.6';
                    downloadResume.removeAttribute('href');
                }
            })
            .catch(() => {
                resumeMessage.textContent = "";
            });
    }

    // --- 6. MAILTO / SAY HELLO FALLBACK ---
    // Ensure the "Say Hello" mailto link works even when no mail client is configured.
    function showToast(message, timeout = 3500) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = 'rgba(20,20,20,0.95)';
        toast.style.color = '#fff';
        toast.style.padding = '10px 16px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)';
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
            // Try to open default mail client. Also copy email to clipboard as a fallback.
            e.preventDefault();
            const href = mailtoLink.getAttribute('href');
            const email = href.replace(/^mailto:/i, '');

            // Try to open the mail client using location and window.open. Some environments may block it.
            try {
                // First attempt: change location (works in many browsers)
                window.location.href = href;
            } catch (err) {
                // Ignore and try window.open below
            }

            try {
                window.open(href, '_blank');
            } catch (err) {
                // ignore
            }

            // Copy email to clipboard so the user can paste if mail client didn't open
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast(`Email copied to clipboard: ${email}`);
                }).catch(() => {
                    showToast(`Couldn't copy email automatically. Please use: ${email}`);
                });
            } else {
                // Fallback: use a prompt to allow manual copy
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
        // We'll trigger subtitle after title types; start delayed as fallback
        const startSubtitle = () => setTimeout(typer, 300);
        // If title already typed or absent, start subtitle quickly
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
                // After title completes, trigger subtitle and paragraph
                if (window.startSubtitle) window.startSubtitle();
                // Also kick paragraph if present (the paragraph observer will start it when visible)
            }
        };
        // Start title when hero is visible
        const heroTitleObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { titleTyper(); heroTitleObserver.disconnect(); } });
        }, { threshold: 0.2 });
        heroTitleObserver.observe(titleEl);
        // Fallback: start after 300ms
        setTimeout(() => { if (j === 0) titleTyper(); }, 300);
    }

    // Project modal removed — view-details buttons are no longer used

    // --- 9. HTML-AWARE TYPEWRITER FOR HERO PARAGRAPH ---
    const typePara = document.querySelector('.typewriter-paragraph');
    if (typePara) {
        const raw = typePara.dataset.text || '';
        // Helper: types HTML while inserting tags atomically
        const htmlType = (element, source, speed = 20, cb) => {
            let i = 0;
            const insert = () => {
                if (i >= source.length) { if (cb) cb(); return; }
                if (source[i] === '<') {
                    // copy until '>' inclusive
                    const end = source.indexOf('>', i);
                    if (end === -1) { i++; setTimeout(insert, speed); return; }
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

        // Use intersection observer to start when hero visible, else start after 700ms
        let started = false;
        const startTyping = () => {
            if (started) return; started = true;
            typePara.innerHTML = ''; // clear
            htmlType(typePara, raw, 18);
        };

        const paraObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) startTyping();
            });
        }, { threshold: 0.2 });
        paraObserver.observe(typePara);
        // Fallback: start after a delay if intersection doesn't fire
        setTimeout(() => startTyping(), 1200);
    }
});