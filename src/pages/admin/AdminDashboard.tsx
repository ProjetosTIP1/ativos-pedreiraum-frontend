import React, { useEffect } from "react";
import { useAssetStore } from "../../stores/useAssetStore";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { AssetImage } from "../../components/ui/AssetImage";
import {
  LayoutDashboard,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  TrendingUp,
  Eye,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
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
          <Button
            onClick={() => navigate("/admin/create")}
            className="flex items-center gap-2 italic"
          >
            <Plus size={18} /> Novo Ativo
          </Button>
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
          {/* Asset Table */}
          <div className={style.tableWrapper}>
            <div className={style.tableHeader}>
              <h2 className={style.tableTitle}>Gestão de Inventário</h2>
              <div className={style.tableCount}>
                Exibindo {assets.length} registros
              </div>
            </div>

            <div className={style.tableOverflow}>
              <table className={style.table}>
                <thead>
                  <tr className={style.tableHeadRow}>
                    <th className={style.tableTh}>Ativo</th>
                    <th className={style.tableTh}>Categoria</th>
                    <th className={style.tableTh}>Status</th>
                    <th className={style.tableTh}>Ano</th>
                    <th className={style.tableTh}>Views</th>
                    <th
                      className={style.tableTh}
                      style={{ textAlign: "right" }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className={style.tableBody}>
                  {assets.length > 0 ? (
                    assets.map((asset) => (
                      <tr key={asset.id} className={style.tableRow}>
                        <td className={style.tableTd}>
                          <div className={style.assetInfo}>
                            <div className={style.assetImageWrapper}>
                              <AssetImage
                                src={asset.images_metadata?.[0]?.url}
                                alt={asset.name}
                                className={style.assetImage}
                              />
                            </div>
                            <div className={style.assetText}>
                              <span className={style.assetName}>
                                {asset.name}
                              </span>
                              <span className={style.assetRef}>
                                Ref: {asset.serial_number}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className={style.tableTd}>
                          <span className={style.assetCategory}>
                            {asset.category}
                          </span>
                        </td>
                        <td className={style.tableTd}>
                          <Badge
                            variant={
                              asset.status === "DISPONÍVEL"
                                ? "success"
                                : asset.status === "VENDIDO"
                                  ? "error"
                                  : "warning"
                            }
                          >
                            {asset.status}
                          </Badge>
                        </td>
                        <td className={`${style.tableTd} ${style.assetYear}`}>
                          {asset.year}
                        </td>
                        <td className={style.tableTd}>
                          <div className={style.assetViews}>
                            <Eye size={12} className="mr-1" />{" "}
                            {asset.view_count}
                          </div>
                        </td>
                        <td className={style.tableTd}>
                          <div className={style.rowActions}>
                            <button
                              onClick={() => navigate(`/ativos/${asset.id}`)}
                              className={style.actionButton}
                              title="Ver Público"
                            >
                              <ExternalLink size={16} />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/admin/edit/${asset.id}`)
                              }
                              className={style.editButton}
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Excluir este ativo definitivamente?",
                                  )
                                ) {
                                  useAssetStore
                                    .getState()
                                    .deleteAsset(asset.id);
                                }
                              }}
                              className={style.deleteButton}
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className={style.emptyState}>
                        <p className={style.emptyStateText}>
                          Nenhum ativo encontrado com estes filtros.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Texture at bottom */}
      <div className={style.bottomDecorator}></div>
    </div>
  );
};
