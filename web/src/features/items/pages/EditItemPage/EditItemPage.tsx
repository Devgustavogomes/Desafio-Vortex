import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ItemForm, type ItemFormData } from "../../components/ItemForm/ItemForm";
import { getItemById, updateItem } from "../../../../services/items.service";
import styles from "../NewItemPage/NewItemPage.module.css";
import type { Item } from "../../../../types/items.types";

export function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getItemById(id);
        setItem(data);
      } catch (err: any) {
        console.error(err);
        setError("Não foi possível carregar os dados do item.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (data: ItemFormData) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await updateItem(id, {
        name: data.name,
        description: data.description,
        price: data.price,
        type: data.type,
        condition: data.condition,
        category: data.category,
        status: data.status,
        imageUrl: data.imageUrl,
      });
      // Redirect to my items list upon success
      navigate("/my-items", {
        state: { successMessage: "Item atualizado com sucesso! ✅" },
      });
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Ocorreu um erro ao atualizar o item. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <p className={styles.subtitle}>Carregando dados do item...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <nav className={styles.breadcrumb}>
          <Link to="/my-items">Meus Itens</Link>
          <span>/</span>
          <span>Editar Anúncio</span>
        </nav>
        <h1 className={styles.title}>Editar Anúncio</h1>
        <p className={styles.subtitle}>
          Atualize as informações do seu item
        </p>
      </div>

      {error && (
        <div className={styles.errorMessage} role="alert">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {item && (
        <ItemForm
          initialData={item}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEdit
        />
      )}
    </div>
  );
}
