document.addEventListener('DOMContentLoaded', () => {
    // Current Year Update
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    /* Simple mobile menu implementation */
    mobileToggle.addEventListener('click', () => {
        const isDisplayed = navLinksContainer.style.display === 'flex';

        if (isDisplayed) {
            navLinksContainer.style.display = 'none';
        } else {
            navLinksContainer.style.display = 'flex';
            navLinksContainer.style.flexDirection = 'column';
            navLinksContainer.style.position = 'absolute';
            navLinksContainer.style.top = '100%';
            navLinksContainer.style.left = '0';
            navLinksContainer.style.width = '100%';
            navLinksContainer.style.backgroundColor = '#FFFFFF';
            navLinksContainer.style.padding = '1rem 0';
            navLinksContainer.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';

            navLinks.forEach(link => {
                link.style.padding = '1rem 2rem';
                link.style.color = '#0B1D3A';
                link.style.borderBottom = '1px solid #F4F6F9';
            });
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinksContainer.style.display = 'none';
            }
        });
    });

    // Smooth Scroll for Anchor Links (if CSS smooth scroll is not enough)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Fade-In Animations
    const fadeElements = document.querySelectorAll('.fade-in-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Form submission via Web3Forms (No Backend Required)
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = quoteForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Inquiry...';
            btn.disabled = true;

            // --- IMPORTANT: GET YOUR FREE ACCESS KEY ---
            // 1. Go to https://web3forms.com/#create-access-key
            // 2. Enter kksahoo@blfindia.com and click Create Access Key
            // 3. Check your email, copy the string it gives you, and paste it inside the quotes below:
            const ACCESS_KEY = "8a239cb1-82ea-45ab-b5ca-a4c321bfa17a";

            if (ACCESS_KEY === "YOUR_ACCESS_KEY_HERE" || ACCESS_KEY === "") {
                alert("Please add your Web3Forms Access Key to script.js to send emails directly.");
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Setup Required';
                btn.style.backgroundColor = '#e74c3c';
                btn.style.color = '#fff';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 4000);
                return;
            }

            // Get form values
            const name = document.getElementById('name').value;
            const company = document.getElementById('company').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const interestElement = document.getElementById('interest');
            const interest = interestElement.options[interestElement.selectedIndex].text;
            const message = document.getElementById('message').value;

            try {
                // Send directly to the email without opening client
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: ACCESS_KEY,
                        subject: 'New B2B Website Inquiry from: ' + name,
                        from_name: 'Biharilal Fashions Website',
                        name: name,
                        company: company,
                        email: email,
                        phone: phone,
                        interest: interest,
                        message: message
                    })
                });

                const json = await response.json();

                if (response.status === 200) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Inquiry Sent Successfully';
                    btn.style.backgroundColor = '#27ae60';
                    btn.style.color = '#fff';
                    quoteForm.reset();
                    
                    // Show custom popup
                    const popup = document.getElementById('successPopup');
                    if (popup) {
                        popup.classList.add('show');
                        
                        // Auto hide after 6 seconds
                        setTimeout(() => {
                            popup.classList.remove('show');
                        }, 6000);
                    }

                } else {
                    console.log(response);
                    btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Sending Failed';
                    btn.style.backgroundColor = '#e74c3c';
                    btn.style.color = '#fff';
                }
            } catch (error) {
                console.log(error);
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Network Error';
                btn.style.backgroundColor = '#e74c3c';
                btn.style.color = '#fff';
            }

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 4000);
        });
    }

    // Initialize animation for items already in view
    setTimeout(() => {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                element.classList.add('visible');
            }
        });
    }, 100);

    // Popup Close Logic
    const closePopupBtn = document.getElementById('closePopup');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            document.getElementById('successPopup').classList.remove('show');
        });
    }
});
