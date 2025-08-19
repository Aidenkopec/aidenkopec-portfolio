# Next.js Conversion Guide

This guide provides a phase-by-phase approach to convert your React portfolio components to Next.js 15 compatibility.

## Overview

Your current React components have several incompatibilities with Next.js App Router:

- **React Router dependencies** in navigation components
- **Missing styles system** referenced across all components  
- **Client-side features** that need explicit 'use client' directives
- **Asset import patterns** that need Next.js optimization
- **Inline styles** that should use CSS modules

## Critical Issues Identified

### 🚨 Blocking Issues (Must Fix First)
- [ ] Missing `styles` module - referenced in 12 components but doesn't exist
- [ ] React Router imports in `components/Navbar.jsx:2`
- [ ] All components need file extension updates (.jsx → .tsx eventually)

### ⚠️ Client-Side Issues (Need 'use client')
- [ ] Browser APIs: `window`, `localStorage`, `matchMedia`
- [ ] React hooks: `useState`, `useEffect`, `useContext`
- [ ] Event listeners: scroll, resize, keyboard
- [ ] Three.js canvas components
- [ ] Audio/music player functionality

---

## Phase 1: Foundation Setup 🏗️

**Priority: CRITICAL - Start Here**

### Step 1.1: Create Styles System
Create the missing styles that all components reference:

```bash
# Create styles directory
mkdir styles
```

Create `styles/index.js`:
```javascript
export const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6", 
  padding: "sm:px-16 px-6 sm:py-16 py-10",

  heroHeadText: "font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2",
  heroSubText: "text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]",

  sectionHeadText: "text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]",
  sectionSubText: "sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider",
};
```

### Step 1.2: Fix Asset Imports
Update `assets/index.js` to use proper ES6 exports:

```javascript
// Current problematic imports work, but optimize for Next.js Image
// Consider converting static imports to dynamic imports for better performance

// Add this to assets/index.js after existing exports:
export const assetPaths = {
  logo: '/assets/logo.svg',
  desktop_pc: '/desktop_pc/scene.gltf',
  planet: '/planet/scene.gltf',
  // ... add other static asset paths
};
```

### Step 1.3: Replace React Router in Navbar
**File: `components/Navbar.jsx`**

Replace lines 1-2:
```javascript
// REMOVE:
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// REPLACE WITH:
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
```

Replace lines 40-46 (Link component):
```javascript
// REMOVE:
<Link
  to="/"
  className="flex items-center gap-2"
  onClick={() => {
    setActive('');
    window.scrollTo(0, 0);
  }}
>

// REPLACE WITH:
<Link
  href="/"
  className="flex items-center gap-2"
  onClick={() => {
    setActive('');
    window.scrollTo(0, 0);
  }}
>
```

**Testing Step 1:**
```bash
npm run dev
```
Verify the site loads without import errors.

---

## Phase 2: Component Selection Strategy 🎯

Choose ONE approach:

### Option A: Start with Hero Component (Recommended)
**Pros:** Simple, self-contained, good for testing animations
**File:** `components/Hero.jsx`

Add `'use client';` as first line, test 3D computer model loads.

### Option B: Start with Complete Navbar
**Pros:** Most critical component, used site-wide  
**File:** `components/Navbar.jsx`

Focus on mobile menu, scroll detection, customization dropdown.

### Progress Tracking
- [ ] Selected starting component: _______________
- [ ] Added 'use client' directive
- [ ] Tested component renders without errors
- [ ] Verified interactive features work

---

## Phase 3: Client-Side Directive Implementation 🖱️

All these components MUST have `'use client';` as the first line:

### Immediate Client Components:
- [ ] `components/Navbar.jsx` - scroll detection, mobile menu
- [ ] `components/Hero.jsx` - Framer Motion animations  
- [ ] `components/canvas/Computers.jsx` - Three.js, window.matchMedia
- [ ] `context/MusicContext.jsx` - localStorage, audio element
- [ ] `components/MusicPlayer.jsx` - audio controls, state management

### Implementation Template:
```javascript
'use client';
import React, { useState, useEffect } from 'react';
// ... rest of imports

const ComponentName = () => {
  // ... component logic
};

export default ComponentName;
```

### Browser API Usage Locations:
- **Window object:** `components/canvas/Computers.jsx:37` - mediaQuery listener
- **LocalStorage:** `context/MusicContext.jsx:21` - volume persistence
- **ScrollY:** `components/Navbar.jsx:18` - scroll detection
- **Audio API:** `context/MusicContext.jsx:38` - music player

