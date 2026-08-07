import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ItemForm, type ItemFormData } from "../../components/ItemForm/ItemForm";
import { createItem } from "../../../../services/items.service";
import styles from "./NewItemPage.module.css";

export function NewItemPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ItemFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createItem({
        name: data.name,
        description: data.description,
        price: data.price,
        type: data.type,
        condition: data.condition,
        category: data.category,
        imageUrl: data.imageUrl,
      });
      navigate("/my-items", {
        state: { successMessage: "Item anunciado com sucesso! 🎉" },
      });
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Ocorreu um erro ao anunciar o item. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <nav className={styles.breadcrumb}>
          <Link to="/my-items">Meus Itens</Link>
          <span>/</span>
          <span>Novo Anúncio</span>
        </nav>
        <h1 className={styles.title}>Novo Anúncio</h1>
        <p className={styles.subtitle}>
          Preencha os dados do item que deseja vender ou doar para a comunidade
          da UNIFOR.
        </p>
      </div>

      {error && (
        <div className={styles.errorMessage} role="alert">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <ItemForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
