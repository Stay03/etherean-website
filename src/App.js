import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CheckoutProvider } from './contexts/CheckoutContext';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const CourseLearnPage = lazy(() => import('./pages/CourseLearnPage'));
const MyItemsPage = lazy(() => import('./pages/MyItemsPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const EthereanMissionProjectsPage = lazy(() => import('./pages/EthereanMissionProjects'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const BranchesPage = lazy(() => import('./pages/BranchesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const FreeCoursesPage = lazy(() => import('./pages/FreeCoursesPage'));
const BlankPage = lazy(() => import('./pages/BlankPage'));
const WhyJesusPage = lazy(() => import('./pages/WhyJesusCameOnEarth'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));


// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Create a wrapper component that will conditionally render the footer
const AppContent = () => {
  const location = useLocation();
  
  // Check if the current path is the learning page
  const isLearningPage = location.pathname.includes('/course/') && location.pathname.includes('/learn');
  const isCheckoutPage = location.pathname.includes('/checkout');
  const isSearchPage = location.pathname === '/search'; // Added for SearchPage
  
  return (
    <>
      {/* Header comes first at full width, outside any containers with padding */}
      <Header />
      
      {/* Main content div with padding */}
      {/* Conditionally apply padding for search page to allow full-width feel */}
      <div className={`${!isSearchPage ? 'bg-white p-4 sm:p-6 lg:p-6' : ''} min-h-screen`}>
        {/* White border container with rounded corners - not for search page */}
        <div className={!isSearchPage ? "relative bg-gray-50 min-h-[calc(100vh-32px)] overflow-hidden rounded-[30px]" : ""}>
          <div className="relative font-questrial">
            {/* SVG for top-right corner rounded effect - laptop and desktop only, not for search page */}
            {!isSearchPage && (
              <div className="absolute top-20 right-0 z-10 hidden lg:block">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M35 0V35C35 15.67 19.33 0 -1.53184e-05 0H35Z" fill="white"></path>
                </svg>
              </div>
            )}

            {/* Routes content with Suspense fallback */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/course/:slug" element={<CourseDetailPage />} />
                <Route path="/course/:slug/learn" element={<CourseLearnPage />} />
                <Route path="/my-items" element={<MyItemsPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/:orderId" element={<PaymentPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:slug" element={<EventDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/about/projects" element={<EthereanMissionProjectsPage />} />
                <Route path="/about/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/about/branches" element={<BranchesPage />} />
                <Route path="/about/gallery" element={<GalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/free-courses" element={<FreeCoursesPage />} />
                <Route path="/why-jesus" element={<WhyJesusPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/ministries/youth" element={<BlankPage />} />
                <Route path="/ministries/healthy" element={<BlankPage />} />
                <Route path="/ministries/inner-circle" element={<BlankPage />} />
                <Route path="/ministries/flower-light" element={<BlankPage />} />

                
                
                
                {/* Catch-all route for 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
      
      {/* Conditionally render footer only when NOT on learning page or search page */}
      {!isLearningPage && !isCheckoutPage && !isSearchPage && <Footer />}
      
      {/* Add ToastContainer for react-toastify */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  );
}

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
    <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
    <p className="text-lg text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
    <a 
      href="/"
      className="px-8 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-colors duration-300"
    >
      Return Home
    </a>
  </div>
);

export default App;