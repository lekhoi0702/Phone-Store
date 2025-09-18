# Phone Store Admin Dashboard

A professional React admin dashboard built with Ant Design and AdminLTE template for managing a phone store.

## Features

- 🎨 **Modern UI**: Built with Ant Design components and AdminLTE template
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔧 **Brand Management**: Full CRUD operations for brand management
- 📂 **Category Management**: Full CRUD operations for category management
- 📊 **Dashboard**: Overview statistics and recent data
- 🔄 **Real-time Updates**: Live data updates from WebAPI backend
- 🎯 **Professional Design Pattern**: Clean, maintainable code structure

## Tech Stack

- **React 18** - Frontend framework
- **Ant Design 5** - UI component library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API calls
- **AdminLTE 3** - Admin template styling

## Project Structure

```
WebADMIN/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js          # Main dashboard component
│   │   ├── BrandManagement.js    # Brand CRUD operations
│   │   └── CategoryManagement.js # Category CRUD operations
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── App.js                   # Main app component with layout
│   ├── index.js                 # App entry point
│   └── index.css                # AdminLTE styles
├── package.json
└── README.md
```

## Installation

1. Navigate to the WebADMIN directory:
   ```bash
   cd WebADMIN
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Configuration

### API Configuration

Update the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'https://localhost:7000/api'; // Update to your WebAPI URL
```

### Features

#### Dashboard
- Overview statistics (Total Brands, Total Categories, Active counts)
- Recent brands and categories tables
- Quick action buttons

#### Brand Management
- View all brands in a paginated table
- Add new brands with logo support
- Edit existing brand information
- Delete brands with confirmation
- Filter by status (Active/Inactive)
- Sort by name and creation date

#### Category Management
- View all categories in a paginated table
- Add new categories
- Edit existing category information
- Delete categories with confirmation
- Filter by status (Active/Inactive)
- Sort by name and creation date

## Design Patterns Used

### 1. Service Layer Pattern
- Centralized API calls in `services/api.js`
- Separation of concerns between UI and data access
- Easy to maintain and test

### 2. Component Composition
- Reusable components with clear responsibilities
- Props-based communication
- Clean component hierarchy

### 3. State Management
- Local state management with React hooks
- Centralized loading and error states
- Optimistic updates for better UX

### 4. Error Handling
- Global error handling with interceptors
- User-friendly error messages
- Graceful fallbacks

## API Integration

The dashboard connects to your WebAPI backend with the following endpoints:

### Brand Endpoints
- `GET /api/brand` - Get all brands
- `GET /api/brand/{id}` - Get brand by ID
- `POST /api/brand` - Create new brand
- `PUT /api/brand/{id}` - Update brand
- `DELETE /api/brand/{id}` - Delete brand

### Category Endpoints
- `GET /api/category` - Get all categories
- `GET /api/category/{id}` - Get category by ID
- `POST /api/category` - Create new category
- `PUT /api/category/{id}` - Update category
- `DELETE /api/category/{id}` - Delete category

## Customization

### Styling
- AdminLTE theme colors can be modified in `src/index.css`
- Ant Design theme can be customized in `src/App.js`

### Adding New Features
1. Create new components in `src/components/`
2. Add API methods in `src/services/api.js`
3. Update routing in `src/App.js`
4. Add navigation items in the sidebar

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## License

This project is part of the Phone Store application.
