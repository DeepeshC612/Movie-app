# Movie Database Management App

A modern, responsive movie database management application built with Next.js, featuring user authentication, CRUD operations, and image uploads via Cloudinary.

## Features

- **User Authentication**: Secure login/register with JWT tokens
- **Movie Management**: Create, read, update, and delete movies
- **Image Uploads**: Cloudinary integration for movie posters
- **Form Validation**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast Notifications**: User feedback for all actions
- **Protected Routes**: Authentication-based access control

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **Forms**: React Hook Form, Zod validation
- **Image Upload**: Cloudinary
- **Authentication**: JWT tokens, localStorage
- **Font**: Montserrat (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` file in the root directory:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── api/
│   ├── auth/           # Authentication endpoints
│   ├── movies/         # Movie CRUD endpoints
│   └── upload/         # Cloudinary image upload
├── movies/
│   ├── add/           # Add movie page
│   ├── edit/[id]/     # Edit movie page
│   └── page.tsx       # Movies listing
├── register/          # User registration
├── signin/           # User login
├── layout.tsx        # Global layout with background
└── globals.css       # Global styles

components/
├── ProtectedRoute.tsx # Route protection
└── Spinner.tsx       # Loading spinner

lib/
├── auth-context.tsx  # Authentication context
└── toast-context.tsx # Toast notifications
```

## Key Features

### Authentication
- **Register**: Create new user account with validation
- **Login**: Secure authentication with "Remember Me" option
- **Protected Routes**: Automatic redirect for unauthorized access
- **Logout**: Clear session and redirect to login

### Movie Management
- **List Movies**: Grid view with movie posters and details
- **Add Movie**: Form with title, year, and poster upload
- **Edit Movie**: Update existing movie information
- **Delete Movie**: Remove movies with confirmation
- **Empty State**: Helpful message when no movies exist

### Form Validation
- **Real-time validation** with error messages
- **Required fields**: Title, publishing year, movie poster
- **Email validation**: Proper email format checking
- **Password validation**: Minimum length requirements
- **Password confirmation**: Matching password validation

### Image Upload
- **Drag & drop** interface for easy uploads
- **File selection** via click
- **Image preview** before submission
- **Cloudinary integration** for reliable storage
- **Loading states** during upload

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Movies
- `GET /api/movies` - Get all movies
- `POST /api/movies` - Create new movie
- `PUT /api/movies/[id]` - Update movie
- `DELETE /api/movies/[id]` - Delete movie

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

## Styling

- **Background**: Custom teal gradient (`#093545`)
- **Wave Design**: SVG wave overlay at bottom
- **Colors**: Green primary (`#2BD17E`), red for delete actions
- **Typography**: Montserrat font family
- **Responsive**: Mobile-first design with breakpoints

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
