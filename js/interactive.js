/**
 * BERESLY - Interactive JavaScript Features
 * File: js/interactive.js
 * 
 * 5 Fitur JavaScript Murni (Tanpa Library):
 * 1. Mobile Menu Toggle
 * 2. Form Validation
 * 3. Dark Mode Toggle
 * 4. Image Lazy Loading
 * 5. Scroll Progress Bar
 */

// ============================================
// FITUR 1: MOBILE MENU TOGGLE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
            
            // Animasi icon hamburger
            const icon = this.querySelector('.navbar-toggler-icon');
            if (icon) {
                icon.classList.toggle('active');
            }
        });
        
        // Close menu ketika klik link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }
});


// ============================================
// FITUR 2: FORM VALIDATION (Enhanced)
// ============================================
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        // Remove previous error messages
        form.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        inputs.forEach(input => {
            // Reset styling
            input.style.borderColor = '';
            
            // Validasi field kosong
            if (!input.value.trim()) {
                showError(input, 'Field ini wajib diisi');
                isValid = false;
            }
            
            // Validasi email
            if (input.type === 'email' && input.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value)) {
                    showError(input, 'Format email tidak valid');
                    isValid = false;
                }
            }
            
            // Validasi nomor HP
            if (input.type === 'tel' && input.value) {
                const phonePattern = /^[0-9]{10,13}$/;
                if (!phonePattern.test(input.value.replace(/\D/g, ''))) {
                    showError(input, 'Nomor HP tidak valid (10-13 digit)');
                    isValid = false;
                }
            }
        });
        
        // Jika valid, submit form (untuk WhatsApp redirect, sudah dihandle di masing-masing halaman)
        if (isValid) {
            // Check if form has custom handler (WhatsApp forms)
            if (form.id === 'orderForm' || form.id === 'contactForm') {
                // Let the existing WhatsApp handler process it
                return true;
            }
            
            // Show success message
            showSuccessMessage(form);
        }
    });
});

function showError(input, message) {
    input.style.borderColor = '#dc3545';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

function showSuccessMessage(form) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success mt-3';
    successDiv.textContent = 'Pesan berhasil dikirim!';
    form.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
        form.reset();
    }, 3000);
}


// ============================================
// FITUR 3: DARK MODE TOGGLE
// ============================================
// Create dark mode button
const darkModeBtn = document.createElement('button');
darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
darkModeBtn.className = 'dark-mode-toggle';
darkModeBtn.style.cssText = `
    position: fixed;
    bottom: 70px;
    right: 15px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: #FFD662;
    color: #000;
    font-size: 18px;
    cursor: pointer;
    z-index: 999;
    transition: all 0.3s;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

document.body.appendChild(darkModeBtn);

// Check saved preference
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    enableDarkMode();
}

darkModeBtn.addEventListener('click', function() {
    const body = document.body;
    if (body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('darkMode', 'true');
    
    // Add dark mode styles
    if (!document.getElementById('dark-mode-styles')) {
        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.textContent = `
            .dark-mode {
                background: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            .dark-mode .header,
            .dark-mode .footer {
                background: #000000 !important;
            }
            .dark-mode .navbar,
            .dark-mode .card,
            .dark-mode .service-item,
            .dark-mode .blog-item,
            .dark-mode .team-item .team-text,
            .dark-mode .price-item {
                background: #2a2a2a !important;
                color: #e0e0e0 !important;
                box-shadow: 0 0 30px rgba(255,255,255,.1) !important;
            }
            .dark-mode h1, .dark-mode h2, .dark-mode h3, 
            .dark-mode h4, .dark-mode h5, .dark-mode h6 {
                color: #FFD662 !important;
            }
            .dark-mode p, .dark-mode a {
                color: #d0d0d0 !important;
            }
            .dark-mode .page-header {
                background: #2a2a2a !important;
            }
            .dark-mode .page-header h2 {
                color: #FFD662 !important;
            }
        `;
        document.head.appendChild(style);
    }
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', 'false');
}


// ============================================
// FITUR 4: IMAGE LAZY LOADING
// ============================================
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('lazy-loaded');
            
            // Add fade-in animation
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s';
            img.onload = () => {
                img.style.opacity = '1';
            };
            
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

lazyImages.forEach(img => imageObserver.observe(img));


// ============================================
// FITUR 5: SCROLL PROGRESS BAR
// ============================================
// Create progress bar
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress-bar';
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(to right, #00539C, #FFD662);
    width: 0%;
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.insertBefore(progressBar, document.body.firstChild);

// Update progress on scroll
window.addEventListener('scroll', function() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});


// ============================================
// BONUS: SMOOTH SCROLL untuk semua anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#navbarNav') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});


// ============================================
// BONUS: Loading Animation
// ============================================
window.addEventListener('load', function() {
    // Create loading overlay
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #00539C;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s;
    `;
    loader.innerHTML = `
        <div style="text-align: center; color: white;">
            <h2 style="color: #FFD662; font-size: 48px; margin-bottom: 20px;">Beresly</h2>
            <div class="spinner" style="
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid #FFD662;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            "></div>
        </div>
    `;
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.insertBefore(loader, document.body.firstChild);
    
    // Hide loader after page load
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 1000);
});


// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c🎉 Beresly Interactive Features Loaded! ', 'background: #00539C; color: #FFD662; font-size: 16px; padding: 10px;');
console.log('%c✅ 5 Fitur JavaScript Murni Aktif:', 'color: #00539C; font-weight: bold; font-size: 14px;');
console.log('1. ✅ Mobile Menu Toggle');
console.log('2. ✅ Form Validation');
console.log('3. ✅ Dark Mode Toggle');
console.log('4. ✅ Image Lazy Loading');
console.log('5. ✅ Scroll Progress Bar');