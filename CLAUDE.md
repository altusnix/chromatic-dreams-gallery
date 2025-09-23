# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Code Architecture

### Core Application Structure

The codebase is a single-page application (SPA) built with Vite, vanilla JavaScript, and CSS3. The main application logic is contained in a single `DreamsMeowGallery` class that manages all gallery functionality.

### Main Application Class: `DreamsMeowGallery`

The application is built around a central class located in `src/main.js` that handles:

- **Page Management**: Single-page navigation between home, gallery, and contact sections
- **Project Data**: Hardcoded projects array containing art collections (Evolution Project, Glass, Wire Wraps, Photography, Mixed Projects)
- **Gallery System**: Image filtering, slideshow navigation, and immersive viewing
- **Animation Systems**: Canvas-based particle background and hero banner slider
- **Modal Systems**: Exhibition previews and fullscreen artwork viewing

### Key State Properties

- `currentFilter` - Active project filter ('all' or specific project ID)
- `projects` - Array of art project objects with images, titles, and metadata
- `allImages` - Flattened array of all artwork images across projects
- `currentPage` - Active page section ('home', 'gallery', 'contact')
- `currentProject` / `currentImageIndex` - Slideshow navigation state

### Art Portfolio Organization

```
art-portfolio/
├── evolution-project/    # Psychedelic/transformative art
├── glass/               # Glass art and installations
├── wire-wraps/          # Wire jewelry and sculptures
├── photography/         # Fine art photography
├── nature/              # Nature photography
├── light-paintings/     # Light painting photography
├── me/                  # Self portraits
└── paintings/           # Traditional paintings
```

Images are referenced by filename in the `projects` array within `loadProjects()`. To add new artworks:
1. Add images to appropriate project folder
2. Update the corresponding project's `images` array in `loadProjects()`

### Gallery Navigation System

The gallery uses two distinct navigation systems:
- **Banner Slider**: Automatic rotating slides on homepage showcasing project previews
- **Immersive Slideshow**: Full-screen artwork viewing with manual navigation

Navigation works across filtering states - when `currentFilter === 'all'`, users can navigate through all images; when filtered to a specific project, navigation is limited to that project's images.

### Exhibition System

Exhibition cards display upcoming/past shows with clickable preview thumbnails. Each exhibition card contains:
- Date, title, and venue information
- Preview thumbnail that opens modal with enlarged image
- Custom modal system with backdrop blur effects

### CSS Architecture

The styling uses CSS custom properties for theming, CSS Grid for layouts, and glassmorphism effects throughout. Key design elements:
- **Glassmorphism**: `backdrop-filter: blur()` with semi-transparent overlays
- **Color System**: HSL-based with CSS custom properties for theming
- **Typography**: Orbitron for headings, Space Grotesk for body text
- **Responsive Design**: CSS Grid with mobile-first breakpoints

### Event Handling Patterns

Event listeners are attached in `setupEventListeners()` and many use event delegation. Modal systems rely on proper event listener management to prevent conflicts between different popup types (exhibition previews vs. immersive gallery view).

### Publications System

Publications are organized in a 2-column layout (Art Publications / Photo Publications) with each column using a 2-column grid internally. Publications display without dates (these were removed) and are categorized thematically.

## Important Implementation Details

- **No Build-Time Framework**: Pure vanilla JavaScript with ES6 modules
- **Canvas Animations**: Particle system runs on requestAnimationFrame
- **Image Loading**: Dynamic image loading based on project configuration
- **State Management**: All state contained within the main class instance
- **Modal Management**: Multiple modal systems that must not conflict
- **E-commerce Integration**: Direct links to Snow Meow Art store for purchasing

## Styling Conventions

- Use CSS custom properties for colors and measurements
- Maintain glassmorphism aesthetic with backdrop-filter
- Keep animations smooth with CSS transitions and transforms
- Follow mobile-first responsive design patterns
- Preserve the psychedelic/visionary art theme in all design decisions