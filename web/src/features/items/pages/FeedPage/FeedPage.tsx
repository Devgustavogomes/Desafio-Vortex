import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./FeedPage.module.css";
import { Button } from "../../../../components/ui/Button/Button";
import { Toast } from "../../../../components/ui/Toast/Toast";
import {
  ItemCard,
  type ItemStatus as UIItemStatus,
} from "../../../../components/ui/ItemCard/ItemCard";
import { getAllItems, createOrder } from "../../../../services/items.service";
import { useAuth } from "../../../../hooks/useAuth";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Pagination } from "../../../../components/ui/Pagination/Pagination";
import {
  type Item,
  ItemType,
  ItemCondition,
  ItemStatus,
  ItemCategory,
} from "../../../../types/items.types";

type FilterType = "all" | "sale" | "donation";
type FilterCategory = ItemCategory | "all";

const categoryLabels: Record<ItemCategory, string> = {
  [ItemCategory.BOOKS]: "Livros",
  [ItemCategory.ELECTRONICS]: "Eletrônicos",
  [ItemCategory.SCHOOL_SUPPLIES]: "Material Escolar",
  [ItemCategory.CLOTHING]: "Vestuário",
  [ItemCategory.SPORTS]: "Esportes",
  [ItemCategory.FURNITURE]: "Móveis",
  [ItemCategory.OTHER]: "Outros",
};

