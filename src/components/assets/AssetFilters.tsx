import React, { useEffect } from "react";
import { useAssetStore } from "../../stores/useAssetStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { Search, Filter, X } from "lucide-react";
import style from "./AssetFilters.module.css";

export const AssetFilters: React.FC = () => {
  const { filters, setFilters, clearFilters } = useAssetStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ q: e.target.value });
  };

  const handleCategoryChange = (val: string) => {
    setFilters({ category: val === filters.category ? undefined : val });
  };

  return (
    <div className={style.sidebar}>
      <div className={style.header}>
        <h3 className={style.title}>
          <Filter size={18} className={style.titleIcon} />
          Filtros
        </h3>
        {Object.keys(filters).length > 0 && (
          <button onClick={clearFilters} className={style.clearButton}>
            <X size={12} className={style.clearIcon} /> Limpar
          </button>
        )}
      </div>

      {/* Search */}
      <div className={style.filterGroup}>
        <label className={style.label}>Busca Livre</label>
        <div className={style.inputWrapper}>
          <Search className={style.searchIcon} size={16} />
          <input
            type="text"
            placeholder="Nome, modelo, série..."
            value={filters.q || ""}
            onChange={handleSearchChange}
            className={style.searchInput}
          />
        </div>
      </div>

      {/* Categories */}
      <div className={style.filterGroupWide}>
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

      {/* Year Range (Placeholder/Basic) */}
      <div className={style.filterGroupWide}>
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
          Mostrando resultados dinâmicos conforme seleção. Os ativos são
          atualizados em tempo real.
        </p>
      </div>
    </div>
  );
};
