import './style.css'

// === DREAMS MEOW ART GALLERY ===

class DreamsMeowGallery {
  constructor() {
    this.currentFilter = 'all';
    this.projects = [];
    this.allImages = [];
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mousePos = { x: 0, y: 0 };
    this.currentPage = 'home';
    this.heroCanvas = null;
    this.heroCtx = null;
    this.currentProject = null;
    this.currentImageIndex = 0;
    // Initialize banner slider properties (separate from gallery slideshow)
    this.bannerCurrentSlide = 0;
    this.bannerTotalSlides = 0;
    this.bannerSliderInterval = null;

    this.init();
  }

  async init() {
    this.initializeBackground();
    this.loadProjects();
    this.initializeHomePage();
    this.initializePhotoSkullGrid();
    this.setupEventListeners();
    this.startBackgroundAnimation();
    this.initializeExhibitionPreviews();
    this.showPage('home');
  }

  // === PHOTO SKULL GRID ===
  initializePhotoSkullGrid() {
    const photoCells = document.querySelectorAll('.photo-cell[data-image]');
    photoCells.forEach(cell => {
      const imagePath = cell.getAttribute('data-image');
      cell.style.backgroundImage = `url('${imagePath}')`;

      // Add click handler to show image in gallery
      cell.addEventListener('click', () => {
        // Extract filename from path
        const filename = imagePath.split('/').pop();

        // Find the image in our projects and open it
        for (const project of this.projects) {
          const foundImage = project.images.find(img => img.filename === filename);
          if (foundImage) {
            // Create proper artwork object for the immersive view
            const artwork = {
              ...foundImage,
              projectId: project.id,
              projectTitle: project.title,
              series: project.title,
              medium: project.medium,
              imageUrl: `/art-portfolio/${project.id}/${foundImage.filename}`,
              colorCategory: project.colorCategory
            };
            this.openImmersiveView(artwork);
            break;
          }
        }
      });
    });
  }

  // === BACKGROUND ANIMATION ===
  initializeBackground() {
    this.canvas = document.getElementById('background-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Create particles
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        hue: Math.random() * 360,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startBackgroundAnimation() {
    const animate = () => {
      this.updateBackground();
      requestAnimationFrame(animate);
    };
    animate();
  }

  updateBackground() {
    // Clear canvas with fade effect
    this.ctx.fillStyle = 'rgba(20, 10, 30, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Update hue for color shifting
      particle.hue += 0.5;
      if (particle.hue > 360) particle.hue = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.alpha})`;
      this.ctx.fill();

      // Draw connections to nearby particles
      this.particles.forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100 && distance > 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = `hsla(${(particle.hue + otherParticle.hue) / 2}, 60%, 50%, ${0.1 * (1 - distance / 100)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });
  }

