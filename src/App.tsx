import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { LandingPage } from "./pages/landing/LandingPage";
import { AssetCatalog } from "./pages/catalog/AssetCatalog";
import { AssetDetails } from "./pages/asset/AssetDetails";
import { Login } from "./pages/login/Login";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AssetForm } from "./pages/new-asset/AssetForm";
import { useAuthStore } from "./stores/useAuthStore";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ativos" element={<AssetCatalog />} />
        <Route path="/ativos/:slug" element={<AssetDetails />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<AssetForm />} />
          <Route path="/admin/edit/:id" element={<AssetForm />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-black mb-4">404</h1>
              <p className="text-[var(--color-text-dim)] uppercase tracking-widest">
                Página não encontrada
              </p>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