export function FeedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      if (newPage === 1) {
        prev.delete("page");
      } else {
        prev.set("page", String(newPage));
      }
      return prev;
    });
  };
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filter, setFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all");

  const fetchItems = async (targetPage = page) => {
    const cacheKey = `feed-items-${categoryFilter}-page${targetPage}`;
    try {
      setIsLoading(true);
      setError(null);
      const category = categoryFilter !== "all" ? (categoryFilter as ItemCategory) : undefined;
      const result = await getAllItems(category, targetPage);
      setItems(result.data);
      setTotalPages(result.meta.totalPages);
      setTotalItems(result.meta.total);
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch {
        /* localStorage cheio, ignora */
      }
    } catch (err) {
      console.error("Erro ao buscar os itens do feed:", err);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const result = JSON.parse(cached);
          setItems(result.data);
          setTotalPages(result.meta.totalPages);
          setTotalItems(result.meta.total);
          setError(null);
        } catch {
          setError(
            "Ocorreu um erro ao carregar os itens disponíveis. Tente novamente mais tarde.",
          );
        }
      } else {
        setError(
          "Ocorreu um erro ao carregar os itens disponíveis. Tente novamente mais tarde.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(page);
    
  }, [page, categoryFilter]);

  const handleBuyOrReserve = async (item: Item) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await createOrder(item.id);

      setItems(prevItems =>
        prevItems.map(i => i.id === item.id ? { ...i, status: ItemStatus.RESERVED } : i)
      );

      const actionText = item.type === ItemType.DONATION ? "reservado" : "comprado (simulação)";
      setToastMessage({
        text: `Item ${actionText} com sucesso!`,
        type: "success"
      });
    } catch (err) {
      console.error("Erro ao reservar item:", err);
      setToastMessage({
        text: "Não foi possível concluir a ação. Tente novamente.",
        type: "error"
      });
    }
  };

  const mapItemToUI = (item: Item) => {
    let mappedStatus: UIItemStatus = "Usado";
    const mappedCategory = categoryLabels[item.category] ?? item.category;

    if (item.status === ItemStatus.SELLED) {
      mappedStatus = item.type === ItemType.DONATION ? "Doado" : "Vendido";
    } else if (item.status === ItemStatus.RESERVED) {
      mappedStatus = "Reservado";
    } else if (item.type === ItemType.DONATION) {
      mappedStatus = "Doação";
    } else {
      mappedStatus = item.condition === ItemCondition.NEW ? "Novo" : "Usado";
    }

    let isBuyDisabled = false;
    let buyLabel = "Comprar";

    if (!user) {
      buyLabel = "Entrar para Comprar";
    } else if (item.owner === user.id) {
      isBuyDisabled = true;
      buyLabel = "Seu Item";
    } else if (item.status === ItemStatus.RESERVED || item.status === ItemStatus.SELLED) {
      isBuyDisabled = true;
      buyLabel = "Indisponível";
    } else if (item.type === ItemType.DONATION) {
      buyLabel = "Reservar";
    }

    return {
      id: item.id,
      title: item.name,
      category: mappedCategory,
      status: mappedStatus,
      imageUrl: item.imageUrl,
      price: item.type === ItemType.SALE ? item.price : undefined,
      isBuyDisabled,
      buyLabel,
      originalItem: item
    };
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesType =
        filter === "all" ||
        (filter === "sale" && item.type === ItemType.SALE) ||
        (filter === "donation" && item.type === ItemType.DONATION);
      return matchesType;
    });
  }, [items, filter]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleCategoryChange = (newCategory: FilterCategory) => {
    setCategoryFilter(newCategory);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={`${styles.loading} glass`}>
          <p>Carregando itens disponíveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={`${styles.error} glass`}>
          <p>{error}</p>
          <Button
            variant="primary"
            onClick={() => fetchItems()}
            style={{ marginTop: "1rem" }}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          variant={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      <header className={styles.header}>
        <h2>Marketplace</h2>
        <p className={styles.subtitle}>Encontre materiais e equipamentos da comunidade acadêmica.</p>
      </header>

      <div className={styles.filters}>
        <button
          className={`${styles.filterPill} ${filter === "all" ? styles.filterPillActive : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          Todos os Itens
        </button>
        <button
          className={`${styles.filterPill} ${filter === "sale" ? styles.filterPillActive : ""}`}
          onClick={() => handleFilterChange("sale")}
        >
          À Venda
        </button>
        <button
          className={`${styles.filterPill} ${filter === "donation" ? styles.filterPillActive : ""}`}
          onClick={() => handleFilterChange("donation")}
        >
          Para Doação
        </button>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterPill} ${categoryFilter === "all" ? styles.filterPillActive : ""}`}
          onClick={() => handleCategoryChange("all")}
        >
          Todas as Categorias
        </button>
        {(Object.entries(categoryLabels) as [ItemCategory, string][]).map(([value, label]) => (
          <button
            key={value}
            className={`${styles.filterPill} ${categoryFilter === value ? styles.filterPillActive : ""}`}
            onClick={() => handleCategoryChange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className={styles.itemCount}>
        {totalItems} {totalItems === 1 ? "item" : "itens"} no total
      </p>

      {filteredItems.length === 0 ? (
        <div className={`${styles.empty} glass`}>
          <h3>Nenhum item encontrado</h3>
          <p>
            Não há itens disponíveis para este filtro no momento.
            Volte mais tarde ou tente outro filtro.
          </p>
          {(filter !== "all" || categoryFilter !== "all") && (
            <Button
              variant="primary"
              onClick={() => {
                setFilter("all");
                setCategoryFilter("all");
                setPage(1);
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredItems.map((item) => {
            const uiProps = mapItemToUI(item);
            return (
              <ItemCard
                key={uiProps.id}
                title={uiProps.title}
                category={uiProps.category}
                status={uiProps.status}
                imageUrl={uiProps.imageUrl}
                price={uiProps.price}
                description={uiProps.originalItem.description}
                onDetailsClick={() => setSelectedItem(uiProps.originalItem)}
                onBuyClick={() => handleBuyOrReserve(uiProps.originalItem)}
                isBuyDisabled={uiProps.isBuyDisabled}
                buyLabel={uiProps.buyLabel}
              />
            );
          })}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.name}
          footer={
            <Button
              variant="primary"
              onClick={() => {
                handleBuyOrReserve(selectedItem);
                setSelectedItem(null);
              }}
              disabled={mapItemToUI(selectedItem).isBuyDisabled}
              style={{ opacity: mapItemToUI(selectedItem).isBuyDisabled ? 0.6 : 1, cursor: mapItemToUI(selectedItem).isBuyDisabled ? 'not-allowed' : 'pointer' }}
            >
              {mapItemToUI(selectedItem).buyLabel}
            </Button>
          }
        >
          {selectedItem.imageUrl ? (
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
            />
          ) : (
            <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <span>Sem imagem</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ padding: '0.25rem 0.5rem', background: 'var(--color-primary-light)', color: 'white', borderRadius: '4px', fontSize: '0.875rem' }}>
              {selectedItem.status === ItemStatus.SELLED ? 'Vendido' :
               selectedItem.status === ItemStatus.RESERVED ? 'Reservado' :
               selectedItem.type === ItemType.SALE ? 'À Venda' : 'Para Doação'}
            </span>
            <span style={{ padding: '0.25rem 0.5rem', background: 'var(--color-border)', color: 'var(--color-text)', borderRadius: '4px', fontSize: '0.875rem' }}>
              {selectedItem.condition === ItemCondition.NEW ? 'Novo' : 'Usado'}
            </span>
            {selectedItem.type === ItemType.SALE && (
              <span style={{ padding: '0.25rem 0.5rem', background: 'var(--color-surface-hover)', color: 'var(--color-text)', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedItem.price)}
              </span>
            )}
          </div>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Descrição</h4>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {selectedItem.description || "Nenhuma descrição fornecida."}
          </p>
        </Modal>
      )}
    </div>
  );
}
