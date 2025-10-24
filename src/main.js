import './style.css'

// === DREAMS MEOW ART GALLERY ===

class DreamsMeowGallery {
  constructor() {
    this.currentFilter = 'evolution-project';
    this.projects = [];
    this.allImages = [];
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mousePos = { x: 0, y: 0 };
    this.currentPage = 'home';
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
    this.initializeFixedNav();
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
          { filename: 'hands3.jpeg', title: 'Boro Glass Hands', description: 'Each hand is flameworked from borosilicate glass rods, sculpted and fused finger by finger in a 2000-degree torch flame.', size: '8" x 6" x 4"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'glass_001.jpg', title: 'Chainsaw Collab with Gibson Glass', description: 'Each hand is flameworked from borosilicate glass rods, sculpted and fused finger by finger in a 2000-degree torch flame. Shown and sold at Stoked CT Gallery.', size: '10" x 8" x 6"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'glass_002.jpg', title: 'Glass Vase', description: 'Flameworked from borosilicate glass rods, sculpted and fused in a 2000-degree torch flame.', size: '12" x 10" x 8"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'glass_003.jpg', title: 'Boro Glass Alien Hand Pendant', description: 'Each hand is flameworked from borosilicate glass rods, sculpted and fused finger by finger in a 2000-degree torch flame.', size: '6" x 6" x 6"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'glass_004.jpg', title: 'Boro Glass Hand Pendants', description: 'Each hand is flameworked from borosilicate glass rods, sculpted and fused finger by finger in a 2000-degree torch flame.', size: '14" x 12" x 10"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'glass_005.jpg', title: 'Glass Peeps Pendant', description: 'Flameworked from borosilicate glass rods, sculpted and fused in a 2000-degree torch flame.', size: '16" x 14" x 12"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'glass_006.jpg', title: 'Glass Vase', description: 'Flameworked from borosilicate glass rods, sculpted and fused in a 2000-degree torch flame.', size: '8" x 8" x 8"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'glass_007.jpg', title: 'Glass Turtle', description: 'Flameworked from borosilicate glass rods, sculpted and fused in a 2000-degree torch flame.', size: '18" x 16" x 14"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'glass_010.jpeg', title: 'Glass Turtle', description: 'Flameworked from borosilicate glass rods, sculpted and fused in a 2000-degree torch flame.', size: '10" x 10" x 10"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'glass_011.jpeg', title: 'Glass Chicken Feet', description: 'Flameworked from borosilicate glass rods, sculpted and fused in a 2000-degree torch flame.', size: '12" x 12" x 12"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'glass_017.jpeg', title: 'Glass UV Glow Moana Inspired Heart of tafiti', description: 'Flameworked from borosilicate glass rods, sculpted and fused in a 2000-degree torch flame.', size: '20" x 18" x 16"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wireglass_009.jpeg', title: 'Glass UV Glow Moana Inspired Heart of tafiti', description: 'Flameworked from borosilicate glass rods, sculpted and fused in a 2000-degree torch flame.', size: '14" x 12" x 10"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wireglass_012.jpeg', title: 'Glass Galaxy Pendant', description: 'Flameworked from borosilicate glass rods, sculpted and fused in a 2000-degree torch flame.', size: '16" x 14" x 12"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wireglass_013.jpeg', title: 'Boro Glass Hand Pendants', description: 'Each hand is flameworked from borosilicate glass rods, sculpted and fused finger by finger in a 2000-degree torch flame.', size: '18" x 16" x 14"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'hands1.jpeg', title: 'Boro Glass Hand Pendants', description: 'Each hand is flameworked from borosilicate glass rods, sculpted and fused finger by finger in a 2000-degree torch flame. Shown and sold at Nasty Women Gallery', size: '12" x 10" x 8"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'hands2.jpeg', title: 'Glass Turtle', description: 'Flameworked from borosilicate glass rods, sculpted and fused in a 2000-degree torch flame.', size: '10" x 8" x 6"', year: '2024', purchaseUrl: '' },
          { filename: 'glass_000.jpeg', title: 'Boro Glass Hands', description: 'Each hand is flameworked from borosilicate glass rods, sculpted and fused finger by finger in a 2000-degree torch flame.', size: '12" x 10" x 8"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' }
        ]
      },
      {
        id: 'wire-wraps',
        title: 'Wire Wrapped Jewelry',
        description: 'Intricate wire wrapping techniques creating wearable art with crystals and gemstones',
        medium: 'Wire & Stone',
        colorCategory: 'purple',
        images: [
          { filename: 'wire_005.jpeg', title: 'Tree of Life Memorial', description: 'Copper spirals into sacred geometry, cradling stones that hold memories of those who\'ve passed beyond the veil.', size: '2" x 1.5"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wire_001.jpeg', title: 'Copper Wire Wrapped Dream Catcher', description: 'Oxidized copper weaves an intricate web within the sacred hoop, suspended with feathers and beads to filter the dreamscape.', size: '1.5" x 1"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wire_004.jpeg', title: 'Crystal Tree of Life', description: 'Raw copper branches reach through crystalline stones, forming a suspended portal between earth and sky.', size: '2.2" x 1.8"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wire_006.jpeg', title: 'Jade Tree of Life Memorial', description: 'Wire roots embrace jade crystals in this memorial piece, channeling eternal growth through green stone.', size: '1.8" x 1.5"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wire_007.jpeg', title: 'Palmwood Wirewrap Pendant', description: 'Fossilized palmwood rests in copper coils, wearing ancient earth energy close to the heart.', size: '2.5" x 2"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wire_008.jpeg', title: 'Shell Tree of Life Pendant', description: 'Ocean memory captured—copper branches grow through seashell, creating a wearable talisman of sea and earth.', size: '2" x 1.5"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wire_013.jpeg', title: 'Stone Tree of Life Pendant', description: 'Gemstones bloom from copper branches in this wearable tree, carrying earth\'s wisdom against the skin.', size: '2.3" x 1.8"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wire_014.jpeg', title: 'Paua Tree of Life', description: 'Iridescent paua shell glows within copper branches, reflecting otherworldly light through twisted metal roots.', size: '2" x 1.6"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'wire_015.jpeg', title: 'Celestial Tree of Life', description: 'Copper branches grow across a crescent moon form, cradling star stones in this suspended lunar garden.', size: '2.4" x 2"', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' }
        ]
      },
      {
        id: 'evolution-project',
        title: 'Evolution Project',
        description: 'A series exploring the evolution of consciousness and form through mixed media artwork',
        medium: 'Acrylic on Paper',
        colorCategory: 'red',
        images: [
          { filename: '1.jpeg', title: 'Questioning', series: 'Evolution Series #1', description: 'A surreal fusion of nature and consciousness, bursting with cosmic detail and a watching eye that questions reality.', medium: 'Acrylic on paper', size: '4.5x6"', year: '2025', purchaseUrl: 'https://square.link/u/ucJtIkJg' },
          { filename: '2.jpeg', title: 'The Dreamer', series: 'Evolution Series #2', description: 'The eye weeps and watches as spores of imagination bloom, blending decay and rebirth into a luminous dreamscape.', medium: 'Acrylic on paper', size: '4.5x6"', year: '2025', purchaseUrl: 'https://square.link/u/yeHZUE5T' },
          { filename: '4.jpeg', title: 'Decay', series: 'Evolution Series #4', description: 'A surreal anatomy of the soul, tangled in fungi and flame, this face isn\'t dying, it\'s transforming.', medium: 'Acrylic on paper', size: '6x9"', year: '2025', purchaseUrl: 'https://square.link/u/2tbt8eOe' },
          { filename: '5.jpeg', title: 'Melancholy', series: 'Evolution Series #5', description: 'This figure blooms in rot, draped in spore and silence—a portrait of survival in a world turned damp and strange.', medium: 'Acrylic on paper', size: '4.5x6"', year: '2025', purchaseUrl: '' },
          { filename: '6.jpeg', title: 'Unquiet Mind', series: 'Evolution Series #6', description: 'Emotion leaks from every surface—there\'s no silence, only saturated feeling and the remnants of what it took to hold it in.', medium: 'Acrylic on paper', size: '4.5x6"', year: '2025', purchaseUrl: 'https://square.link/u/Ne2e8A7a' },
          { filename: '7.jpeg', title: 'Becoming', series: 'Evolution Series #7', description: 'Flourish Beneath the Surface. An exploration of hidden brilliance, this portrait dissolves the line between adornment and identity, drawing light from shadow.', medium: 'Acrylic on paper', size: '4.5x6"', year: '2025', purchaseUrl: '' },
          { filename: '8.jpeg', title: 'Mourning Bloom', series: 'Evolution Series #8', description: 'Sorrowful emergence of something once hidden—grief taking root & flowering in full, radiant color. The figure, with eyes ablaze & dripping emotion, becomes both a witness and a bloom of loss. What should wither instead bursts into life, expressing how pain can be both haunting & strangely beautiful', medium: 'Acrylic on paper', size: '6x9"', year: '2025', purchaseUrl: 'https://square.link/u/gkzCldzw' },
          { filename: '9.jpeg', title: 'Between Worlds', series: 'Evolution Series #9', description: 'The unsettling beauty of transformation, where grief reshapes identity and the boundaries of flesh, memory, and dream begin to blur. Suspended in this liminal space, she exists both here and elsewhere, becoming something otherworldly while holding the weight of human emotion.', medium: 'Acrylic on paper', size: '4.5x6"', year: '2025', purchaseUrl: 'https://square.link/u/OGsdq0vy' },
          { filename: '10.jpg', title: 'Gravity of Despair', series: 'Evolution Series #10', description: 'This work captures the crushing weight of inner turmoil. Hands shield the face as cosmic chaos drips downward, mirroring the struggle between silence and disorder within the mind. Cool blues contrasted with bursts of color reflect the relentless pull of despair.', medium: 'Acrylic on paper', size: '6x9"', year: '2025', purchaseUrl: '' },
          { filename: '11.jpeg', title: 'Emergence', series: 'Evolution Series #11', description: 'In Emergence, evolution is portrayed not as a physical shift but as an awakening of the inner self. The cascading pigments mirror the shedding of old layers — each drip a step toward illumination. It is a portrait of transformation, from chaos to clarity, from being to becoming.', medium: 'Acrylic on Canvas', size: '12x16"', year: '2025', purchaseUrl: '' },
          { filename: '12.jpeg', title: 'Bloom of Consciousness', series: 'Evolution Series #12', description: 'A figure emerges from shadow and color, crowned by the living pulse of nature. "Bloom of Consciousness" explores the intersection between growth and decay, where thoughts take root and emotions spill into the world. The vibrant drips suggest transformation, as if awareness itself is blooming from the soil of the mind.', medium: 'Acrylic on paper', size: '6x9"', year: '2025', purchaseUrl: '' },
          { filename: '13.jpeg', title: 'Fury', series: 'Evolution Series #13', description: 'From the wreckage of light and shadow, a form emerges — burning, divine, uncontained. "Fury" is the hymn of transformation: the body as battlefield, the spirit as fire. Every drip bears witness to the war that never ends.', medium: 'Acrylic on paper', size: '6x9"', year: '2025', purchaseUrl: '' }
        ]
      },
      {
        id: 'nature',
        title: 'Nature Photography',
        description: 'Capturing the raw beauty and spiritual essence of the natural world',
        medium: 'Photography',
        colorCategory: 'green',
        images: [
          { filename: 'photo_003.jpg', title: 'I\'m the Captain Now', description: 'Rogue chicken commandeers a vessel on Ecuadorian waters', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_004.jpg', title: 'Here\'s Lookin\' at You', description: 'Primate gaze pierces through the Ecuadorian jungle canopy', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_005.jpg', title: 'Headshots', description: 'Wild portrait session with an Ecuadorian monkey who knew their angles', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_043.jpg', title: 'Dragonfly', description: 'Iridescent wings frozen mid-flight in Florida wetlands', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_044.jpg', title: 'Sunset Seagulls', description: 'Birds cut through molten sky above the Gulf of Mexico', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_045.jpg', title: 'Sunset Lake', description: 'Wisconsin waters mirror the burning horizon', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_046.jpg', title: 'Sunset Desert', description: 'Arizona\'s sky bleeds gold across endless sand', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_047.jpg', title: 'Lunar Eclipse', description: 'Two moments of cosmic shadow captured as the moon transforms', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_048.jpg', title: 'Lion', description: 'Captive king grants an audience through iron and glass', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_049.jpg', title: 'Sunset Lake II', description: 'Unknown waters hold the day\'s final light', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_050.jpg', title: 'Earth\'s Patterns', description: 'Natural patterns revealing earth\'s geometry', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' }
        ]
      },
      {
        id: 'light-paintings',
        title: 'Light Paintings',
        description: 'Long exposure photography capturing light in motion',
        medium: 'Photography',
        colorCategory: 'yellow',
        images: [
          { filename: 'photo_034.jpg', title: '5 Alarm Fire', description: 'Two sisters honor their firefighter husbands in this boudoir session, illuminated through layered light painting techniques that build heat from a single source.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_008.jpg', title: 'Ntnl Lampoons Wedding Vacation', description: 'Wedding chaos captured and transformed—multiple exposures painted with roaming light merge into one surreal celebration moment.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_009.jpg', title: 'The Gamer Life', description: 'A player, his feline companion, and his digital battlestation emerge from darkness through methodically sculpted light layers.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_020.jpg', title: 'Girls Bathroom Was Full', description: 'Las Vegas mischief frozen in time—playful moments carved from shadow using wandering light strokes across multiple frames.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_007.jpg', title: 'Just a Girl', description: 'Portrait stripped to essential elements, where controlled light traces reveal form through carefully orchestrated exposure blends.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' }
        ]
      },
      {
        id: 'photography',
        title: 'Photography Portfolio',
        description: 'Collection of artistic photography exploring abstract concepts and urban landscapes',
        medium: 'Photography',
        colorCategory: 'blue',
        images: [
          { filename: 'photo_042.jpg', title: 'Election Day with the Obamas', description: 'Rare access moment—one of only two photographers permitted to capture the Obama family\'s intimate pre-announcement energy before his Illinois Senate run.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_029.jpg', title: 'Cold Hands, Warm Heart', description: 'Garter retrieval takes an unexpected turn when the groom\'s icy fingers send shivers through his unsuspecting bride.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_041.jpg', title: 'Barack and Carter', description: 'Power meets academia—Columbia College President Carter shares frame with future President Obama in this historic encounter.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_037.jpg', title: 'Victory Roll Dreams', description: 'Classic pin-up aesthetic revived—red lips, vintage curls, and that Rosie the Riveter confidence.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_038.jpg', title: 'Welcome Home, Soldier', description: 'Patriotic surprise captured in lace and anticipation for a boyfriend returning from deployment.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_022.jpg', title: 'Spine Study', description: 'The architecture of the human back becomes art in this celebration of feminine strength and grace.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'IMG_8360.JPG', title: 'Pearls and Shoulders', description: 'A single strap descends—classic elegance meets subtle seduction in this intimate moment.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'IMG_8362.JPG', title: 'Golden Hour Silhouette', description: 'Natural window light sculpts form as she glances back, caught between shadow and glow.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'IMG_8363.JPG', title: 'Après-Ski Fantasy', description: 'Mountain passion meets bedroom eyes—honoring a love for powder days and cozy nights.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'IMG_8365.JPG', title: 'Mississippi Crossing', description: 'Love spans state lines at the Iowa-Illinois bridge, the mighty river bearing witness below.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'IMG_8366.JPG', title: 'Handful of Tulle', description: 'Groom\'s signature move meets wedding dress challenge—documenting his determined attempt through layers of fabric.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'IMG_8367.JPG', title: 'Leading Man', description: 'She navigates, he follows—newlyweds dance through Chicago\'s financial district streets.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'IMG_8368.JPG', title: 'Crimson and Concrete', description: 'Red statement jewelry pops against urban gray as newlyweds claim their corner of Chicago.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'IMG_8369.JPG', title: 'Yellow Door Theory', description: 'Local legend says this vibrant portal brings fortune to lovers—young couple tests the superstition.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'IMG_8370.JPG', title: 'Hallway Halfpipe', description: 'No snow, no problem—sponsored boarder transforms hotel corridor into impromptu training ground.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' }
        ]
      },
      {
        id: 'me',
        title: 'Self Portraits',
        description: 'Artistic self-exploration through photography and creative expression',
        medium: 'Photography',
        colorCategory: 'purple',
        images: [
          { filename: 'photo_018.jpg', title: 'Aftermath', description: 'Self-portrait capturing emotional exhaustion—light traces the weight of unresolved conflict across multiple exposures, mapping the topology of a difficult day.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_011.jpg', title: 'Sacred Text', description: 'Reading becomes ritual in this self-portrait, where wandering light illuminates the pages that taught me to see through a lens.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_013.jpg', title: 'Looking Over My Shoulder', description: 'Hypervigilance made visible—light traces the constant surveillance of self-protection, each exposure mapping the exhausting habit of watching for threats that may never come.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_014.jpg', title: 'Social Burnout', description: 'The suffocating aftermath of human interaction visualized—light paintings trace the invisible pressure that builds from too much contact.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_015.jpg', title: 'Fetal Position', description: 'Body becomes shelter when the world grows too heavy—light curves around protective posture in this study of overwhelm.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_016.jpg', title: 'Liberation Day', description: 'Freedom tastes bittersweet—captured the day chains broke, light dances between relief and grief in carefully orchestrated layers.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_017.jpg', title: 'Rediscovery', description: 'The first breath of becoming myself again—light explores unfamiliar territory of a identity long buried under someone else\'s expectations.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_051.jpg', title: 'Hidden Light', description: 'A moment of quiet sadness. The shadows speak as loudly as the light, reflecting the parts of myself I often keep hidden. "Here\'s Me" in vulnerability, stillness and truth. My light paintings were created using a single light source with multiple photographs layered digitally and hand edited to perfection. Displayed at Grosse Point Gallery 2025', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' },
          { filename: 'photo_010.jpg', title: 'Phoenix Hour', description: 'Rising from years of wreckage—each light layer builds upon the last, constructing a new self from the ashes of who I used to be.', size: 'Digital', year: '2024', purchaseUrl: 'https://snowmeow.square.site/' }
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
          series: image.series || project.title,
          imageUrl: `/art-portfolio/${project.id}/${image.filename}`,
          colorCategory: project.colorCategory,
          purchaseUrl: image.purchaseUrl
        });
      });
    });
  }


  // === HOME PAGE INITIALIZATION ===
  initializeHomePage() {
    this.setupAccordionDrawers();
    this.initializeContactForm();
    // Render the gallery on the home page
    this.renderGalleryOnHome();
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
    if (!formGroup) return true; // Skip validation for hidden fields

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
    if (!formGroup) return; // Skip if field is not in a form-group

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
    if (!formGroup) return; // Skip if field is not in a form-group (e.g., hidden fields)

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

    // Note: form-name is already included via hidden input in HTML
    // Ensure it's set (in case it's somehow missing)
    if (!formData.has('form-name')) {
      formData.set('form-name', 'contact');
    }

    // Show loading state
    this.setSubmitButtonState(submitBtn, 'loading');

    try {
      // Submit to Netlify Forms
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
      this.setSubmitButtonState(submitBtn, 'default');
      this.showFormMessage('Oops! Something went wrong. Please try again.', 'error');
    }
  }

  async submitContactForm(formData) {
    // Submit to Netlify Forms
    try {
      const body = new URLSearchParams(formData).toString();
      console.log('Submitting form with data:', body);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      });

      console.log('Form submission response:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Form submission error:', errorText);
        throw new Error(`Form submission failed: ${response.status} ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Form submission exception:', error);
      throw error;
    }
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

    if (grid) {
      grid.innerHTML = '';

      filteredImages.forEach((image, index) => {
        const artCard = this.createArtCard(image);
        artCard.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(artCard);
      });
    }
  }

  // Render gallery on home page
  renderGalleryOnHome() {
    const grid = document.getElementById('gallery-grid-home');
    const filteredImages = this.currentFilter === 'all'
      ? this.allImages
      : this.allImages.filter(img => img.projectId === this.currentFilter);

    if (grid) {
      grid.innerHTML = '';

      filteredImages.forEach((image, index) => {
        const artCard = this.createArtCard(image);
        artCard.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(artCard);
      });
    }
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
      <p class="art-credit">created by: SnowKittenMeow</p>
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
          ${artwork.projectId === 'evolution-project' ? `
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
          ` : ''}
          <div class="slideshow-counter">
            <span>${currentImageIndex + 1} of ${slideshowImages.length}</span>
          </div>
          ${artwork.purchaseUrl && !['nature', 'light-paintings', 'photography', 'me'].includes(artwork.projectId) ? `
            <div class="slideshow-actions">
              <button class="slideshow-purchase-btn" data-url="${artwork.purchaseUrl}" data-project="${artwork.projectId}">
                <span class="btn-text">${artwork.projectId === 'evolution-project' ? 'Purchase Print' : 'Contact Me for Availability'}</span>
                <span class="btn-icon">${artwork.projectId === 'evolution-project' ? '🛒' : '✉️'}</span>
                <span class="btn-glow"></span>
              </button>
            </div>
          ` : ''}
        </div>
        <div class="slideshow-controls">
          <button class="slideshow-btn prev-btn" id="prev-slide">‹</button>
          <button class="slideshow-btn next-btn" id="next-slide">›</button>
        </div>
      </div>
    `;

    // Set up slideshow controls
    this.setupSlideshow();

    // Handle slideshow purchase button
    const slideshowPurchaseBtn = artworkContainer.querySelector('.slideshow-purchase-btn');
    if (slideshowPurchaseBtn) {
      slideshowPurchaseBtn.addEventListener('click', () => {
        const projectId = slideshowPurchaseBtn.getAttribute('data-project');
        if (projectId === 'evolution-project') {
          const url = slideshowPurchaseBtn.getAttribute('data-url');
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          // Close modal and scroll to contact section
          this.closeImmersiveView();
          document.querySelector('.contact-section').scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    }

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
    // Safety checks
    if (!this.projectImages || !this.projectImages.length) {
      console.error('No project images available');
      return;
    }

    if (newIndex < 0 || newIndex >= this.projectImages.length) {
      console.error('Invalid slide index:', newIndex);
      return;
    }

    const currentImg = document.getElementById('current-slide-image');
    const nextImg = document.getElementById('next-slide-image');
    const newArtwork = this.projectImages[newIndex];

    if (!newArtwork || !newArtwork.imageUrl) {
      console.error('Invalid artwork at index:', newIndex);
      return;
    }

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
    const slideshowInfo = document.querySelector('.slideshow-info');

    if (title) title.textContent = artwork.title;
    if (description) description.textContent = artwork.description;
    if (counter) counter.textContent = `${index + 1} of ${this.projectImages.length}`;

    // Update or remove metadata based on project
    if (metadata) {
      if (artwork.projectId === 'evolution-project') {
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
        metadata.style.display = 'block';
      } else {
        metadata.innerHTML = '';
        metadata.style.display = 'none';
      }
    }

    // Update purchase button
    let actionsContainer = slideshowInfo.querySelector('.slideshow-actions');
    if (actionsContainer) {
      actionsContainer.remove();
    }

    // Only show button for certain projects
    if (artwork.purchaseUrl && !['nature', 'light-paintings', 'photography', 'me'].includes(artwork.projectId)) {
      actionsContainer = document.createElement('div');
      actionsContainer.className = 'slideshow-actions';
      actionsContainer.innerHTML = `
        <button class="slideshow-purchase-btn" data-url="${artwork.purchaseUrl}" data-project="${artwork.projectId}">
          <span class="btn-text">${artwork.projectId === 'evolution-project' ? 'Purchase Print' : 'Contact Me for Availability'}</span>
          <span class="btn-icon">${artwork.projectId === 'evolution-project' ? '🛒' : '✉️'}</span>
          <span class="btn-glow"></span>
        </button>
      `;
      slideshowInfo.appendChild(actionsContainer);

      // Add event listener to new button
      const purchaseBtn = actionsContainer.querySelector('.slideshow-purchase-btn');
      purchaseBtn.addEventListener('click', () => {
        if (artwork.projectId === 'evolution-project') {
          window.open(artwork.purchaseUrl, '_blank', 'noopener,noreferrer');
        } else {
          // Close modal and scroll to contact section
          this.closeImmersiveView();
          document.querySelector('.contact-section').scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    }
  }

  closeImmersiveView() {
    const modal = document.getElementById('immersive-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // === FIXED NAVIGATION ===
  initializeFixedNav() {
    const fixedNav = document.getElementById('fixed-nav');
    const scrollThreshold = 300; // Show nav after scrolling 300px

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Show nav when scrolling down past threshold
      if (scrollTop > scrollThreshold) {
        fixedNav.classList.add('visible');
      } else {
        fixedNav.classList.remove('visible');
      }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('fixed-nav-links');

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
      });

      // Close menu when clicking a link
      const links = document.querySelectorAll('.fixed-nav-link');
      links.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenuToggle.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });
    }

    // Handle smooth scrolling for internal links
    const scrollLinks = document.querySelectorAll('.fixed-nav-link[data-scroll]');
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetClass = link.getAttribute('data-scroll');
        const targetSection = document.querySelector(`.${targetClass}`);

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
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
      enterGalleryBtn.addEventListener('click', () => {
        document.querySelector('.gallery-section').scrollIntoView({
          behavior: 'smooth'
        });
      });
    }
    if (viewGalleryBtn) {
      viewGalleryBtn.addEventListener('click', () => {
        document.querySelector('.gallery-section').scrollIntoView({
          behavior: 'smooth'
        });
      });
    }
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', () => {
        document.querySelector('.about-section').scrollIntoView({
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

        // If on home page, render on home gallery; otherwise render on gallery page
        if (this.currentPage === 'home') {
          this.renderGalleryOnHome();
        } else {
          this.renderGallery();
        }
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
      // Don't trigger shortcuts when typing in form fields
      const isTyping = e.target.matches('input, textarea, select');

      if (e.key === 'Escape') {
        if (this.currentPage === 'gallery') {
          this.closeImmersiveView();
        } else {
          this.showPage('home');
        }
      }

      // Only allow these shortcuts when not typing in forms
      if (!isTyping) {
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
        if (e.key === 'c' && !('ontouchstart' in window)) {
          if (this.currentPage === 'home') {
            document.querySelector('.contact-section').scrollIntoView({
              behavior: 'smooth'
            });
          }
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
    const exhibitionCards = document.querySelectorAll('.exhibition-card');

    exhibitionCards.forEach(card => {
      const preview = card.querySelector('.exhibition-preview');
      if (preview) {
        // Remove any existing onclick attribute from preview
        preview.removeAttribute('onclick');

        // Add click listener to entire card
        card.addEventListener('click', (event) => {
          this.showExhibitionPreview(preview, event);
        });

        // Add cursor pointer style to card
        card.style.cursor = 'pointer';
      }
    });
  }
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DreamsMeowGallery();
});
