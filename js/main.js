/**
 * Portfolio Website Scripts - Namitha A
 * Vanilla JavaScript (Recruiter-friendly, modular, accessible)
 */

// ==========================================================================
// 1. CONFIGURATION CONSTANTS (Easily editable)
// ==========================================================================
// Swap in real profile URLs here when available:
const GITHUB_URL = "#"; // e.g. "https://github.com/namitha-a"
const LINKEDIN_URL = "#"; // e.g. "https://linkedin.com/in/namitha-a"
const RESUME_PATH = "assets/resume.html";
const CONTACT_EMAIL = "namitha8602@gmail.com";

// ==========================================================================
// 2. DOM INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroPhotoFallback();
  initSocialLinks();
  initCopyButtons();
  initContactForm();
  initScrollSpy();
  initScrollAnimations();
  initBackToTop();
});

// ==========================================================================
// 3. TOAST NOTIFICATION SYSTEM
// ==========================================================================
function showToast(message, duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  toast.innerHTML = `
    <div class="toast-icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <div class="toast-message">${escapeHTML(message)}</div>
  `;

  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.add('toast-hiding');
    toast.addEventListener('transitionend', () => {
      if (toast.parentElement) {
        toast.remove();
      }
    });
  }, duration);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================================================
// 4. SOCIAL & EXTERNAL LINK HANDLERS
// ==========================================================================
function initSocialLinks() {
  // Handles GitHub triggers across the site
  document.querySelectorAll('[data-social="github"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (!GITHUB_URL || GITHUB_URL === '#') {
        showToast('GitHub link will be added soon');
      } else {
        window.open(GITHUB_URL, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // Handles LinkedIn triggers across the site
  document.querySelectorAll('[data-social="linkedin"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (!LINKEDIN_URL || LINKEDIN_URL === '#') {
        showToast('LinkedIn link will be added soon');
      } else {
        window.open(LINKEDIN_URL, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

// ==========================================================================
// 5. NAVIGATION & MOBILE DRAWER
// ==========================================================================
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Navbar shadow on scroll
  const handleScrollNavbar = () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar();

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.classList.toggle('nav-open', navMenu.classList.contains('open'));
    });

    const moreBtn = document.querySelector('.nav-more-btn');
    const moreDropdown = document.querySelector('.nav-dropdown');

    if (moreBtn && moreDropdown) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = moreDropdown.classList.toggle('open');
        moreBtn.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', (e) => {
        if (!moreDropdown.contains(e.target)) {
          moreDropdown.classList.remove('open');
          moreBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Close when clicking links
    navLinks.forEach(link => {
      if (link.classList.contains('nav-more-btn')) return;
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.classList.remove('nav-open');
        moreDropdown?.classList.remove('open');
        moreBtn?.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      moreDropdown?.classList.remove('open');
      moreBtn?.setAttribute('aria-expanded', 'false');
      if (navMenu.classList.contains('open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.classList.remove('nav-open');
        navToggle.focus();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navbar.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.classList.remove('nav-open');
      }
    });
  }
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const value = btn.getAttribute('data-copy') || '';
      const label = btn.getAttribute('data-copy-label') || 'Value';
      const originalText = btn.textContent;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          // Fallback for non-https or older browser environments
          const textArea = document.createElement('textarea');
          textArea.value = value;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        showToast(`${label} copied to clipboard`);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        showToast(`Could not copy ${label.toLowerCase()}`);
      }
    });
  });
}

// ==========================================================================
// 6. SCROLLSPY ACTIVE LINK HIGHLIGHTING
// ==========================================================================
function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = document.querySelectorAll('.nav-menu a.nav-link');
  const moreBtn = document.querySelector('.nav-more-btn');
  const moreHrefs = Array.from(document.querySelectorAll('.nav-more-menu a.nav-link'))
    .map((link) => link.getAttribute('href'));

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;
    let currentId = sections[0] ? sections[0].id : '';

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });

    if (moreBtn) {
      moreBtn.classList.toggle('active', moreHrefs.includes(`#${currentId}`));
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ==========================================================================
// 7. ENTRANCE SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ==========================================================================
function initScrollAnimations() {
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ==========================================================================
// 8. CONTACT FORM (MAILTO INTEGRATION)
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const subjectInput = document.getElementById('formSubject');
    const messageInput = document.getElementById('formMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : `Portfolio Contact from ${name || 'Recruiter'}`;
    const message = messageInput ? messageInput.value.trim() : '';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const setFieldState = (input, errorEl, invalid) => {
      input?.classList.toggle('is-invalid', invalid);
      if (errorEl) errorEl.hidden = !invalid;
    };

    setFieldState(nameInput, document.getElementById('formNameError'), !name);
    setFieldState(emailInput, document.getElementById('formEmailError'), !emailOk);
    setFieldState(messageInput, document.getElementById('formMessageError'), !message);

    if (!name || !emailOk || !message) {
      showToast('Please fill in all required fields.');
      return;
    }

    // Format body for email
    const emailBody = `Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    // Feedback to user
    showToast('Opening your email client to send message...');

    // Open mail client
    window.location.href = mailtoUrl;

    // Reset form after short delay
    setTimeout(() => {
      form.reset();
    }, 1000);
  });
}

// ==========================================================================
// 9. BACK TO TOP BUTTON
// ==========================================================================
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==========================================================================
// 10. HERO PHOTO FALLBACK
// ==========================================================================
function initHeroPhotoFallback() {
  const photo = document.getElementById('heroPhoto');
  if (!photo) return;

  const frame = photo.closest('.hero-image-frame');
  const showFallback = () => frame?.classList.add('has-fallback');

  photo.addEventListener('error', showFallback);

  if (photo.complete && photo.naturalWidth === 0) {
    showFallback();
  }
}