  // === PROJECT PORTFOLIO LOADING ===
  loadProjects() {
    // Project data organized by folders
    this.projects = [
      {
        id: 'glass',
        title: 'Glass Art Series',
        description: 'Exploration of light, transparency, and crystalline forms through glass artwork',
        medium: 'Glass Sculpture',
        colorCategory: 'blue',
        images: [
          { filename: 'glass_000.jpeg', title: 'Crystal Refraction', description: 'Light dancing through transparent forms', size: '8" x 6" x 4"', year: '2024' },
          { filename: 'glass_001.jpg', title: 'Luminous Depths', description: 'Exploring the interplay of light and shadow', size: '10" x 8" x 6"', year: '2024' },
          { filename: 'glass_002.jpg', title: 'Fractured Light', description: 'Breaking light into spectrum components', size: '12" x 10" x 8"', year: '2024' },
          { filename: 'glass_003.jpg', title: 'Crystalline Dreams', description: 'Dreams captured in crystal formations', size: '6" x 6" x 6"', year: '2024' },
          { filename: 'glass_004.jpg', title: 'Transparent Visions', description: 'Visions through translucent medium', size: '14" x 12" x 10"', year: '2024' },
          { filename: 'glass_005.jpg', title: 'Prism Portal', description: 'Gateway through prismatic glass', size: '16" x 14" x 12"', year: '2024' },
          { filename: 'glass_006.jpg', title: 'Light Captured', description: 'Capturing light in solid form', size: '8" x 8" x 8"', year: '2024' },
          { filename: 'glass_007.jpg', title: 'Crystal Cascade', description: 'Flowing forms in crystalline structure', size: '18" x 16" x 14"', year: '2024' },
          { filename: 'glass_010.jpeg', title: 'Illuminated Geometry', description: 'Geometric patterns in illuminated glass', size: '10" x 10" x 10"', year: '2024' },
          { filename: 'glass_011.jpeg', title: 'Spectral Formation', description: 'Formation through spectral analysis', size: '12" x 12" x 12"', year: '2024' },
          { filename: 'glass_017.jpeg', title: 'Radiant Structure', description: 'Structural beauty through radiant light', size: '20" x 18" x 16"', year: '2024' },
          { filename: 'glass_019.jpeg', title: 'Crystal Matrix', description: 'Complex crystalline matrix formations', size: '14" x 12" x 10"', year: '2024' },
          { filename: 'glass_020.jpeg', title: 'Ethereal Transparency', description: 'Ethereal qualities of transparent materials', size: '16" x 14" x 12"', year: '2024' },
          { filename: 'glass_021.jpeg', title: 'Light Symphony', description: 'Symphony of light through glass', size: '18" x 16" x 14"', year: '2024' },
          { filename: 'glass_022.jpeg', title: 'Prismatic Dreams', description: 'Dreams expressed through prismatic forms', size: '12" x 10" x 8"', year: '2024' }
        ]
      },
      {
        id: 'wire-wraps',
        title: 'Wire Wrapped Jewelry',
        description: 'Intricate wire wrapping techniques creating wearable art with crystals and gemstones',
        medium: 'Wire & Stone',
        colorCategory: 'purple',
        images: [
          { filename: 'wire_001.jpeg', title: 'Amethyst Dreams', description: 'Wire wrapped amethyst pendant with intricate spiral design', size: '2" x 1.5"', year: '2024' },
          { filename: 'wire_004.jpeg', title: 'Crystal Embrace', description: 'Delicate wire work embracing natural crystal formations', size: '1.5" x 1"', year: '2024' },
          { filename: 'wire_005.jpeg', title: 'Sacred Geometry', description: 'Sacred geometric patterns in wire and stone', size: '2.2" x 1.8"', year: '2024' },
          { filename: 'wire_006.jpeg', title: 'Celestial Binding', description: 'Celestial-inspired wire wrapping techniques', size: '1.8" x 1.5"', year: '2024' },
          { filename: 'wire_007.jpeg', title: 'Nature\'s Crown', description: 'Natural stone crowned with intricate wirework', size: '2.5" x 2"', year: '2024' },
          { filename: 'wire_008.jpeg', title: 'Mystic Weave', description: 'Mystical patterns woven in copper and silver', size: '2" x 1.5"', year: '2024' },
          { filename: 'wire_012.jpeg', title: 'Crystal Matrix', description: 'Complex matrix of wire and crystal energy', size: '2.8" x 2.2"', year: '2024' },
          { filename: 'wire_013.jpeg', title: 'Elemental Flow', description: 'Flowing elements captured in wire art', size: '2.3" x 1.8"', year: '2024' },
          { filename: 'wire_014.jpeg', title: 'Harmony Stone', description: 'Stone and wire in perfect harmony', size: '2" x 1.6"', year: '2024' },
          { filename: 'wire_015.jpeg', title: 'Spiritual Mandala', description: 'Mandala patterns expressed in wire wrapping', size: '2.4" x 2"', year: '2024' },
          { filename: 'wire_016.jpeg', title: 'Earth Connection', description: 'Connecting earth energies through wire and stone', size: '2.1" x 1.7"', year: '2024' },
          { filename: 'wire_017.jpeg', title: 'Divine Framework', description: 'Divine geometric framework in precious metals', size: '2.6" x 2.1"', year: '2024' }
        ]
      },
      {
        id: 'evolution-project',
        title: 'Evolution Project',
        description: 'A series exploring the evolution of consciousness and form through mixed media artwork',
        medium: 'Mixed Media',
        colorCategory: 'red',
        images: [
          { filename: '1.jpeg', title: 'Genesis', description: 'The beginning of conscious evolution', size: 'Mixed Media', year: '2024' },
          { filename: '2.jpeg', title: 'Emergence', description: 'Emerging consciousness breaking through barriers', size: 'Mixed Media', year: '2024' },
          { filename: '3.jpeg', title: 'Transformation', description: 'The process of spiritual transformation', size: 'Mixed Media', year: '2024' },
          { filename: '4.jpeg', title: 'Ascension', description: 'Rising to higher levels of consciousness', size: 'Mixed Media', year: '2024' },
          { filename: '5.jpeg', title: 'Integration', description: 'Integrating new levels of awareness', size: 'Mixed Media', year: '2024' },
          { filename: '7.jpeg', title: 'Expansion', description: 'Consciousness expanding beyond limitations', size: 'Mixed Media', year: '2024' },
          { filename: '8.jpeg', title: 'Unity', description: 'The realization of universal unity', size: 'Mixed Media', year: '2024' },
          { filename: '9.jpeg', title: 'Transcendence', description: 'Transcending the boundaries of form', size: 'Mixed Media', year: '2024' }
        ]
      },
      {
        id: 'nature',
        title: 'Nature Photography',
        description: 'Capturing the raw beauty and spiritual essence of the natural world',
        medium: 'Photography',
        colorCategory: 'green',
        images: [
          { filename: 'photo_003.jpg', title: 'Forest Cathedral', description: 'Sunlight streaming through ancient forest canopy', size: 'Digital', year: '2024' },
          { filename: 'photo_004.jpg', title: 'Mountain Majesty', description: 'Majestic peaks touching the infinite sky', size: 'Digital', year: '2024' },
          { filename: 'photo_005.jpg', title: 'River\'s Journey', description: 'Water\'s eternal journey through landscape', size: 'Digital', year: '2024' },
          { filename: 'photo_043.jpg', title: 'Wildflower Meditation', description: 'Delicate wildflowers in morning meditation', size: 'Digital', year: '2024' },
          { filename: 'photo_044.jpg', title: 'Stone Wisdom', description: 'Ancient stones holding earth\'s wisdom', size: 'Digital', year: '2024' },
          { filename: 'photo_045.jpg', title: 'Cloud Dance', description: 'Clouds dancing across endless skies', size: 'Digital', year: '2024' },
          { filename: 'photo_046.jpg', title: 'Tree Spirit', description: 'The spiritual presence within old growth trees', size: 'Digital', year: '2024' },
          { filename: 'photo_047.jpg', title: 'Ocean\'s Breath', description: 'The rhythmic breathing of ocean waves', size: 'Digital', year: '2024' },
          { filename: 'photo_048.jpg', title: 'Desert Silence', description: 'The profound silence of desert landscapes', size: 'Digital', year: '2024' },
          { filename: 'photo_049.jpg', title: 'Sunset Reflection', description: 'Day\'s end reflected in still waters', size: 'Digital', year: '2024' },
          { filename: 'photo_050.jpg', title: 'Earth\'s Patterns', description: 'Natural patterns revealing earth\'s geometry', size: 'Digital', year: '2024' }
        ]
      },
      {
        id: 'light-paintings',
        title: 'Light Paintings',
        description: 'Long exposure photography capturing light in motion',
        medium: 'Photography',
        colorCategory: 'yellow',
        images: [
          { filename: 'photo_007.jpg', title: 'Light Spiral', description: 'Spiraling light creating cosmic patterns', size: 'Digital', year: '2024' },
          { filename: 'photo_008.jpg', title: 'Energy Flow', description: 'Energy flowing through space and time', size: 'Digital', year: '2024' },
          { filename: 'photo_009.jpg', title: 'Luminous Path', description: 'Path of light through darkness', size: 'Digital', year: '2024' },
          { filename: 'photo_020.jpg', title: 'Light Weaving', description: 'Weaving patterns of pure light', size: 'Digital', year: '2024' },
          { filename: 'photo_034.jpg', title: 'Celestial Dance', description: 'Light dancing like celestial bodies', size: 'Digital', year: '2024' }
        ]
      },
      {
        id: 'photography',
        title: 'Photography Portfolio',
        description: 'Collection of artistic photography exploring abstract concepts and urban landscapes',
        medium: 'Photography',
        colorCategory: 'blue',
        images: [
          { filename: 'photo_022.jpg', title: 'Urban Geometry', description: 'Geometric patterns in urban architecture', size: 'Digital', year: '2024' },
          { filename: 'photo_023.jpg', title: 'Shadow Play', description: 'Interplay of light and shadow', size: 'Digital', year: '2024' },
          { filename: 'photo_029.jpg', title: 'Reflection Study', description: 'Studies in reflection and symmetry', size: 'Digital', year: '2024' },
          { filename: 'photo_035.jpg', title: 'Texture Exploration', description: 'Exploring textures in everyday objects', size: 'Digital', year: '2024' },
          { filename: 'photo_037.jpg', title: 'Minimal Composition', description: 'Minimalist approach to composition', size: 'Digital', year: '2024' },
          { filename: 'photo_038.jpg', title: 'Color Study', description: 'Studies in color and emotion', size: 'Digital', year: '2024' },
          { filename: 'photo_041.jpg', title: 'Abstract Reality', description: 'Finding abstraction in reality', size: 'Digital', year: '2024' },
          { filename: 'photo_042.jpg', title: 'Moment Captured', description: 'Capturing fleeting moments of beauty', size: 'Digital', year: '2024' }
        ]
      },
      {
        id: 'me',
        title: 'Self Portraits',
        description: 'Artistic self-exploration through photography and creative expression',
        medium: 'Photography',
        colorCategory: 'purple',
        images: [
          { filename: 'photo_010.jpg', title: 'Inner Light', description: 'Exploring the light within', size: 'Digital', year: '2024' },
          { filename: 'photo_011.jpg', title: 'Shadow Self', description: 'Embracing the shadow aspects', size: 'Digital', year: '2024' },
          { filename: 'photo_012.jpg', title: 'Transformation', description: 'Capturing moments of personal transformation', size: 'Digital', year: '2024' },
          { filename: 'photo_013.jpg', title: 'Reflection', description: 'Deep self-reflection through imagery', size: 'Digital', year: '2024' },
          { filename: 'photo_014.jpg', title: 'Creative Spirit', description: 'The creative spirit in motion', size: 'Digital', year: '2024' },
          { filename: 'photo_015.jpg', title: 'Artistic Identity', description: 'Exploring artistic identity and expression', size: 'Digital', year: '2024' },
          { filename: 'photo_016.jpg', title: 'Inner Journey', description: 'Visual documentation of inner journey', size: 'Digital', year: '2024' },
          { filename: 'photo_017.jpg', title: 'Self Discovery', description: 'Moments of self-discovery and growth', size: 'Digital', year: '2024' },
          { filename: 'photo_018.jpg', title: 'Authentic Self', description: 'Revealing the authentic self', size: 'Digital', year: '2024' },
          { filename: 'photo_051.jpg', title: 'Present Moment', description: 'Being fully present in the moment', size: 'Digital', year: '2024' }
        ]
      }
    ];

    // Flatten all images for gallery display
    this.allImages = [];
    this.projects.forEach(project => {
      project.images.forEach(image => {
        this.allImages.push({
          ...image,
          projectId: project.id,
          projectTitle: project.title,
          series: project.title,
          medium: project.medium,
          imageUrl: `/art-portfolio/${project.id}/${image.filename}`,
          colorCategory: project.colorCategory
        });
      });
    });
  }


