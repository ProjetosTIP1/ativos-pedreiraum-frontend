import React, { useEffect } from "react";
import { useAssetStore } from "../../stores/useAssetStore";
import { Button } from "../../components/ui/Button";
import {
  LayoutDashboard,
  Plus,
  CheckCircle,
  TrendingUp,
  Eye,
  MessageSquare,
  LayoutGrid,
  Users,
} from "lucide-react";
import { AdminAssetCard } from "../../components/admin/AdminAssetCard";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AdminAssetFilters } from "../../components/admin/AdminAssetFilters";
import style from "./AdminDashboard.module.css";

export const AdminDashboard: React.FC = () => {
  const { assets, fetchAssets, filters, setFilters } = useAssetStore();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // 1. Initial filter setup based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (isAdmin) {
        // Admins see everything by default
        setFilters({ user_id: undefined, status: undefined });
      } else {
        // Regular users only see their own assets
        setFilters({ user_id: user.id, status: undefined });
      }
    }
  }, [isAuthenticated, user, isAdmin, setFilters]);

  // 2. Reactive re-fetch whenever filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchAssets(filters);
    }
  }, [isAuthenticated, fetchAssets, filters]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Metrics based on currently loaded (filtered) assets
  const totalViews = assets.reduce((acc, curr) => acc + curr.view_count, 0);
  const availableAssets = assets.filter(
    (a) => a.status === "DISPONÍVEL",
  ).length;

  return (
    <div className={style.container}>
      {/* Header */}
      <div className={style.header}>
        <div>
          <span className={style.headerBadge}>Área Restrita</span>
          <h1 className={style.title}>
            <LayoutDashboard size={40} className={style.titleIcon} />
            Admin <span className={style.highlight}>Dashboard</span>
          </h1>
        </div>
        <div className={style.headerActions}>
          <div className={style.userInfo}>
            <p className={style.userInfoLabel}>Logado como</p>
            <p className={style.userName}>{user?.full_name}</p>
          </div>
          <div className={style.headerActionsButtons}>
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => navigate("/admin/users")}
                className={style.iconButton}
              >
                <Users size={18} /> Usuários
              </Button>
            )}
            <Button
              onClick={() => navigate("/admin/create")}
              className={`${style.iconButton} ${style.italicButton}`}
            >
              <Plus size={18} /> Novo Ativo
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={style.metricsGrid}>
        {[
          {
            label: "Total de Ativos",
            value: assets.length,
            icon: <TrendingUp size={24} />,
            color: "var(--color-info)",
          },
          {
            label: "Ativos Disponíveis",
            value: availableAssets,
            icon: <CheckCircle size={24} />,
            color: "var(--color-success)",
          },
          {
            label: "Total de Visualizações",
            value: totalViews,
            icon: <Eye size={24} />,
            color: "var(--color-industrial-orange)",
          },
          {
            label: "Interesses (WhatsApp)",
            value: Math.floor(totalViews * 0.1),
            icon: <MessageSquare size={24} />,
            color: "var(--color-industrial-yellow)",
          },
        ].map((metric, i) => (
          <div key={i} className={style.metricCard}>
            <div className={style.metricContent}>
              <p className={style.metricLabel}>{metric.label}</p>
              <p className={style.metricValue}>{metric.value}</p>
            </div>
            <div className={style.metricIcon}>{metric.icon}</div>
            <div className={style.metricProgressTrack}>
              <div
                className={style.metricProgressBar}
                style={{ width: "30%", backgroundColor: metric.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content with Sidebar */}
      <div className={style.mainContent}>
        <aside className={style.sidebarSection}>
          <AdminAssetFilters isAdmin={isAdmin} />
        </aside>

        <div className={style.tableSection}>
          <div className={style.listHeader}>
            <div className={style.listTitleGroup}>
              <LayoutGrid size={20} className={style.listIcon} />
              <h2 className={style.tableTitle}>Gestão de Inventário</h2>
            </div>
            <div className={style.tableCount}>
              Exibindo {assets.length} registros
            </div>
          </div>

          <div className={style.assetList}>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <AdminAssetCard
                  key={asset.id}
                  asset={asset}
                  onEdit={(id) => navigate(`/admin/edit/${id}`)}
                  onDelete={(id) => {
                    if (
                      window.confirm("Excluir este ativo definitivamente?")
                    ) {
                      useAssetStore.getState().deleteAsset(id);
                    }
                  }}
                  onView={(id) => navigate(`/ativos/${id}`)}
                />
              ))
            ) : (
              <div className={style.emptyState}>
                <p className={style.emptyStateText}>
                  Nenhum ativo encontrado com estes filtros.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Industrial Texture at bottom */}
      <div className={style.bottomDecorator}></div>
    </div>
  );
};
