import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import ReaderDashboard from "./pages/ReaderDashboard.jsx";
import EditorialCMS from "./pages/EditorialCMS.jsx";
import EditorialWorkspace from "./components/editorial/EditorialWorkspace.jsx";
import EditorialLogin from "./pages/EditorialLogin.jsx";
import MediaPickerTest from "./pages/MediaPickerTest.jsx";
import CloudFrontMediaTest from "./pages/CloudFrontMediaTest.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/reader"
          element={<ReaderDashboard />}
        />
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
  <Route
    path="/media-picker-test"
    element={<MediaPickerTest />}
  />

<Route
  path="/cloudfront-test"
  element={<CloudFrontMediaTest />}
/>
      <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;