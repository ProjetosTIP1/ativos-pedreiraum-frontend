/**
 * Dashboard Component
 *
 * A pure presentation component that visualizes RCI analytics data.
 * Follows the Single Responsibility Principle - its only job is to
 * render charts, not to process or understand RCI business logic.
 *
 * This component receives pre-processed data from the analytics service,
 * demonstrating the Dependency Inversion Principle - it depends on
 * abstractions (the data interface) rather than concrete implementations.
 */

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { useRcisStore } from "../../stores/useRcisStore";
import {
  aggregateByStatus,
  aggregateByBranch,
  aggregateByRiskLevel,
  aggregateByDeadlineCompliance,
  calculateStatistics,
} from "../../services/RciAnalyticsService";

import style from "./style.module.css";
import DashboardFilters from "./dashboard-filters/DashboardFilters";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className = "" }: DashboardProps) {
  // Access the ALREADY FILTERED RCIs from the store
  // This respects the existing filter logic (period, status, branch, etc.)
  const filteredRcis = useRcisStore((state) => state.filteredRcis);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Process RCI data through our analytics service
  // These are pure function calls with no side effects
  const statusData = aggregateByStatus(filteredRcis);
  const branchData = aggregateByBranch(filteredRcis);
  const riskData = aggregateByRiskLevel(filteredRcis);
  const deadlineData = aggregateByDeadlineCompliance(filteredRcis);
  const stats = calculateStatistics(filteredRcis);

  // Chart.js configuration options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Smooth scroll to top when component mounts
  useEffect(() => {
    chartContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <div
      className={`${style.dashboardContainer} ${className}`}
      ref={chartContainerRef}
    >
      {/* Dashboard Filters Applied */}
      <DashboardFilters />
      {/* Empty State */}
      {filteredRcis.length === 0 ? (
        <div className={style.emptyState}>
          <p>Nenhum RCI encontrado com os filtros aplicados.</p>
          <p className={style.emptyStateSubtext}>
            Ajuste os filtros para visualizar os dados.
          </p>
        </div>
      ) : (
        <>
          {/* Statistics Summary Cards */}
          <div className={style.statsGrid}>
            <div className={style.statCard}>
              <div className={style.statValue}>{stats.total}</div>
              <div className={style.statLabel}>Total de RCIs</div>
            </div>
            <div className={`${style.statCard} ${style.statCardGreen}`}>
              <div className={style.statValue}>{stats.finalized}</div>
              <div className={style.statLabel}>Finalizados</div>
            </div>
            <div className={`${style.statCard} ${style.statCardBlue}`}>
              <div className={style.statValue}>{stats.open}</div>
              <div className={style.statLabel}>Abertos</div>
            </div>
            <div className={`${style.statCard} ${style.statCardBlue}`}>
              <div className={style.statValue}>{stats.inProgress}</div>
              <div className={style.statLabel}>Em Análise | Em Andamento</div>
            </div>
            {stats.rejected > 0 && (
              <div className={`${style.statCard} ${style.statCardGray}`}>
                <div className={style.statValue}>{stats.rejected}</div>
                <div className={style.statLabel}>Rejeitados</div>
              </div>
            )}
            <div className={`${style.statCard} ${style.statCardRed}`}>
              <div className={style.statValue}>{stats.overdue}</div>
              <div className={style.statLabel}>Total de RCIs com data limite ultrapassada</div>
            </div>
            <div className={`${style.statCard} ${style.statCardYellow}`}>
              <div className={style.statValue}>{stats.commitmentRate}</div>
              <div className={style.statLabel}>Taxa de Comprometimento</div>
              <div className={style.statLabel}>
                (finalizados + em análise + em andamento / total)
              </div>
            </div>
            <div className={`${style.statCard} ${style.statCardGreen}`}>
              <div className={style.statValue}>{stats.completionRate}</div>
              <div className={style.statLabel}>Taxa de Conclusão</div>
              <div className={style.statLabel}>(finalizados / total)</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className={style.chartsGrid}>
            {/* Status Chart */}
            <div className={style.chartCard}>
              <h3 className={style.chartTitle}>RCIs por Status</h3>
              <div className={style.chartWrapper}>
                <Bar data={statusData} options={barOptions} />
              </div>
            </div>

            {/* Branch Chart */}
            <div className={style.chartCard}>
              <h3 className={style.chartTitle}>RCIs por Unidade</h3>
              <div className={style.chartWrapper}>
                <Bar data={branchData} options={barOptions} />
              </div>
            </div>

            {/* Risk Level Chart */}
            <div className={style.chartCard}>
              <h3 className={style.chartTitle}>RCIs por Nível de Risco</h3>
              <div className={style.chartWrapper}>
                <Bar data={riskData} options={barOptions} />
              </div>
            </div>

            {/* Deadline Compliance Chart */}
            <div className={style.chartCard}>
              <h3 className={style.chartTitle}>Cumprimento de Prazos</h3>
              <div className={style.chartWrapper}>
                <Bar data={deadlineData} options={barOptions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
