import React, { useEffect } from "react";
import { useAssetStore } from "../../stores/useAssetStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { AssetStatus } from "../../schemas/entities";
import { Filter, X, ChevronDown } from "lucide-react";
import style from "./AdminAssetFilters.module.css";

export const AdminAssetFilters: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const { filters, setFilters, clearFilters } = useAssetStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryChange = (val: string) => {
    setFilters({ category: val === filters.category ? undefined : val });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as AssetStatus | "ALL";
    setFilters({ status: val === "ALL" ? undefined : val });
  };

  return (
    <div className={style.sidebar}>
      <div className={style.header}>
        <h3 className={style.title}>
          <Filter size={18} className={style.titleIcon} />
          Filtros de Gestão
        </h3>
        {(filters.category || filters.status || filters.min_year || filters.max_year) && (
          <button onClick={clearFilters} className={style.clearButton}>
            <X size={12} className={style.clearIcon} /> Limpar
          </button>
        )}
      </div>

      {/* Status Filter - Only for Admins or if we want users to see all their statuses */}
      <div className={style.filterGroup}>
        <label className={style.label}>Status do Ativo</label>
        <div className={style.selectWrapper}>
          <select 
            value={filters.status || "ALL"} 
            onChange={handleStatusChange}
            className={style.select}
          >
            <option value="ALL">Todos os Status</option>
            {AssetStatus.options.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className={style.selectIcon} />
        </div>
      </div>

      {/* Categories */}
      <div className={style.filterGroup}>
        <label className={style.label}>Categorias</label>
        <div className={style.categoryList}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.name)}
              className={`${style.categoryButton} ${
                filters.category === cat.name
                  ? style.categoryButtonActive
                  : style.categoryButtonInactive
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Year Range */}
      <div className={style.filterGroup}>
        <label className={style.label}>Ano de Fabricação</label>
        <div className={style.yearRange}>
          <input
            type="number"
            placeholder="De"
            value={filters.min_year || ""}
            onChange={(e) =>
              setFilters({ min_year: parseInt(e.target.value) || undefined })
            }
            className={style.yearInput}
          />
          <input
            type="number"
            placeholder="Até"
            value={filters.max_year || ""}
            onChange={(e) =>
              setFilters({ max_year: parseInt(e.target.value) || undefined })
            }
            className={style.yearInput}
          />
        </div>
      </div>

      <div className={style.footer}>
        <p className={style.footerText}>
          {isAdmin 
            ? "Visualizando inventário global do Grupo Pedreira Um Valemix."
            : "Visualizando apenas ativos sob sua responsabilidade."}
        </p>
      </div>
    </div>
  );
};