---

## Phase 4: 3D Canvas System 🎮

**Files requiring conversion:**
- [ ] `components/canvas/Computers.jsx`
- [ ] `components/canvas/Earth.jsx` 
- [ ] `components/canvas/Stars.jsx`
- [ ] `components/canvas/Ball.jsx`

### Three.js Specific Considerations:
```javascript
'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
// ... other imports

// Ensure all Canvas components have 'use client'
// Test WebGL compatibility in Next.js environment
```

### Model Loading Verification:
Check these paths work in Next.js:
- `/desktop_pc/scene.gltf` 
- `/planet/scene.gltf`

---

## Phase 5: Music System Migration 🎵

### Step 5.1: Music Context Migration
**File: `context/MusicContext.jsx`**
- [ ] Add `'use client';` directive
- [ ] Test localStorage persistence
- [ ] Verify keyboard shortcuts (Space, Ctrl+Arrow)
- [ ] Check audio loading from `/public/music/`

### Step 5.2: Remove Inline Styles
**File: `components/MusicPlayer.jsx:197`**

Replace inline `<style>` tag with CSS module:

Create `styles/MusicPlayer.module.css`:
```css
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
}

.slider::-moz-range-thumb {
  height: 12px;
  width: 12px; 
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
}
```

Update component:
```javascript
import styles from '../styles/MusicPlayer.module.css';

// Replace className="slider" with className={styles.slider}
```

---

## Phase 6: App Integration 🔗

### Update app/page.tsx
Replace the default Next.js page with your portfolio:

```tsx
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
// ... other imports

export default function Home() {
  return (
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Hero />
      </div>
      <About />
      {/* ... other sections */}
    </div>
  );
}
```

### Add MusicProvider
Update `app/layout.tsx`:
```tsx
import { MusicProvider } from '@/context/MusicContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MusicProvider>
          {children}
        </MusicProvider>
      </body>
    </html>
  );
}
```

---

## Testing Strategy ✅

### After Each Phase:
1. **Build Test:** `npm run build` - Must succeed
2. **Development Test:** `npm run dev` - Check console for errors
3. **Functionality Test:** Verify interactive features work
4. **Performance Test:** Check 3D models and animations load smoothly

### Specific Test Cases:
- [ ] Navigation menu opens/closes on mobile
- [ ] 3D computer model loads and renders
- [ ] Music player controls work
- [ ] Scroll animations trigger correctly
- [ ] Theme customization functions
- [ ] Keyboard shortcuts work (Space, arrows)

---

## Troubleshooting Common Issues 🔧

### Error: "ReferenceError: window is not defined"
**Solution:** Add `'use client';` to the component using window

### Error: "styles is not defined" 
**Solution:** Complete Phase 1.1 first - create styles/index.js

### Error: "Cannot resolve module 'react-router-dom'"
**Solution:** Complete Phase 1.3 - replace with next/link

### 3D Models not loading
**Solution:** Verify GLTF files are in `/public/` directory with correct paths

### Music not playing
**Solution:** Check `/public/music/` contains MP3 files, verify 'use client' on MusicContext

### Build fails with CSS errors
**Solution:** Convert inline styles to CSS modules (Phase 5.2)

---

## Progress Checklist

### Phase 1: Foundation ✅
- [ ] Created styles/index.js
- [ ] Updated asset imports  
- [ ] Replaced React Router in Navbar
- [ ] Verified site loads without import errors

### Phase 2: First Component ✅
- [ ] Selected component: ___________
- [ ] Added 'use client' directive
- [ ] Tested functionality

### Phase 3: Client Directives ✅
- [ ] Added 'use client' to all interactive components
- [ ] Tested browser APIs work
- [ ] Verified state management

### Phase 4: 3D System ✅
- [ ] Converted all canvas components
- [ ] Tested WebGL compatibility
- [ ] Verified model loading

### Phase 5: Music System ✅
- [ ] Migrated MusicContext
- [ ] Removed inline styles
- [ ] Tested audio functionality

### Phase 6: App Integration ✅
- [ ] Updated app/page.tsx
- [ ] Added MusicProvider to layout
- [ ] Final testing complete

---

## Next Steps After Conversion

1. **Optimization:** Convert remaining .jsx files to .tsx
2. **Performance:** Implement Next.js Image component for assets
3. **SEO:** Add proper metadata and structured data
4. **Deployment:** Test build process and deployment

---

**Start with Phase 1 - it will prevent the majority of import errors and give you a solid foundation for the incremental conversion process.**