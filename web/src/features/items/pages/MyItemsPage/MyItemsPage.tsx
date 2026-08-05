import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./MyItemsPage.module.css";
import { Button } from "../../../../components/ui/Button/Button";
import { Toast } from "../../../../components/ui/Toast/Toast";
import {
  ItemCard,
  type ItemStatus as UIItemStatus,
} from "../../../../components/ui/ItemCard/ItemCard";
import { getUserItems, deleteItem } from "../../../../services/items.service";
import {
  type Item,
  ItemType,
  ItemCondition,
  ItemStatus,
} from "../../../../types/items.types";

export function MyItemsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read success message passed via navigate state
  useEffect(() => {
    const state = location.state as { successMessage?: string } | null;
    if (state?.successMessage) {
      setToastMessage(state.successMessage);
      // Clear the navigate state to prevent showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUserItems();
      setItems(data);
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
    fetchItems();
  }, []);

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

  const mapItemToUI = (item: Item) => {
    let mappedStatus: UIItemStatus = "Usado";
    let mappedCategory = item.type === ItemType.DONATION ? "Doação" : "Venda";

    if (item.status === ItemStatus.RESERVED) {
      mappedStatus = "Reservado";
    } else if (item.type === ItemType.DONATION) {
      mappedStatus = "Doado";
    } else {
      mappedStatus = item.condition === ItemCondition.NEW ? "Novo" : "Usado";
    }

    return {
      id: item.id,
      title: item.name,
      category: mappedCategory,
      status: mappedStatus,
      imageUrl: item.imageUrl,
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
            onClick={fetchItems}
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
      {/* Toast notification */}
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
            UNIFOR.
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
                onEditClick={() => handleEdit(uiProps.id)}
                onDeleteClick={() => handleDelete(uiProps.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
