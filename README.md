# Express App with Authentication 🔐

Full-featured web application with registration, login system, and protected pages. Ready to deploy on Vercel.

## 🚀 Technologies

- **Backend**: Express.js, Node.js
- **Database**: MongoDB Atlas
- **Authentication**: express-session, bcryptjs
- **Session Store**: connect-mongo
- **Environment**: dotenv

## 📁 Project Structure

```
express-auth-app/
├── public/
│   ├── index.html      # Home page
│   ├── login.html      # Login page
│   ├── register.html   # Registration page
│   └── secret.html     # Protected page
├── server.js           # Main server file
├── package.json
├── vercel.json         # Vercel configuration
├── .env                # Environment variables (don't include in git!)
├── .env.example        # Environment variables example
├── .gitignore
└── README.md
```

## 🛠️ Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd express-auth-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MongoDB Atlas

1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free M0)
3. Create a database user
4. Add IP address `0.0.0.0/0` to Network Access (for development)
5. Copy the Connection String

### 4. Create .env file

Copy `.env.example` to `.env` and fill in the details:

```bash
cp .env.example .env
```

Edit `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name
SESSION_SECRET=your_super_secret_random_string_here
NODE_ENV=development
PORT=3000
```

**Important**: Replace `username`, `password`, `cluster0.xxxxx`, and `database_name` with your data!

For `SESSION_SECRET`, generate a random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Run the server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

Open your browser: `http://localhost:3000`

## 🌐 Deploy to Vercel

### 1. Preparation

1. Make sure `.env` is in `.gitignore`
2. Commit all changes to Git:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### 3. Or via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your Git repository
4. Add Environment Variables:
   - `MONGODB_URI`
   - `SESSION_SECRET`
   - `NODE_ENV=production`

### 4. Configure environment variables

In Vercel Dashboard → Settings → Environment Variables, add:

- `MONGODB_URI`: Your MongoDB connection string
- `SESSION_SECRET`: Random secret key
- `NODE_ENV`: `production`

**Important**: For production in MongoDB Atlas, add Vercel's IP or allow access from all IPs.

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
  ```json
  {
    "username": "john",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/login` - User login
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/logout` - User logout

- `GET /api/me` - Get current user data (requires authorization)

### Pages

- `GET /` - Home page
- `GET /login` - Login page
- `GET /register` - Registration page
- `GET /secret` - Protected page (accessible after login)

##  Security

- Passwords encrypted with **bcrypt**
- Sessions stored in **MongoDB**
- Using **httpOnly cookies**
- Data validation on client and server
- Environment variables via **.env**

##  Features

-  User registration
-  Login/Logout
-  Protected routes
-  Session storage in MongoDB
-  Password hashing
-  Form validation
-  Responsive design
-  Error display
-  Automatic redirect after login

##  Troubleshooting

### MongoDB connection error

- Check `MONGODB_URI` correctness
- Make sure IP address is allowed in MongoDB Atlas Network Access
- Verify username and password

### Session not persisting

- Check `SESSION_SECRET` in `.env`
- Make sure `connect-mongo` is configured correctly
- Check cookies in browser

### Not working on Vercel

- Make sure all Environment Variables are added
- Check logs in Vercel Dashboard
- MongoDB Atlas must allow Vercel's IP

## 📄 License

ISC