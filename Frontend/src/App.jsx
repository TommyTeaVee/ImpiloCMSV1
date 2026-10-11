
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import ReaderDashboard from "./pages/ReaderDashboard.jsx";
import MagazineReader from "./components/magazine/MagazineReader.jsx";

import EditorialCMS from "./pages/EditorialCMS.jsx";
import EditorialWorkspace from "./components/editorial/EditorialWorkspace.jsx";
import EditorialLogin from "./pages/EditorialLogin.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import MediaPickerTest from "./pages/MediaPickerTest.jsx";
import CloudFrontMediaTest from "./pages/CloudFrontMediaTest.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Reader dashboard */}
        <Route
          path="/reader"
          element={<ReaderDashboard />}
        />

        {/* Magazine reader */}
        <Route
          path="/read/:slug"
          element={<MagazineReader />}
        />

        <Route
          path="/read/:slug/page/:pageNumber"
          element={<MagazineReader />}
        />

        {/* Editorial CMS */}
        <Route
          path="/editorial/login"
          element={<EditorialLogin />}
        />

        <Route
          path="/editorial"
          element={<EditorialCMS />}
        />

        <Route
          path="/editorial/new"
          element={<EditorialWorkspace />}
        />

        {/* Administration */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* Development and testing */}
        <Route
          path="/media-picker-test"
          element={<MediaPickerTest />}
        />

        <Route
          path="/cloudfront-test"
          element={<CloudFrontMediaTest />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
