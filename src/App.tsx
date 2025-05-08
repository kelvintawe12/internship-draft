import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Order from './pages/Order';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Terms from './pages/Terms';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { AuthContext, AuthProvider } from './context/AuthContext';
import NotFound from './pages/NotFound';
import Spinner from './components/Spinner';
import store from './store';

// Define AuthContextType (matching AuthContext.tsx)
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
}

// ProtectedRoute Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <Spinner loading={true} variant="fullscreen" />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
};

const App: React.FC = () => {
  const { loading } = useContext(AuthContext);

  return (
    <Provider store={store}>
      <AuthProvider>
        {/* Show spinner during initial auth loading */}
        {loading ? (
          <Spinner loading={true} variant="fullscreen" />
        ) : (
          <div className="min-h-screen bg-white text-black">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/order" element={<Order />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              {/* Add a route for forgot password */}
              <Route path="/signup/verify" element={<SignUp />} />
              <Route path="/signup/verify/:token" element={<SignUp />} />
              <Route path="/signup/verify/:token/:email" element={<SignUp />} />
              <Route path="/signup/verify/:token/:email/:id" element={<SignUp />} />
              <Route path="/signup/verify/:token/:email/:id/:name" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/dashboard/*"
                element={<ProtectedRoute>{dashboardRoutes()}</ProtectedRoute>}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        )}
      </AuthProvider>
    </Provider>
  );
};

export default App;