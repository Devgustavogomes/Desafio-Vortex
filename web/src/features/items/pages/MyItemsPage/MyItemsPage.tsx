import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styles from "./MyItemsPage.module.css";
import { Button } from "../../../../components/ui/Button/Button";
import { Toast } from "../../../../components/ui/Toast/Toast";
import {
  ItemCard,
  type ItemStatus as UIItemStatus,
} from "../../../../components/ui/ItemCard/ItemCard";
import { Modal } from "../../../../components/ui/Modal/Modal";
import {
  getUserItems,
  deleteItem,
  getItemById,
} from "../../../../services/items.service";
import { Pagination } from "../../../../components/ui/Pagination/Pagination";
import {
  type Item,
  ItemType,
  ItemCondition,
  ItemStatus,
  ItemCategory,
} from "../../../../types/items.types";

export function MyItemsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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

  
  useEffect(() => {
    const state = location.state as { successMessage?: string } | null;
    if (state?.successMessage) {
      setToastMessage(state.successMessage);
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchItems = async (targetPage = page) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getUserItems(targetPage);
      setItems(result.data ?? []);
      setTotalPages(result.meta?.totalPages ?? 1);
    } catch (err) {
      console.error("Erro ao buscar os itens do usuário:", err);
      setError(
        "Ocorreu um erro ao carregar seus itens. Tente novamente mais tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(page);
    
  }, [page]);

  const handleEdit = (id: string) => {
    navigate(`/my-items/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
    );
    if (!confirmDelete) return;

    try {
      await deleteItem(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Erro ao deletar item:", err);
      alert("Não foi possível excluir o item. Tente novamente.");
    }
  };

  const handleAddNewItem = () => {
    navigate("/my-items/new");
  };

  const handleDetailsClick = async (id: string) => {
    try {
      const fetchedItem = await getItemById(id);
      setSelectedItem(fetchedItem);
    } catch (err) {
      console.error("Erro ao buscar detalhes do item:", err);
      alert("Não foi possível carregar os dados atualizados do item.");
    }
  };

  const categoryLabels: Record<ItemCategory, string> = {
    [ItemCategory.BOOKS]: "Livros",
    [ItemCategory.ELECTRONICS]: "Eletrônicos",
    [ItemCategory.SCHOOL_SUPPLIES]: "Material Escolar",
    [ItemCategory.CLOTHING]: "Vestuário",
    [ItemCategory.SPORTS]: "Esportes",
    [ItemCategory.FURNITURE]: "Móveis",
    [ItemCategory.OTHER]: "Outros",
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

    return {
      id: item.id,
      title: item.name,
      category: mappedCategory,
      status: mappedStatus,
      imageUrl: item.imageUrl,
      isAvailable: item.status === ItemStatus.AVAILABLE,
    };
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={`${styles.loading} glass`}>
          <p>Carregando seus itens...</p>
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
      {}
      {toastMessage && (
        <Toast
          message={toastMessage}
          variant="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <header className={styles.header}>
        <h2>Meus Itens</h2>
        <Button variant="primary" onClick={handleAddNewItem}>
          Adicionar Novo Item
        </Button>
      </header>

      {items.length === 0 ? (
        <div className={`${styles.empty} glass`}>
          <h3>Você ainda não possui itens cadastrados</h3>
          <p>
            Comece a compartilhar ou vender seus materiais com a comunidade da
            Unifor.
          </p>
          <Button variant="primary" onClick={handleAddNewItem}>
            Cadastrar Primeiro Item
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => {
            const uiProps = mapItemToUI(item);
            return (
              <ItemCard
                key={uiProps.id}
                title={uiProps.title}
                category={uiProps.category}
                status={uiProps.status}
                imageUrl={uiProps.imageUrl}
                description={item.description}
                onEditClick={
                  uiProps.isAvailable ? () => handleEdit(uiProps.id) : undefined
                }
                onDeleteClick={
                  uiProps.isAvailable
                    ? () => handleDelete(uiProps.id)
                    : undefined
                }
                onDetailsClick={() => handleDetailsClick(item.id)}
              />
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.name}
        >
          {selectedItem.imageUrl ? (
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "200px",
                background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                borderRadius: "8px",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
              }}
            >
              <span>Sem imagem</span>
            </div>
          )}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <span
              style={{
                padding: "0.25rem 0.5rem",
                background: "var(--color-primary-light)",
                color: "white",
                borderRadius: "4px",
                fontSize: "0.875rem",
              }}
            >
              {selectedItem.status === ItemStatus.SELLED
                ? "Vendido"
                : selectedItem.status === ItemStatus.RESERVED
                  ? "Reservado"
                  : selectedItem.type === ItemType.SALE
                    ? "À Venda"
                    : "Para Doação"}
            </span>
            <span
              style={{
                padding: "0.25rem 0.5rem",
                background: "var(--color-border)",
                color: "var(--color-text)",
                borderRadius: "4px",
                fontSize: "0.875rem",
              }}
            >
              {selectedItem.condition === ItemCondition.NEW ? "Novo" : "Usado"}
            </span>
            {selectedItem.type === ItemType.SALE && (
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  background: "var(--color-surface-hover)",
                  color: "var(--color-text)",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(selectedItem.price)}
              </span>
            )}
          </div>
          <h4 style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>
            Descrição
          </h4>
          <p
            style={{
              color: "var(--color-text-muted)",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {selectedItem.description || "Nenhuma descrição fornecida."}
          </p>
        </Modal>
      )}
    </div>
  );
}
