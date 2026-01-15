import { Suspense, lazy } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
import Shell from "./components/shell";
import { PWAProvider } from "./contexts/PWAContext";
import { OnlineStatus, UpdatePrompt, InstallPrompt } from "./components/pwa";
import "./App.css";

// Lazy load all page components for code splitting
const pages = {
  ProjectEntries: lazy(() => import("./components/project/entries")),
  EntryDetails: lazy(() => import("./components/project/entries/details")),
  ImeiEntries: lazy(() => import("./components/project/entries/imei_entries")),
  ModelEntries: lazy(() =>
    import("./components/project/entries/model_entries")
  ),
  CreateEditEntry: lazy(() => import("./components/project/create_edit_entry")),
  Customers: lazy(() => import("./components/project/customers")),
  CreateNewCustomer: lazy(() =>
    import("./components/project/create_edit_customer")
  ),
  // PWA handlers
  ShareHandler: lazy(() => import("./components/pwa/ShareHandler")),
  ProtocolHandler: lazy(() => import("./components/pwa/ProtocolHandler")),
};

// Loading fallback component
const PageLoader = () => (
  <Center h="100dvh">
    <Loader size="lg" color="violet" />
  </Center>
);

// Reusable lazy route wrapper with fade transition
const LazyRoute = ({ Component }) => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <div key={location.pathname} className="page-fade">
        <Component />
      </div>
    </Suspense>
  );
};

const App = () => {
  return (
    <PWAProvider>
      {/* PWA UI Components */}
      <OnlineStatus />
      <UpdatePrompt />
      <InstallPrompt />

      <Routes>
        <Route
          path="/"
          element={
            <Shell>
              <Outlet />
            </Shell>
          }
        >
          <Route
            index
            element={<LazyRoute Component={pages.ProjectEntries} />}
          />
          <Route
            path="imei"
            element={<LazyRoute Component={pages.ImeiEntries} />}
          />
          <Route
            path="models"
            element={<LazyRoute Component={pages.ModelEntries} />}
          />
          <Route
            path="entries/:id"
            element={<LazyRoute Component={pages.EntryDetails} />}
          />
          <Route
            path="entries/:id/edit"
            element={<LazyRoute Component={pages.CreateEditEntry} />}
          />
          <Route
            path="create"
            element={<LazyRoute Component={pages.CreateEditEntry} />}
          />
          <Route
            path="customers"
            element={<LazyRoute Component={pages.Customers} />}
          />
          <Route
            path="customers/new"
            element={<LazyRoute Component={pages.CreateNewCustomer} />}
          />
          {/* PWA Routes */}
          <Route
            path="share"
            element={<LazyRoute Component={pages.ShareHandler} />}
          />
          <Route
            path="protocol"
            element={<LazyRoute Component={pages.ProtocolHandler} />}
          />
        </Route>
      </Routes>
    </PWAProvider>
  );
};

export default App;