  // === HOME PAGE INITIALIZATION ===
  initializeHomePage() {
    this.initializeHeroCanvas();
    this.generatePreviewArtworks();
    this.setupAccordionDrawers();
    this.initializeContactForm();
  }

  initializeHeroCanvas() {
    this.heroCanvas = document.getElementById('hero-canvas');
    if (!this.heroCanvas) return;

    this.heroCtx = this.heroCanvas.getContext('2d');
    this.animateHeroArtwork();
  }

  animateHeroArtwork() {
    if (!this.heroCtx) return;

    let hue = 0;
    const animate = () => {
      if (this.currentPage !== 'home') return;

      // Clear canvas
      this.heroCtx.clearRect(0, 0, 300, 300);

      // Create animated gradient
      const gradient = this.heroCtx.createRadialGradient(150, 150, 0, 150, 150, 150);
      gradient.addColorStop(0, `hsl(${hue}, 80%, 60%)`);
      gradient.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 70%, 50%)`);
      gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 60%, 40%)`);

      this.heroCtx.fillStyle = gradient;
      this.heroCtx.fillRect(0, 0, 300, 300);

      // Add animated shapes
      for (let i = 0; i < 8; i++) {
        const time = Date.now() * 0.001;
        const x = 150 + Math.cos(time + i * 0.8) * (50 + i * 10);
        const y = 150 + Math.sin(time * 0.7 + i * 0.8) * (30 + i * 8);
        const size = 20 + Math.sin(time * 2 + i) * 10;

        this.heroCtx.beginPath();
        this.heroCtx.arc(x, y, size, 0, Math.PI * 2);
        this.heroCtx.fillStyle = `hsla(${(hue + i * 45) % 360}, 80%, 70%, 0.6)`;
        this.heroCtx.fill();
      }

