import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import RegistrationSuccess from './pages/RegistrationSuccess';

import DashboardLayout from './components/dashboard/DashboardLayout';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import OtpVerification from './pages/OtpVerification';
import ResetPassword from './pages/ResetPassword';
import Merchants from './pages/Merchants';
import TransactionFees from './pages/TransactionFees';
import Transactions from './pages/Transactions';
import PlatformSettings from './pages/PlatformSettings';





function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          {/* 
            Protected routes with dashboard layout  */}

          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/merchants" element={
            <DashboardLayout>
              <Merchants />
            </DashboardLayout>
          } />

          <Route path="/transactions" element={
            <DashboardLayout>
              <Transactions />
            </DashboardLayout>
          } />

                   <Route path="/transaction-fees" element={
            <DashboardLayout>
              <TransactionFees />
            </DashboardLayout>
          } />


          <Route path="/profile" element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          } />


          <Route path="/settings" element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          } />

          <Route path="/platform-settings" element={
            <DashboardLayout>
              <PlatformSettings />
            </DashboardLayout>
          } />



          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </div>

  );
}

export default App;


