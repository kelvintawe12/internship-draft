import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import MainLayout from './layout/MainLayout';
import { AuthContextProvider } from './context/AuthContext';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Order from './pages/Order';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import VerifyEmail from './pages/VerifyEmail';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthContextProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/order" element={<Order />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
      </AuthContextProvider>
    </Provider>
  );
};

export default App;