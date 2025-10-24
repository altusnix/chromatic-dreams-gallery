import { BlogNavigation } from './navigation-component.js';

export class BlogRouter {
  constructor() {
    this.isEnabled = this.shouldEnableRouting();
    this.currentPath = window.location.pathname;

    if (this.isEnabled) {
      this.init();
    }
  }

  shouldEnableRouting() {
    // Only enable enhanced routing if:
    // - Browser supports necessary APIs
    // - User doesn't prefer reduced motion
    // - We're on a blog page
    return (
      'history' in window &&
      'fetch' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.location.pathname.includes('/blog')
    );
  }

  init() {
    this.setupEventListeners();
    this.preloadAdjacentPosts();
    this.addTransitionStyles();
  }

  setupEventListeners() {
    // Intercept blog navigation clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (this.shouldInterceptLink(href)) {
        e.preventDefault();
        this.navigateTo(href);
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      const path = window.location.pathname;
      if (path.includes('/blog')) {
        this.loadPage(path);
      }
    });

    // Preload on hover for instant navigation
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href*="/blog/"]');
      if (link && !link.dataset.preloaded) {
        this.preloadPage(link.href);
        link.dataset.preloaded = 'true';
      }
    });
  }

  shouldInterceptLink(href) {
    if (!href) return false;

    // Only intercept blog links on same origin
    try {
      const url = new URL(href, window.location.origin);
      return (
        url.host === window.location.host && // Use host instead of origin to include port
        url.pathname.includes('/blog') &&
        url.pathname !== this.currentPath
      );
    } catch {
      return false;
    }
  }

  async navigateTo(href) {
    // Add loading state
    this.showLoadingState();

    try {
      await this.loadPage(href);

      // Update browser history
      window.history.pushState({ path: href }, '', href);
      this.currentPath = href;

      // Preload adjacent posts
      this.preloadAdjacentPosts();

    } catch (error) {
      console.error('Enhanced navigation failed:', error);
      // Fallback to regular navigation
      window.location.href = href;
    } finally {
      this.hideLoadingState();
    }
  }

  async loadPage(href) {
    // Check if page is already cached
    const cached = this.getFromCache(href);
    if (cached) {
      this.updatePageContent(cached);
      return;
    }

    // Fetch new page
    const response = await fetch(href);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const pageData = this.extractPageData(html);

    // Cache the page
    this.addToCache(href, pageData);

    // Update current page
    this.updatePageContent(pageData);
  }

  extractPageData(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return {
      title: doc.title,
      content: doc.querySelector('.blog-content')?.innerHTML || '',
      meta: {
        description: doc.querySelector('meta[name="description"]')?.content || '',
        keywords: doc.querySelector('meta[name="keywords"]')?.content || ''
      }
    };
  }

  updatePageContent(pageData) {
    // Update page title
    document.title = pageData.title;

    // Update meta tags
    this.updateMetaTags(pageData.meta);

    // Update content with transition
    const contentContainer = document.querySelector('.blog-content');
    if (contentContainer) {
      // Fade out
      contentContainer.style.opacity = '0';

      setTimeout(() => {
        // Update content
        contentContainer.innerHTML = pageData.content;

        // Re-initialize navigation for new content
        const nav = new BlogNavigation();
        nav.initializeDropdown();

        // Fade in
        contentContainer.style.opacity = '1';

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    }
  }

  updateMetaTags(meta) {
    // Update description
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && meta.description) {
      descMeta.setAttribute('content', meta.description);
    }

    // Update keywords
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta && meta.keywords) {
      keywordsMeta.setAttribute('content', meta.keywords);
    }
  }

  showLoadingState() {
    document.body.classList.add('page-loading');

    // Optional: Show loading indicator
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);
  }

  hideLoadingState() {
    document.body.classList.remove('page-loading');

    // Remove loading indicator
    const loader = document.querySelector('.page-loader');
    if (loader) {
      loader.remove();
    }
  }

  addTransitionStyles() {
    // Add CSS for smooth transitions
    const style = document.createElement('style');
    style.textContent = `
      .blog-content {
        transition: opacity 0.15s ease-in-out;
      }

      .page-loading .blog-content {
        pointer-events: none;
      }

      .page-loader {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        pointer-events: none;
      }

      .loader-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top: 3px solid var(--glow-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // Simple in-memory cache for visited pages
  getFromCache(href) {
    if (!this.cache) this.cache = new Map();
    return this.cache.get(href);
  }

  addToCache(href, data) {
    if (!this.cache) this.cache = new Map();

    // Limit cache size to prevent memory issues
    if (this.cache.size > 10) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(href, data);
  }

  async preloadPage(href) {
    if (this.getFromCache(href)) return; // Already cached

    try {
      const response = await fetch(href);
      if (response.ok) {
        const html = await response.text();
        const pageData = this.extractPageData(html);
        this.addToCache(href, pageData);
      }
    } catch (error) {
      // Preloading failed, but that's okay
      console.debug('Preload failed for:', href);
    }
  }

  preloadAdjacentPosts() {
    // Preload next/previous post links for instant navigation
    const prevLink = document.querySelector('.nav-post.prev a');
    const nextLink = document.querySelector('.nav-post.next a');

    if (prevLink) this.preloadPage(prevLink.href);
    if (nextLink) this.preloadPage(nextLink.href);
  }
}

// Auto-initialize router when DOM is ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.blogRouter = new BlogRouter();
  });
}