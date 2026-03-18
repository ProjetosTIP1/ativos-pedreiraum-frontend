import React, { useEffect } from "react";
import { useAssetStore } from "../../stores/useAssetStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
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
import style from "./AdminDashboard.module.css";

export const AdminDashboard: React.FC = () => {
  const { assets, fetchAssets } = useAssetStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssets();
    }
  }, [isAuthenticated, fetchAssets]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Mock metrics based on loaded assets
  const totalViews = assets.reduce((acc, curr) => acc + curr.view_count, 0);
  const availableAssets = assets.filter((a) => a.status === "AVAILABLE").length;

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
                <th className={style.tableTh} style={{ textAlign: "right" }}>
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
                          <img
                            src={
                              asset.main_image ||
                              asset.images?.find((img) => img.is_main)?.url ||
                              asset.images?.[0]?.url
                            }
                            alt={asset.name}
                            className={style.assetImage}
                          />
                        </div>
                        <div className={style.assetText}>
                          <span className={style.assetName}>{asset.name}</span>
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
                          asset.status === "AVAILABLE"
                            ? "success"
                            : asset.status === "SOLD"
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
                        <Eye size={12} className="mr-1" /> {asset.view_count}
                      </div>
                    </td>
                    <td className={style.tableTd}>
                      <div className={style.rowActions}>
                        <button
                          onClick={() => navigate(`/ativos/${asset.slug}`)}
                          className={style.actionButton}
                          title="Ver Público"
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/edit/${asset.id}`)}
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
                              useAssetStore.getState().deleteAsset(asset.id);
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
                      Nenhum ativo cadastrado até o momento.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Industrial Texture at bottom */}
      <div className={style.bottomDecorator}></div>
    </div>
  );
};
