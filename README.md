
# EventHub - Event Booking Platform

A modern, full-featured event booking platform built with React, TypeScript, and Tailwind CSS. EventHub allows users to discover, book, and manage tickets for various events including technology conferences, music festivals, business meetups, art exhibitions, and more.

## ✨ Features

### 🎫 Event Management
- Browse and search events by category, date, location, and keywords
- Detailed event pages with comprehensive information
- Real-time seat availability tracking
- Multiple event categories (Technology, Music, Business, Art, Food, Marketing)

### 👤 User Authentication
- User registration and login system
- Role-based access control (User/Admin)
- Protected routes and personalized experiences
- Demo credentials for testing

### 📱 Booking System
- Intuitive ticket booking flow
- Multiple ticket selection
- Secure payment form simulation
- Booking confirmation and management
- Downloadable tickets (simulated)

### 📊 User Dashboard
- Personal booking history
- Booking status tracking (Confirmed, Pending, Cancelled)
- Ticket management and downloads
- Rating and review system

### 🛠️ Admin Dashboard
- Event creation and management
- Booking analytics and statistics
- User management capabilities
- Revenue tracking

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful component library using shadcn/ui
- Dark/Light mode support
- Interactive animations and transitions
- Accessibility-focused design

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible components

### State Management
- **React Context API** - Authentication state
- **React Hooks** - Local state management
- **LocalStorage** - Client-side data persistence

### Libraries & Tools
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Lucide React** - Icon library
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications
- **EmailJS** - Contact form functionality

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eventhub.git
   cd eventhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_NAME=EventHub
VITE_API_URL=your_api_url_here
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Email Configuration
To enable the contact form, set up EmailJS:
1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a service and template
3. Update the credentials in `src/components/ContactForm.tsx`

## 🎯 Usage

### User Roles

**Regular Users:**
- Browse and search events
- Book tickets for events
- Manage personal bookings
- Download tickets
- Rate and review events

**Admin Users:**
- All user capabilities
- Create and manage events
- View booking analytics
- Manage user accounts
- Access admin dashboard

### Demo Credentials
```
User Account:
Email: user@example.com
Password: password

Admin Account:
Email: admin@example.com
Password: password
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ContactForm.tsx # Contact form component
│   ├── EventCard.tsx   # Event display card
│   ├── Header.tsx      # Application header
│   ├── Navbar.tsx      # Navigation bar
│   └── ProductCard.tsx # Product display card
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication context
│   └── CartContext.tsx # Shopping cart context
├── data/              # Static data and mock data
│   ├── events.ts      # Event data
│   └── products.ts    # Product data
├── hooks/             # Custom React hooks
│   ├── use-mobile.tsx # Mobile detection hook
│   └── use-toast.ts   # Toast notification hook
├── pages/             # Page components
│   ├── BookingForm.tsx # Ticket booking form
│   ├── Dashboard.tsx   # User/Admin dashboard
│   ├── EventDetails.tsx # Event details page
│   ├── Home.tsx       # Homepage
│   ├── Login.tsx      # Login page
│   ├── Register.tsx   # Registration page
│   └── NotFound.tsx   # 404 page
├── types/             # TypeScript type definitions
│   ├── event.ts       # Event-related types
│   └── product.ts     # Product-related types
├── lib/               # Utility functions
│   ├── axios.ts       # HTTP client setup
│   └── utils.ts       # Common utilities
└── App.tsx            # Main application component
```

## 🎨 Design System

The application uses a consistent design system based on:
- **Color Palette**: Primary blues with semantic colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing scale
- **Components**: Reusable, accessible components
- **Responsive Design**: Mobile-first approach

## 🔐 Security Features

- Input validation and sanitization
- XSS protection
- CSRF protection considerations
- Secure authentication patterns
- Protected route implementation

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Performance Optimizations

- Code splitting with React.lazy
- Image optimization
- Bundle optimization with Vite
- Efficient re-rendering with React.memo
- LocalStorage for client-side caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide](https://lucide.dev/) for the icon set
- [Unsplash](https://unsplash.com/) for the placeholder images
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

For support, email mr.shudhuingle@gmail.com

---

Made with ❤️ by Shudddhodan Ingale
