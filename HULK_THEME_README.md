# Hulk Theme - React Admin Dashboard

A complete dark Material Design admin theme inspired by the [Hulk admin template](https://hulk.theironnetwork.org/app/tables/ag-grid).

## 🎨 Features

- **Dark Material Design**: Beautiful dark theme with purple accents and smooth animations
- **Responsive Layout**: Fully responsive design that works on all devices
- **Modern Components**: Pre-built React components with TypeScript support
- **TanStack Table**: Powerful data tables with sorting, filtering, and pagination
- **Customizable**: Easy to customize with SCSS variables and mixins
- **Performance Optimized**: Fast loading with optimized React components

## 📁 File Structure

```
src/
├── components/HulkTheme/
│   ├── HulkLayout.tsx          # Main layout component
│   ├── HulkLayout.scss         # Layout styles
│   ├── HulkSidebar.tsx         # Sidebar navigation
│   ├── HulkSidebar.scss        # Sidebar styles
│   ├── HulkHeader.tsx          # Header with search and user menu
│   ├── HulkHeader.scss         # Header styles
│   ├── HulkDataTable.tsx       # TanStack Table component
│   ├── HulkDataTable.scss      # Table styles
│   ├── HulkSamplePage.tsx      # Complete sample page
│   ├── HulkSamplePage.scss     # Sample page styles
│   └── index.ts                # Component exports
├── styles/themes/
│   └── hulk-theme.scss         # Main theme variables and mixins
└── HulkThemeDemo.tsx           # Demo implementation
```

## 🚀 Quick Start

### 1. Import the Theme

```tsx
import React from 'react';
import { HulkSamplePage } from './components/HulkTheme';

function App() {
  return <HulkSamplePage />;
}
```

### 2. Use Individual Components

```tsx
import React from 'react';
import { HulkLayout, HulkDataTable } from './components/HulkTheme';

function MyPage() {
  return (
    <HulkLayout title="My Dashboard">
      <div className="my-content">
        <HulkDataTable />
      </div>
    </HulkLayout>
  );
}
```

## 🎨 Theme Customization

The theme uses SCSS variables that can be easily customized:

```scss
// Primary Colors
$hulk-primary: #673ab7;
$hulk-primary-dark: #512da8;
$hulk-accent: #ff4081;

// Dark Theme Colors
$hulk-dark-bg: #1a1a1a;
$hulk-dark-surface: #2d2d2d;
$hulk-dark-card: #3d3d3d;

// Typography
$hulk-font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

## 📊 TanStack Table Integration

The theme includes a powerful data table component using TanStack Table:

```tsx
import { HulkDataTable } from './components/HulkTheme';

// The table includes:
// - Sorting functionality
// - Global search/filtering
// - Pagination
// - Responsive design
// - Custom cell renderers
// - Action buttons
```

## 🎯 Components Overview

### HulkLayout
Main layout wrapper with sidebar and header.

**Props:**
- `children`: React components to render in the main content area
- `title?`: Page title for the header

### HulkSidebar
Collapsible sidebar navigation with menu items.

**Features:**
- Responsive design (slide-out on mobile)
- Collapsible for desktop
- Nested menu support
- User profile section

### HulkHeader
Top header bar with search, notifications, and user menu.

**Features:**
- Global search functionality
- Notification dropdown
- User menu with profile options
- Breadcrumb navigation
- Mobile-friendly

### HulkDataTable
Advanced data table with TanStack Table integration.

**Features:**
- Column sorting
- Global filtering
- Pagination
- Responsive design
- Custom cell renderers
- Action buttons

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#673ab7)
- **Accent**: Pink (#ff4081)
- **Success**: Green (#4caf50)
- **Warning**: Orange (#ff9800)
- **Error**: Red (#f44336)
- **Info**: Blue (#2196f3)

### Typography
- **Font Family**: Roboto, Helvetica Neue, Arial
- **Font Weights**: 300, 400, 500, 700
- **Font Sizes**: 0.75rem to 2rem

### Spacing System
- **XS**: 0.25rem (4px)
- **SM**: 0.5rem (8px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)
- **XXL**: 3rem (48px)

### Shadows
- **XS**: Subtle shadow for small elements
- **SM**: Small shadow for cards
- **MD**: Medium shadow for elevated content
- **LG**: Large shadow for modals
- **XL**: Extra large shadow for important elements

## 🔧 Utility Classes

The theme provides utility classes for common styling needs:

```scss
// Buttons
.hulk-btn              // Basic button
.hulk-btn-primary      // Primary button
.hulk-btn-gradient     // Gradient button
.hulk-btn-sm           // Small button

// Cards
.hulk-card             // Basic card styling

// Text
.hulk-text-primary     // Primary text color
.hulk-text-secondary   // Secondary text color

// Backgrounds
.hulk-bg-primary       // Primary background
.hulk-bg-gradient-*    // Gradient backgrounds

// Spacing
.hulk-p-*              // Padding utilities
.hulk-m-*              // Margin utilities
```

## 📱 Responsive Design

The theme is fully responsive with breakpoints:

- **XS**: 0px and up
- **SM**: 576px and up
- **MD**: 768px and up
- **LG**: 992px and up
- **XL**: 1200px and up
- **XXL**: 1400px and up

## 🎭 Mixins

The theme provides SCSS mixins for consistent styling:

```scss
@include hulk-card;           // Apply card styling
@include hulk-button($color); // Create custom buttons
@include hulk-input;          // Style form inputs
@include hulk-table;          // Style tables
```

## 🚀 Performance Tips

1. **Import only what you need**: Import individual components instead of the entire theme
2. **Optimize images**: Use appropriate image formats and sizes
3. **Use CSS-in-JS sparingly**: Prefer SCSS for styling when possible
4. **Lazy load components**: Use React.lazy() for code splitting

## 🤝 Contributing

To contribute to the Hulk theme:

1. Follow the existing code structure
2. Use TypeScript for all components
3. Write SCSS using the BEM methodology
4. Ensure responsive design
5. Add appropriate prop types and documentation

## 📄 License

This theme is based on the Hulk admin template design and is created for educational and demonstration purposes.

## 🔗 Related Links

- [Original Hulk Template](https://hulk.theironnetwork.org/app/tables/ag-grid)
- [TanStack Table Documentation](https://tanstack.com/table/v8)
- [Material Design Guidelines](https://material.io/design)
- [React Documentation](https://react.dev)

---

Built with ❤️ using React, TypeScript, and SCSS 