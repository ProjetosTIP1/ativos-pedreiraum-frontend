import { useAppStore } from "../../../stores/useAppStore";
import { useRcisStore } from "../../../stores/useRcisStore";

import DateByRangePicker from "../../date-picker/DateRangePicker";
import SelectItemForm from "../../select-item-form/SelectItemForm";

import style from "./style.module.css";

export default function Filters() {
  const filters = useRcisStore((state) => state.filters);
  const setFilter = useRcisStore((state) => state.setFilter);
  const clearFilters = useRcisStore((state) => state.clearFilters);

  const unidades = useAppStore((state) => state.unidades);

  return (
    <div className={style.filtersContainer}>
      <h2 className={style.dashboardTitle}>Análise de RCIs | </h2>
      <DateByRangePicker
        onChange={(e) => {
          setFilter("periodo", { startDate: e.startDate, endDate: e.endDate });
        }}
        value={filters.periodo ?? { startDate: null, endDate: null }}
      />

      <div className={style.selectUnit}>
        <SelectItemForm
          placeholder="Selecione a unidade"
          items={unidades.map((u) => ({ id: u.id, descricao: u.sigla }))}
          value={
            filters.unidade
              ? {
                  id: filters.unidade.id,
                  descricao: unidades.find((u) => u.id === filters.unidade?.id)
                    ?.sigla,
                }
              : null
          }
          onChange={(item) => setFilter("unidade", item ? unidades.find((u) => u.id === item.id) ?? null : null)}
        />
      </div>

      <button
        onClick={() => setFilter("ativo", !filters.ativo)}
        className={`${style.checkActive} ${filters.ativo ? style.active : ""}`}
      >
        Ativos
      </button>
      <button onClick={clearFilters} className={style.clearFiltersButton}>
        Limpar
      </button>
    </div>
  );
}
