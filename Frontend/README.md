# 🕯️ WicknWax - פתיל ואש

**נרות דקורטיביים ריחניים בעבודת יד**

An elegant e-commerce website for handmade decorative scented candles built with React, TypeScript, and Material-UI.

## ✨ Features

### 🎯 Core Functionality

- **Product Catalog**: Browse a curated collection of handmade candles
- **Advanced Search**: Search candles by name, type, color, scent, and tags
- **Smart Filtering**: Filter by color, size, scent, type, and price range
- **Flexible Sorting**: Sort products by name, price, type, or newest additions
- **Shopping Cart**: Add items to cart with quantity selection
- **Favorites System**: Save favorite candles (requires user login)
- **User Authentication**: Register/login with email or Google OAuth

### 🎨 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **RTL Support**: Full Hebrew language support with right-to-left layout
- **Smooth Animations**: Elegant transitions and hover effects
- **Toast Notifications**: Real-time feedback for user actions

### 📱 Pages

- **Home**: Hero banner carousel with featured candle images
- **Products**: Complete product catalog with filtering and search
- **About**: Company story and mission
- **Favorites**: Personalized collection of favorite products
- **404 Page**: User-friendly error page with navigation options

### 🛠️ Technical Features

- **TypeScript**: Full type safety throughout the application
- **Redux Toolkit**: State management for cart and user data
- **React Router**: Client-side routing with dynamic search parameters
- **Material-UI**: Modern, accessible component library
- **Form Validation**: Joi schema validation for user inputs
- **Local Storage**: Persistent cart and user preferences

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Candula
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Cart.tsx        # Shopping cart drawer
│   ├── Filter.tsx      # Product filtering interface
│   ├── Footer.tsx      # Site footer
│   ├── Login.tsx       # User login form
│   ├── Navbar.tsx      # Navigation header
│   ├── Signup.tsx      # User registration form
│   └── Sort.tsx        # Product sorting controls
├── pages/              # Main application pages
│   ├── About.tsx       # Company information
│   ├── Favorites.tsx   # User's favorite products
│   ├── Home.tsx        # Homepage with banner
│   ├── NotFound.tsx    # 404 error page
│   └── Products.tsx    # Product catalog
├── slices/             # Redux state slices
│   ├── cartSlice.tsx   # Shopping cart state
│   └── userSlice.tsx   # User authentication state
├── threeComps/         # Three.js 3D components
│   └── Candle.tsx      # Interactive 3D candle model
├── data/               # Static data and product information
├── validation/         # Form validation schemas
├── types/              # TypeScript type definitions
└── styles/             # CSS and styling files
```

## 🛒 Key Features Breakdown

### Shopping Cart

- Add/remove items with quantity controls
- Persistent storage across browser sessions
- Real-time price calculations
- Drawer-style cart interface

### Search & Filtering

- Real-time search across multiple product fields
- URL-based search parameters for shareable links
- Multi-criteria filtering system
- Responsive filter controls for mobile

### User Authentication

- Email/password registration and login
- Google OAuth integration
- Persistent user sessions
- Protected routes for favorites

### 3D Integration

- Interactive Three.js candle model
- Orbit controls for 360° viewing
- Realistic lighting and shadows
- Responsive 3D canvas

## 🎨 Design System

### Colors

- **Primary**: `#7f6000` (Brown/Gold)
- **Secondary**: `#f2df3b` (Yellow/Gold)
- **Accent**: `#ffd700` (Gold)

### Typography

- **Hebrew**: Custom Hebrew fonts with RTL support
- **Responsive**: Fluid typography that scales with screen size

### Layout

- **Grid-based**: CSS Grid for product layouts
- **Flexbox**: Flexible component arrangements
- **Responsive**: Mobile-first approach

## 🔧 Configuration

### Environment Setup

The project uses Vite with TypeScript. Key configuration files:

- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript settings
- `eslint.config.js` - Code linting rules

### Styling

- Material-UI theme customization in `src/theme/theme.ts`
- RTL support with stylis plugins
- Custom animations in `src/styles/animations.css`

## 📦 Dependencies

### Core

- React 19.1.0
- TypeScript 5.8.3
- Vite 6.3.5

### UI & Styling

- @mui/material 7.1.1
- @emotion/react & @emotion/styled
- Material-UI Icons

### State Management

- @reduxjs/toolkit 2.8.2
- react-redux 9.2.0

### 3D Graphics

- three 0.177.0
- @react-three/fiber 9.1.2
- @react-three/drei 10.2.0

### Forms & Validation

- react-hook-form 7.58.1
- joi 17.13.3

### Routing & Navigation

- react-router-dom 7.6.2

### Additional Features

- react-toastify (notifications)
- swiper (carousel)
- @react-oauth/google (Google auth)

## 🌟 Future Enhancements

- **Product Details Page**: Individual product pages with more images
- **User Reviews**: Customer review and rating system
- **Payment Integration**: Stripe/PayPal checkout process
- **Order Management**: Order history and tracking
- **Admin Panel**: Product management interface
- **Multi-language**: English language support
- **PWA Features**: Offline functionality and app installation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ for candle lovers everywhere**
