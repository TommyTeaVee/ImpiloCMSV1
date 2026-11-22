import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import MagazineReader from "./components/magazine/MagazineReader.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import { initMatomo, trackPageView } from "./services/Matomo";

// Private pages: client-only, not prerendered
const ReaderDashboard = lazy(() => import("./pages/ReaderDashboard.jsx"));
const EditorialCMS = lazy(() => import("./pages/EditorialCMS.jsx"));
const EditorialWorkspace = lazy(() => import("./components/editorial/EditorialWorkspace.jsx"));
const EditorialLogin = lazy(() => import("./pages/EditorialLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const MediaPickerTest = lazy(() => import("./pages/MediaPickerTest.jsx"));
const CloudFrontMediaTest = lazy(() => import("./pages/CloudFrontMediaTest.jsx"));

// Counts one page view per route change (private pages are skipped inside trackPageView)
function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(document.title);
  }, [location.pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    initMatomo(userId);
  }, []);

  return (
    <Suspense fallback={null}>
      <RouteTracker />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />

        {/* Magazine reader */}
        <Route path="/read/:slug" element={<MagazineReader />} />
        <Route path="/read/:slug/page/:pageNumber" element={<MagazineReader />} />

        {/* Issue preview (admin/editor only, not indexed) */}
        <Route path="/preview/:slug" element={<MagazineReader />} />
        <Route path="/preview/:slug/page/:pageNumber" element={<MagazineReader />} />

        {/* Reader dashboard */}
        <Route path="/reader" element={<ReaderDashboard />} />

        {/* Editorial CMS */}
        <Route path="/editorial/login" element={<EditorialLogin />} />
        <Route path="/editorial" element={<EditorialCMS />} />
        <Route path="/editorial/new" element={<EditorialWorkspace />} />

        {/* Administration */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Development and testing */}
        <Route path="/media-picker-test" element={<MediaPickerTest />} />
        <Route path="/cloudfront-test" element={<CloudFrontMediaTest />} />

        {/* Fallback: a real not-found page, not a redirect */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;