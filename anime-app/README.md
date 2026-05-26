# Anime Hub - React Web Application

A comprehensive web application built with React for discovering and exploring anime content. This application integrates with the Anilist API and a custom API to provide users with trending, top-rated, and seasonal anime information.

## Features

- **🔥 Trending Now**: Displays the top 10 trending anime series from Anilist
- **⭐ Top Rated**: Showcases highly-rated anime titles
- **📚 Genre Categories**: Browse anime by popular genres (Action, Adventure, Comedy, Drama, etc.)
- **🍂 Seasonal Anime**: View current season's anime releases
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **Modern UI/UX**: Beautiful gradient designs, smooth animations, and intuitive navigation

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features (Grid, Flexbox, Animations)
- **API Integration**: 
  - Anilist GraphQL API (https://graphql.anilist.co)
  - Custom API (configurable)
- **Deployment**: Vercel-ready

## Project Structure

```
anime-app/
├── public/                 # Static assets
├── src/
│   ├── api/
│   │   ├── anilist.js      # Anilist API integration
│   │   └── customApi.js    # Custom API integration
│   ├── components/
│   │   ├── AnimeCard.jsx   # Individual anime card component
│   │   ├── AnimeSection.jsx # Section container for anime lists
│   │   ├── Footer.jsx      # Footer component
│   │   ├── Header.jsx      # Navigation header
│   │   └── Hero.jsx        # Hero/banner section
│   ├── hooks/
│   │   └── useAnime.js     # Custom React hooks for data fetching
│   ├── App.jsx             # Main application component
│   ├── App.css             # Global app styles
│   ├── main.jsx            # Application entry point
│   └── index.css           # Base styles
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd anime-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, for custom API):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment on Vercel

This application is optimized for deployment on Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will automatically detect the Vite configuration

3. Configure environment variables (if using custom API):
   - Add `VITE_CUSTOM_API_URL` in Vercel's environment variables settings

4. Deploy!

## API Integration

### Anilist API

The application uses the Anilist GraphQL API to fetch anime data. No API key is required for basic usage.

Key endpoints and queries:
- Trending Anime: Fetches currently trending titles
- Top Rated: Gets highest-rated anime
- By Genre: Filters anime by specific genres
- Seasonal: Retrieves current season's releases

### Custom API

The application is designed to integrate with a custom API for additional features:

- Featured anime recommendations
- Personalized suggestions
- Additional metadata

To configure your custom API, set the `VITE_CUSTOM_API_URL` environment variable.

## Customization

### Adding New Genres

Edit the `App.jsx` file and modify the `selectedGenre` state:

```jsx
const [selectedGenre] = useState('Your Genre Here');
```

### Styling

All components have dedicated CSS files. Modify them to change colors, layouts, and animations.

Main color scheme:
- Primary: `#667eea` → `#764ba2` (gradient)
- Background: `#1e1e2e`, `#2a2a3e`
- Text: `#ffffff`, `#b0b0c0`

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Anime data provided by [AniList](https://anilist.co)
- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)

---

For more information or support, please open an issue on the repository.