      hue += 0.5;
      if (hue > 360) hue = 0;

      requestAnimationFrame(animate);
    };
    animate();
  }

  generatePreviewArtworks() {
    const sliderTrack = document.getElementById('slider-track');
    const sliderDots = document.getElementById('slider-dots');
    if (!sliderTrack || !sliderDots) return;

    sliderTrack.innerHTML = '';
    sliderDots.innerHTML = '';

    // Create one slide for each project with its first image
    this.projects.forEach((project, index) => {
      if (project.images.length === 0) return;

      const firstImage = project.images[0];

      // Create slide
      const slide = document.createElement('div');
      slide.className = `slider-slide ${index === 0 ? 'active' : ''}`;
      slide.innerHTML = `
        <div class="slide-image-container">
          <img src="/art-portfolio/${project.id}/${firstImage.filename}" alt="${firstImage.title}" class="slide-image">
          <div class="slide-overlay">
            <div class="slide-content">
              <h3 class="slide-title">${project.title}</h3>
              <p class="slide-description">${project.description}</p>
              <span class="slide-medium">${project.medium}</span>
              <button class="slide-btn" data-project="${project.id}">Explore Collection</button>
            </div>
          </div>
        </div>
      `;

      // Add click handler
      const slideBtn = slide.querySelector('.slide-btn');
      slideBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentFilter = project.id;
        this.showPage('gallery');
      });

      sliderTrack.appendChild(slide);

      // Create dot
      const dot = document.createElement('button');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.goToBannerSlide(index));
      sliderDots.appendChild(dot);
    });

    // Initialize banner slider
    this.bannerCurrentSlide = 0;
    this.bannerTotalSlides = this.projects.filter(p => p.images.length > 0).length;
    this.setupBannerSliderControls();
    this.startBannerSliderAutoplay();
  }

  // === BANNER SLIDER CONTROLS (HOME PAGE) ===
  setupBannerSliderControls() {
    // Clear any existing intervals to prevent conflicts
    if (this.bannerSliderInterval) {
      clearInterval(this.bannerSliderInterval);
      this.bannerSliderInterval = null;
    }

    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');

    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.previousBannerSlide();
      };
    }
    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.nextBannerSlide();
      };
    }
  }

  goToBannerSlide(index) {
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dot');

    // Ensure index is within bounds
    if (index < 0 || index >= this.bannerTotalSlides) return;

    // Remove active class from all
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');

    this.bannerCurrentSlide = index;
  }

  nextBannerSlide() {
    // Ensure bannerTotalSlides is set
    if (!this.bannerTotalSlides || this.bannerTotalSlides <= 1) {
      this.bannerTotalSlides = this.projects ? this.projects.filter(p => p.images && p.images.length > 0).length : 0;
    }
    if (this.bannerTotalSlides <= 1) return;

    const nextIndex = (this.bannerCurrentSlide + 1) % this.bannerTotalSlides;
    this.goToBannerSlide(nextIndex);
  }

  previousBannerSlide() {
    // Ensure bannerTotalSlides is set
    if (!this.bannerTotalSlides || this.bannerTotalSlides <= 1) {
      this.bannerTotalSlides = this.projects ? this.projects.filter(p => p.images && p.images.length > 0).length : 0;
    }
    if (this.bannerTotalSlides <= 1) return;

    const prevIndex = this.bannerCurrentSlide === 0 ? this.bannerTotalSlides - 1 : this.bannerCurrentSlide - 1;
    this.goToBannerSlide(prevIndex);
  }

  startBannerSliderAutoplay() {
    // Clear any existing interval
    if (this.bannerSliderInterval) {
      clearInterval(this.bannerSliderInterval);
    }

    // Auto-advance every 5 seconds
    this.bannerSliderInterval = setInterval(() => {
      this.nextBannerSlide();
    }, 5000);

    // Pause on hover
    const slider = document.getElementById('banner-slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => {
        if (this.bannerSliderInterval) {
          clearInterval(this.bannerSliderInterval);
          this.bannerSliderInterval = null;
        }
      });

      slider.addEventListener('mouseleave', () => {
        if (!this.bannerSliderInterval) {
          this.startBannerSliderAutoplay();
        }
      });
    }
  }

  // === HORIZONTAL ACCORDION FUNCTIONALITY ===
  setupAccordionDrawers() {
    const panels = document.querySelectorAll('.accordion-panel');

    panels.forEach(panel => {
      const tab = panel.querySelector('.panel-tab');

      tab.addEventListener('click', () => {
        const isActive = panel.classList.contains('active');

        // Close all other panels
        panels.forEach(otherPanel => {
          if (otherPanel !== panel) {
            otherPanel.classList.remove('active');
          }
        });

        // Toggle current panel
        panel.classList.toggle('active', !isActive);
      });
    });

    // Open first panel by default
    if (panels.length > 0) {
      panels[0].classList.add('active');
    }
  }

  // === CONTACT FORM FUNCTIONALITY ===
  initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    const submitBtn = contactForm.querySelector('.submit-btn');

    // Add real-time validation
    formInputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // Handle form submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactFormSubmission(contactForm, submitBtn);
    });
  }

  validateField(field) {
    const formGroup = field.closest('.form-group');
    const fieldName = field.name;
    const fieldValue = field.value.trim();

    // Remove existing error message
    this.clearFieldError(field);

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        if (!fieldValue) {
          errorMessage = 'Name is required';
          isValid = false;
        } else if (fieldValue.length < 2) {
          errorMessage = 'Name must be at least 2 characters';
          isValid = false;
        }
        break;

      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!fieldValue) {
          errorMessage = 'Email is required';
          isValid = false;
        } else if (!emailPattern.test(fieldValue)) {
          errorMessage = 'Please enter a valid email address';
          isValid = false;
        }
        break;

      case 'subject':
        if (!fieldValue) {
          errorMessage = 'Please select a subject';
          isValid = false;
        }
        break;

      case 'message':
        if (!fieldValue) {
          errorMessage = 'Message is required';
          isValid = false;
        } else if (fieldValue.length < 10) {
          errorMessage = 'Message must be at least 10 characters';
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
      formGroup.classList.add('error');
      formGroup.classList.remove('success');
    } else {
      formGroup.classList.add('success');
      formGroup.classList.remove('error');
    }

    return isValid;
  }

  showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');

    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
  }

  clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    if (errorElement) {
      errorElement.remove();
    }

    formGroup.classList.remove('error', 'success');
  }

  async handleContactFormSubmission(form, submitBtn) {
    const formData = new FormData(form);
    const formInputs = form.querySelectorAll('input, select, textarea');

    // Validate all fields
    let isFormValid = true;
    formInputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showFormMessage('Please fix the errors above', 'error');
      return;
    }

    // Show loading state
    this.setSubmitButtonState(submitBtn, 'loading');

    try {
      // Simulate form submission (replace with actual implementation)
      await this.submitContactForm(formData);

      // Show success state
      this.setSubmitButtonState(submitBtn, 'success');
      this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');

      // Reset form after delay
      setTimeout(() => {
        form.reset();
        formInputs.forEach(input => this.clearFieldError(input));
        this.setSubmitButtonState(submitBtn, 'default');
        this.hideFormMessage();
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      this.setSubmitButtonState(submitBtn, 'default');
      this.showFormMessage('Oops! Something went wrong. Please try again.', 'error');
    }
  }

  async submitContactForm(formData) {
    // Simulate API call - replace with actual implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For now, just log the form data
        console.log('Contact form submission:');
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        // In a real implementation, you would send this to your backend
        // or use a service like EmailJS, Formspree, or Netlify Forms

        // Simulate success (or failure for testing)
        if (Math.random() > 0.1) { // 90% success rate
          resolve({ success: true });
        } else {
          reject(new Error('Submission failed'));
        }
      }, 2000);
    });
  }

  setSubmitButtonState(button, state) {
    const btnText = button.querySelector('.btn-text');
    const btnIcon = button.querySelector('.btn-icon');

    // Remove all state classes
    button.classList.remove('loading', 'success');

    switch (state) {
      case 'loading':
        button.classList.add('loading');
        btnText.textContent = 'Sending...';
        btnIcon.textContent = '⏳';
        break;

      case 'success':
        button.classList.add('success');
        btnText.textContent = 'Message Sent!';
        btnIcon.textContent = '✅';
        break;

      case 'default':
      default:
        btnText.textContent = 'Send Message';
        btnIcon.textContent = '✨';
        break;
    }
  }

  showFormMessage(message, type) {
    let messageElement = document.querySelector('.form-message');

    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'form-message';
      const contactForm = document.getElementById('contact-form');
      contactForm.appendChild(messageElement);
    }

    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    messageElement.style.display = 'block';
  }

  hideFormMessage() {
    const messageElement = document.querySelector('.form-message');
    if (messageElement) {
      messageElement.style.display = 'none';
    }
  }

  // === PAGE NAVIGATION ===
  showPage(page) {
    this.currentPage = page;
    const homePage = document.getElementById('home-page');
    const galleryContainer = document.getElementById('gallery-container');

    if (page === 'home') {
      homePage.style.display = 'block';
      galleryContainer.style.display = 'none';
      this.animateHeroArtwork();
    } else if (page === 'gallery') {
      homePage.style.display = 'none';
      galleryContainer.style.display = 'block';
      this.renderGallery();
    }
  }

  // === GALLERY RENDERING ===
  renderGallery() {
    const grid = document.getElementById('gallery-grid');
    const filteredImages = this.currentFilter === 'all'
      ? this.allImages
      : this.allImages.filter(img => img.projectId === this.currentFilter);

    grid.innerHTML = '';

    filteredImages.forEach((image, index) => {
      const artCard = this.createArtCard(image);
      artCard.style.animationDelay = `${index * 0.1}s`;
      grid.appendChild(artCard);
    });
  }

  createArtCard(artwork) {
    const card = document.createElement('div');
    card.className = 'art-card';

    // Create image with loading placeholder
    const imageContainer = document.createElement('div');
    imageContainer.className = 'art-image-container';

    const image = document.createElement('img');
    image.className = 'art-image';
    image.alt = artwork.title;
    image.loading = 'lazy'; // Enable lazy loading

    // Loading placeholder
    const loadingPlaceholder = document.createElement('div');
    loadingPlaceholder.className = 'image-loading-placeholder';
    loadingPlaceholder.innerHTML = '<div class="loading-spinner"></div>';

    imageContainer.appendChild(loadingPlaceholder);
    imageContainer.appendChild(image);

    const artInfo = document.createElement('div');
    artInfo.className = 'art-info';
    artInfo.innerHTML = `
      <h3 class="art-title">${artwork.title}</h3>
      <p class="art-description">${artwork.description}</p>
      <div class="art-metadata">
        <div class="metadata-row">
          <span class="metadata-label">Series:</span>
          <span class="metadata-value">${artwork.series}</span>
        </div>
        <div class="metadata-row">
          <span class="metadata-label">Medium:</span>
          <span class="metadata-value">${artwork.medium}</span>
        </div>
        <div class="metadata-row">
          <span class="metadata-label">Size:</span>
          <span class="metadata-value">${artwork.size}</span>
        </div>
        <div class="metadata-row">
          <span class="metadata-label">Year:</span>
          <span class="metadata-value">${artwork.year}</span>
        </div>
      </div>
    `;

    card.appendChild(imageContainer);
    card.appendChild(artInfo);

    // Handle image loading
    image.addEventListener('load', () => {
      loadingPlaceholder.style.opacity = '0';
      image.style.opacity = '1';
      setTimeout(() => {
        if (loadingPlaceholder.parentNode) {
          loadingPlaceholder.remove();
        }
      }, 300);
    });

    image.addEventListener('error', () => {
      loadingPlaceholder.innerHTML = '<div class="image-error">⚠️<br>Image not found</div>';
      loadingPlaceholder.style.background = 'rgba(255, 107, 107, 0.1)';
    });

    // Set image source after event listeners are attached
    image.src = artwork.imageUrl;

    // Mouse tracking for hover effects
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
    });

    // Click to open immersive view
    card.addEventListener('click', () => this.openImmersiveView(artwork));

    return card;
  }

  // === IMMERSIVE VIEW ===
  openImmersiveView(artwork) {
    // Determine which images to show based on current filter
    let slideshowImages, currentImageIndex;

    if (this.currentFilter === 'all') {
      // Show all images across all projects
      slideshowImages = this.allImages;
      currentImageIndex = this.allImages.findIndex(img => img.filename === artwork.filename && img.projectId === artwork.projectId);
    } else {
      // Show only images from the current project
      slideshowImages = this.allImages.filter(img => img.projectId === this.currentFilter);
      currentImageIndex = slideshowImages.findIndex(img => img.filename === artwork.filename);
    }

    // Set up slideshow state
    this.currentImageIndex = currentImageIndex;
    this.projectImages = slideshowImages;

    const modal = document.getElementById('immersive-modal');
    const artworkContainer = document.getElementById('immersive-artwork');

    // Create slideshow structure with navigation
    artworkContainer.innerHTML = `
      <div class="slideshow-container">
        <div class="slideshow-image-container">
          <img id="current-slide-image" src="${artwork.imageUrl}" alt="${artwork.title}" class="slideshow-image active">
          <img id="next-slide-image" src="" alt="" class="slideshow-image">
        </div>
        <div class="slideshow-info">
          <h2 class="slideshow-title">${artwork.title}</h2>
          <p class="slideshow-description">${artwork.description}</p>
          <div class="slideshow-metadata">
            <div class="metadata-row">
              <span class="metadata-label">Series:</span>
              <span class="metadata-value">${artwork.series}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">Medium:</span>
              <span class="metadata-value">${artwork.medium}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">Size:</span>
              <span class="metadata-value">${artwork.size}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">Year:</span>
              <span class="metadata-value">${artwork.year}</span>
            </div>
          </div>
          <div class="slideshow-counter">
            <span>${currentImageIndex + 1} of ${slideshowImages.length}</span>
          </div>
        </div>
        <div class="slideshow-controls">
          <button class="slideshow-btn prev-btn" id="prev-slide">‹</button>
          <button class="slideshow-btn next-btn" id="next-slide">›</button>
        </div>
      </div>
    `;

    // Set up slideshow controls
    this.setupSlideshow();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  setupSlideshow() {
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousSlide());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextSlide());
    }
  }

  nextSlide() {
    if (this.projectImages.length <= 1) return;

    const nextIndex = (this.currentImageIndex + 1) % this.projectImages.length;
    this.transitionToSlide(nextIndex);
  }

  previousSlide() {
    if (this.projectImages.length <= 1) return;

    const prevIndex = this.currentImageIndex === 0
      ? this.projectImages.length - 1
      : this.currentImageIndex - 1;
    this.transitionToSlide(prevIndex);
  }

  transitionToSlide(newIndex) {
    const currentImg = document.getElementById('current-slide-image');
    const nextImg = document.getElementById('next-slide-image');
    const newArtwork = this.projectImages[newIndex];

    // Preload next image
    nextImg.src = newArtwork.imageUrl;
    nextImg.alt = newArtwork.title;

    // Start fade transition
    nextImg.style.opacity = '0';
    nextImg.style.display = 'block';

    // Fade out current, fade in next
    setTimeout(() => {
      currentImg.style.opacity = '0';
      nextImg.style.opacity = '1';
    }, 50);

    // After transition, swap images
    setTimeout(() => {
      currentImg.src = newArtwork.imageUrl;
      currentImg.alt = newArtwork.title;
      currentImg.style.opacity = '1';
      nextImg.style.opacity = '0';
      nextImg.style.display = 'none';

      // Update metadata
      this.updateSlideshowInfo(newArtwork, newIndex);
    }, 300);

    this.currentImageIndex = newIndex;
  }

  updateSlideshowInfo(artwork, index) {
    const title = document.querySelector('.slideshow-title');
    const description = document.querySelector('.slideshow-description');
    const metadata = document.querySelector('.slideshow-metadata');
    const counter = document.querySelector('.slideshow-counter span');

    if (title) title.textContent = artwork.title;
    if (description) description.textContent = artwork.description;
    if (counter) counter.textContent = `${index + 1} of ${this.projectImages.length}`;

    if (metadata) {
      metadata.innerHTML = `
        <div class="metadata-row">
          <span class="metadata-label">Series:</span>
          <span class="metadata-value">${artwork.series}</span>
        </div>
        <div class="metadata-row">
          <span class="metadata-label">Medium:</span>
          <span class="metadata-value">${artwork.medium}</span>
        </div>
        <div class="metadata-row">
          <span class="metadata-label">Size:</span>
          <span class="metadata-value">${artwork.size}</span>
        </div>
        <div class="metadata-row">
          <span class="metadata-label">Year:</span>
          <span class="metadata-value">${artwork.year}</span>
        </div>
      `;
    }
  }

  closeImmersiveView() {
    const modal = document.getElementById('immersive-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // === EVENT LISTENERS ===
  setupEventListeners() {
    // Home page navigation
    const enterGalleryBtn = document.getElementById('enter-gallery-btn');
    const viewGalleryBtn = document.getElementById('view-gallery-btn');
    const learnMoreBtn = document.getElementById('learn-more-btn');
    const contactBtn = document.getElementById('contact-btn');
    const homeBtn = document.getElementById('home-btn');

    if (enterGalleryBtn) {
      enterGalleryBtn.addEventListener('click', () => this.showPage('gallery'));
    }
    if (viewGalleryBtn) {
      viewGalleryBtn.addEventListener('click', () => this.showPage('gallery'));
    }
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', () => {
        document.querySelector('.features-section').scrollIntoView({
          behavior: 'smooth'
        });
      });
    }
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        document.querySelector('.contact-section').scrollIntoView({
          behavior: 'smooth'
        });
      });
    }
    if (homeBtn) {
      homeBtn.addEventListener('click', () => this.showPage('home'));
    }

    // Where to buy section buttons
    const buyButtons = document.querySelectorAll('.buy-btn[data-page], .contact-artist-btn');
    buyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.getAttribute('data-page');
        if (page === 'exhibitions') {
          document.querySelector('.exhibitions-section').scrollIntoView({
            behavior: 'smooth'
          });
        } else if (page === 'contact') {
          document.querySelector('.contact-section').scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

    // Project navigation
    const projectButtons = document.querySelectorAll('.project-nav-btn');
    projectButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        projectButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.project;
        this.updateTheme(btn.dataset.hue);
        this.renderGallery();
      });
    });

    // Floating controls
    const shuffleBtn = document.getElementById('shuffle-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const moodBtn = document.getElementById('mood-btn');

    if (shuffleBtn) shuffleBtn.addEventListener('click', () => this.shuffleGallery());
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    if (moodBtn) moodBtn.addEventListener('click', () => this.changeColorMood());

    // Close immersive view
    const closeImmersive = document.getElementById('close-immersive');
    const immersiveModal = document.getElementById('immersive-modal');

    if (closeImmersive) closeImmersive.addEventListener('click', () => this.closeImmersiveView());
    if (immersiveModal) {
      immersiveModal.addEventListener('click', (e) => {
        if (e.target.id === 'immersive-modal') this.closeImmersiveView();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.currentPage === 'gallery') {
          this.closeImmersiveView();
        } else {
          this.showPage('home');
        }
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (this.currentPage === 'gallery') {
          this.shuffleGallery();
        }
      }
      // Slideshow navigation
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (document.getElementById('immersive-modal').classList.contains('active')) {
          this.previousSlide();
        }
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (document.getElementById('immersive-modal').classList.contains('active')) {
          this.nextSlide();
        }
      }
      if (e.key === 'f') this.toggleFullscreen();
      if (e.key === 'h') this.showPage('home');
      if (e.key === 'g') this.showPage('gallery');
      if (e.key === 'c' && !e.target.matches('input, textarea, select') && !('ontouchstart' in window)) {
        if (this.currentPage === 'home') {
          document.querySelector('.contact-section').scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  }

  updateTheme(hue) {
    document.documentElement.style.setProperty('--accent-hue', hue);
  }

  shuffleGallery() {
    this.allImages.sort(() => Math.random() - 0.5);
    this.renderGallery();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  changeColorMood() {
    const hues = [0, 30, 60, 120, 180, 240, 270, 300];
    const randomHue = hues[Math.floor(Math.random() * hues.length)];
    this.updateTheme(randomHue);
  }

  // === EXHIBITION PREVIEW ===
  showExhibitionPreview(element, event) {
    // Prevent event bubbling and default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const imageSrc = element.dataset.preview;
    const alt = element.querySelector('img').alt;

    // Create modal if it doesn't exist
    let modal = document.getElementById('exhibition-preview-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'exhibition-preview-modal';
      modal.className = 'exhibition-preview-modal';
      modal.innerHTML = `
        <div class="preview-modal-content">
          <button class="preview-close-btn" id="preview-close-button">×</button>
          <img id="preview-modal-image" src="" alt="" class="preview-modal-img">
          <div class="preview-modal-caption" id="preview-modal-caption"></div>
        </div>
        <div class="preview-modal-overlay" id="preview-modal-overlay"></div>
      `;
      document.body.appendChild(modal);

      // Add event listeners after creating the modal
      const closeBtn = document.getElementById('preview-close-button');
      const overlay = document.getElementById('preview-modal-overlay');

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closeExhibitionPreview();
        });
      }

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closeExhibitionPreview();
        });
      }

      // Add escape key listener for this modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          this.closeExhibitionPreview();
        }
      });
    }

    // Set image and caption
    const modalImg = document.getElementById('preview-modal-image');
    const modalCaption = document.getElementById('preview-modal-caption');
    modalImg.src = imageSrc;
    modalImg.alt = alt;
    modalCaption.textContent = alt.replace(' Preview', '');

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeExhibitionPreview(event) {
    // Prevent event bubbling
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const modal = document.getElementById('exhibition-preview-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Initialize exhibition preview event listeners
  initializeExhibitionPreviews() {
    const exhibitionPreviews = document.querySelectorAll('.exhibition-preview');

    exhibitionPreviews.forEach(preview => {
      // Remove any existing onclick attribute
      preview.removeAttribute('onclick');

      // Add proper event listener
      preview.addEventListener('click', (event) => {
        this.showExhibitionPreview(preview, event);
      });
    });
  }
}

// Initialize the gallery when DOM is loaded
let gallery;
document.addEventListener('DOMContentLoaded', () => {
  gallery = new DreamsMeowGallery();
});
