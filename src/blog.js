import './style.css'

// === BLOG PAGE FUNCTIONALITY ===

class BlogPage {
  constructor() {
    this.init();
  }

  async init() {
    this.setupEventListeners();
  }


  // === EVENT LISTENERS ===
  setupEventListeners() {
    // Blog dropdown navigation
    this.setupBlogDropdown();

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        this.handleNewsletterSubmit(e);
      });
    }

    // Blog post clicks
    const blogPosts = document.querySelectorAll('.blog-post');
    blogPosts.forEach(post => {
      post.addEventListener('click', () => {
        this.handleBlogPostClick(post);
      });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleAnchorClick(e);
      });
    });
  }

  // === EVENT HANDLERS ===
  handleNewsletterSubmit(e) {
    // Form will be handled by Netlify, but we can add visual feedback
    const submitBtn = e.target.querySelector('.newsletter-btn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    // Reset after a delay (in case of errors)
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 3000);
  }

  handleBlogPostClick(post) {
    // Add visual feedback
    post.style.transform = 'translateY(-8px) scale(1.02)';

    setTimeout(() => {
      post.style.transform = '';
    }, 200);

    // In a real implementation, this would navigate to the full post
    console.log('Blog post clicked:', post.querySelector('.post-title-small')?.textContent);
  }

  handleAnchorClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');

    if (targetId === '#' || !targetId) return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // === BLOG NAVIGATION ===
  setupBlogDropdown() {
    const dropdownToggle = document.getElementById('blog-dropdown');
    const dropdownMenu = document.getElementById('blog-menu');

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = dropdownMenu.classList.contains('open');

        if (isOpen) {
          this.closeBlogDropdown();
        } else {
          this.openBlogDropdown();
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
          this.closeBlogDropdown();
        }
      });

      // Close dropdown on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeBlogDropdown();
        }
      });
    }
  }

  openBlogDropdown() {
    const dropdownToggle = document.getElementById('blog-dropdown');
    const dropdownMenu = document.getElementById('blog-menu');

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.classList.add('open');
      dropdownMenu.classList.add('open');
    }
  }

  closeBlogDropdown() {
    const dropdownToggle = document.getElementById('blog-dropdown');
    const dropdownMenu = document.getElementById('blog-menu');

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.classList.remove('open');
      dropdownMenu.classList.remove('open');
    }
  }

  // === UTILITY FUNCTIONS ===
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      background: type === 'success' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: `1px solid rgba(${type === 'success' ? '0, 255, 0' : '255, 255, 255'}, 0.3)`,
      borderRadius: '15px',
      padding: '1rem 1.5rem',
      color: 'white',
      fontWeight: '500',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }
}

// Initialize blog page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.blog = new BlogPage();
});

export default BlogPage;