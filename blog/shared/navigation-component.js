import { blogPosts } from './blog-data.js';

export class BlogNavigation {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.setupEventListeners();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('/blog/') && path.includes('.html')) {
      // Extract slug from path like /blog/the-evolution-of-glass.html
      const filename = path.split('/').pop().replace('.html', '');
      return filename;
    }
    return 'blog-home';
  }

  generateNavigation() {
    return `
      <nav class="blog-nav">
        <a href="/" class="nav-link">Home</a>
        <a href="/#gallery" class="nav-link">Gallery</a>
        <div class="nav-dropdown">
          <button class="dropdown-toggle" id="blog-dropdown">
            <span>Blog</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="dropdown-menu" id="blog-menu">
            <a href="/blog.html" class="dropdown-item">
              <div class="dropdown-item-title">All Posts</div>
              <div class="dropdown-item-meta">Browse all articles</div>
            </a>
            ${this.generatePostLinks()}
          </div>
        </div>
        <a href="/#contact" class="nav-link">Contact</a>
      </nav>
    `;
  }

  generatePostLinks() {
    // Simplified version for debugging
    return blogPosts
      .slice(0, 8) // Show first 8 posts in dropdown
      .map(post => `
        <a href="/blog/${post.slug}.html" class="dropdown-item">
          <div class="dropdown-item-title">${post.title}</div>
          <div class="dropdown-item-meta">${post.category} • ${post.readTime}</div>
        </a>
      `).join('');
  }

  generateBackToBlog() {
    if (this.currentPage === 'blog-home') return '';

    return `
      <a href="/blog.html" class="back-to-blog">
        <span class="back-arrow">←</span>
        <span>Back to Blog</span>
      </a>
    `;
  }

  generatePostNavigation(currentPostId) {
    if (!currentPostId || this.currentPage === 'blog-home') return '';

    const currentPost = blogPosts.find(post => post.slug === currentPostId);
    if (!currentPost) return '';

    const currentIndex = blogPosts.findIndex(post => post.id === currentPost.id);
    const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

    return `
      <nav class="post-navigation">
        <div class="nav-post prev">
          ${prevPost ? `
            <a href="/blog/${prevPost.slug}.html">
              <div class="nav-direction">Previous Post</div>
              <div class="nav-title">${prevPost.title}</div>
              <div class="nav-excerpt">${prevPost.excerpt.substring(0, 100)}...</div>
            </a>
          ` : ''}
        </div>
        <div class="nav-post next">
          ${nextPost ? `
            <a href="/blog/${nextPost.slug}.html">
              <div class="nav-direction">Next Post</div>
              <div class="nav-title">${nextPost.title}</div>
              <div class="nav-excerpt">${nextPost.excerpt.substring(0, 100)}...</div>
            </a>
          ` : ''}
        </div>
      </nav>
    `;
  }

  generateRelatedPosts(currentPostId, limit = 2) {
    if (!currentPostId || this.currentPage === 'blog-home') return '';

    const currentPost = blogPosts.find(post => post.slug === currentPostId);
    if (!currentPost) return '';

    const related = this.getRelatedPosts(currentPost, limit);

    if (related.length === 0) return '';

    return `
      <section class="related-posts">
        <h3>Related Articles</h3>
        <div class="related-grid">
          ${related.map(post => `
            <article class="related-post">
              <img src="${post.heroImage}" alt="${post.heroImageAlt}">
              <div class="related-content">
                <h4>${post.title}</h4>
                <p>${post.excerpt.substring(0, 120)}...</p>
                <a href="/blog/${post.slug}.html" class="read-more">Read More</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  getRelatedPosts(currentPost, limit = 3) {
    const related = blogPosts
      .filter(post => post.id !== currentPost.id)
      .filter(post =>
        post.category === currentPost.category ||
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
      .slice(0, limit);

    if (related.length < limit) {
      const additional = blogPosts
        .filter(post => post.id !== currentPost.id)
        .filter(post => !related.includes(post))
        .slice(0, limit - related.length);
      related.push(...additional);
    }

    return related;
  }

  setupEventListeners() {
    // Set up dropdown functionality
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeDropdown();
    });

    // Handle navigation enhancement
    document.addEventListener('click', (e) => {
      const blogLink = e.target.closest('a[href*="/blog/"]');
      if (blogLink && this.shouldEnhanceNavigation()) {
        e.preventDefault();
        this.navigateToPost(blogLink.href);
      }
    });
  }

  initializeDropdown() {
    console.log('Initializing dropdown...');
    const dropdownToggle = document.getElementById('blog-dropdown');
    const dropdownMenu = document.getElementById('blog-menu');

    console.log('Elements found:', {
      toggle: !!dropdownToggle,
      menu: !!dropdownMenu
    });

    if (!dropdownToggle || !dropdownMenu) {
      console.error('Dropdown elements not found!');
      return;
    }

    // Remove any existing event listeners first
    const newToggle = dropdownToggle.cloneNode(true);
    dropdownToggle.parentNode.replaceChild(newToggle, dropdownToggle);

    newToggle.addEventListener('click', (e) => {
      console.log('Dropdown toggle clicked');
      e.preventDefault();
      e.stopPropagation();

      const menu = document.getElementById('blog-menu');
      const isOpen = menu.classList.contains('open');

      if (isOpen) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const toggle = document.getElementById('blog-dropdown');
      const menu = document.getElementById('blog-menu');

      if (toggle && menu && !toggle.contains(e.target) && !menu.contains(e.target)) {
        this.closeDropdown();
      }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });

    console.log('Dropdown initialized successfully');
  }

  openDropdown() {
    const dropdownToggle = document.getElementById('blog-dropdown');
    const dropdownMenu = document.getElementById('blog-menu');

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.classList.add('open');
      dropdownMenu.classList.add('open');
    }
  }

  closeDropdown() {
    const dropdownToggle = document.getElementById('blog-dropdown');
    const dropdownMenu = document.getElementById('blog-menu');

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.classList.remove('open');
      dropdownMenu.classList.remove('open');
    }
  }

  shouldEnhanceNavigation() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !prefersReducedMotion && 'history' in window;
  }

  async navigateToPost(url) {
    try {
      // Add loading state
      document.body.classList.add('page-transitioning');

      // Fetch the new page
      const response = await fetch(url);
      const html = await response.text();

      // Extract content from the new page
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, 'text/html');
      const newContent = newDoc.querySelector('.blog-content');

      if (newContent) {
        // Update the current page content
        const currentContent = document.querySelector('.blog-content');
        if (currentContent) {
          currentContent.innerHTML = newContent.innerHTML;

          // Update browser history
          window.history.pushState({}, '', url);

          // Update page title
          document.title = newDoc.title;

          // Re-initialize navigation for new content
          this.initializeDropdown();

          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error('Navigation enhancement failed:', error);
      // Fallback to regular navigation
      window.location.href = url;
    } finally {
      document.body.classList.remove('page-transitioning');
    }
  }

  // Static method to inject navigation into existing pages
  static injectNavigation(targetSelector = '.blog-header .header-content nav') {
    const nav = new BlogNavigation();
    const targetElement = document.querySelector(targetSelector);

    if (targetElement) {
      targetElement.outerHTML = nav.generateNavigation();
      nav.initializeDropdown();
    }

    return nav;
  }

  // Static method to inject post navigation
  static injectPostNavigation(currentPostId, targetSelector = '.post-footer-full') {
    const nav = new BlogNavigation();
    const targetElement = document.querySelector(targetSelector);

    if (targetElement) {
      const navigationHTML = nav.generatePostNavigation(currentPostId);
      if (navigationHTML) {
        targetElement.insertAdjacentHTML('afterend', navigationHTML);
      }
    }
  }

  // Static method to inject back to blog link
  static injectBackToBlog(targetSelector = '.blog-content') {
    const nav = new BlogNavigation();
    const targetElement = document.querySelector(targetSelector);

    if (targetElement) {
      const backLinkHTML = nav.generateBackToBlog();
      if (backLinkHTML) {
        targetElement.insertAdjacentHTML('afterbegin', backLinkHTML);
      }
    }
  }

  // Static method to inject related posts
  static injectRelatedPosts(currentPostId, targetSelector = '.post-navigation') {
    const nav = new BlogNavigation();
    const targetElement = document.querySelector(targetSelector);

    if (targetElement) {
      const relatedHTML = nav.generateRelatedPosts(currentPostId);
      if (relatedHTML) {
        targetElement.insertAdjacentHTML('afterend', relatedHTML);
      }
    }
  }
}

// Auto-initialize if this script is loaded directly
if (typeof window !== 'undefined') {
  window.BlogNavigation = BlogNavigation;
}