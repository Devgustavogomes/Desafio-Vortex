import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ItemType,
  ItemCondition,
  ItemStatus,
  ItemCategory,
} from "../../../../types/items.types";
import styles from "./ItemForm.module.css";
import { useEffect } from "react";


const itemFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  price: z.number().positive("O preço deve ser maior que zero"),
  type: z.enum(ItemType, { message: "Tipo inválido" }),
  condition: z.enum(ItemCondition, { message: "Condição inválida" }),
  category: z.enum(ItemCategory, { message: "Categoria inválida" }),
  status: z.enum(ItemStatus).optional(),
  imageUrl: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .pipe(z.string().url("Deve ser uma URL válida (ex: https://...)").optional())
    .optional(),
});

export type ItemFormData = z.infer<typeof itemFormSchema>;

interface ItemFormProps {
  initialData?: Partial<ItemFormData>;
  onSubmit: (data: ItemFormData) => Promise<void>;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export function ItemForm({
  initialData,
  onSubmit,
  isSubmitting,
  isEdit,
}: ItemFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      type: ItemType.SALE,
      condition: ItemCondition.NEW,
      category: ItemCategory.OTHER,
      imageUrl: "",
      ...initialData,
    },
  });

  
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price,
        type: initialData.type || ItemType.SALE,
        condition: initialData.condition || ItemCondition.NEW,
        category: initialData.category || ItemCategory.OTHER,
        status: initialData.status,
        imageUrl: initialData.imageUrl || "",
      });
    }
  }, [initialData, reset]);

  return (
    <form
      className={styles.formCard}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {}
      <p className={styles.sectionLabel}>Informações básicas</p>

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Nome do Item <span className={styles.required}>*</span>
        </label>
        <input
          id="name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          placeholder="Ex: Bicicleta Caloi, Cadeira ergonômica..."
          disabled={isSubmitting}
          {...register("name")}
        />
        {errors.name && (
          <span className={styles.errorText}>⚠ {errors.name.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Descrição <span className={styles.required}>*</span>
        </label>
        <textarea
          id="description"
          className={`${styles.input} ${styles.textarea} ${
            errors.description ? styles.inputError : ""
          }`}
          placeholder="Descreva o estado, detalhes e outras informações relevantes..."
          disabled={isSubmitting}
          {...register("description")}
        />
        {errors.description && (
          <span className={styles.errorText}>
            ⚠ {errors.description.message}
          </span>
        )}
      </div>

      {}
      <p className={styles.sectionLabel}>Preço e imagem</p>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            Preço (R$) <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix}>R$</span>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              className={`${styles.input} ${styles.inputWithPrefix} ${
                errors.price ? styles.inputError : ""
              }`}
              placeholder="0,00"
              disabled={isSubmitting}
              {...register("price", { valueAsNumber: true })}
            />
          </div>
          {errors.price && (
            <span className={styles.errorText}>⚠ {errors.price.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imageUrl" className={styles.label}>
            URL da Imagem
            <span className={styles.optional}>(opcional)</span>
          </label>
          <input
            id="imageUrl"
            type="url"
            className={`${styles.input} ${
              errors.imageUrl ? styles.inputError : ""
            }`}
            placeholder="https://exemplo.com/foto.jpg"
            disabled={isSubmitting}
            {...register("imageUrl")}
          />
          {errors.imageUrl ? (
            <span className={styles.errorText}>
              ⚠ {errors.imageUrl.message}
            </span>
          ) : (
            <span className={styles.hintText}>
              Link direto para uma foto do item
            </span>
          )}
        </div>
      </div>

      {}
      <p className={styles.sectionLabel}>Classificação</p>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="type" className={styles.label}>
            Tipo de Anúncio <span className={styles.required}>*</span>
          </label>
          <select
            id="type"
            className={`${styles.input} ${styles.select} ${
              errors.type ? styles.inputError : ""
            }`}
            disabled={isSubmitting}
            {...register("type")}
          >
            <option value={ItemType.SALE}>🏷️ Venda</option>
            <option value={ItemType.DONATION}>🎁 Doação</option>
          </select>
          {errors.type && (
            <span className={styles.errorText}>⚠ {errors.type.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="condition" className={styles.label}>
            Condição <span className={styles.required}>*</span>
          </label>
          <select
            id="condition"
            className={`${styles.input} ${styles.select} ${
              errors.condition ? styles.inputError : ""
            }`}
            disabled={isSubmitting}
            {...register("condition")}
          >
            <option value={ItemCondition.NEW}>✨ Novo</option>
            <option value={ItemCondition.USED}>🔄 Usado</option>
          </select>
          {errors.condition && (
            <span className={styles.errorText}>
              ⚠ {errors.condition.message}
            </span>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category" className={styles.label}>
          Categoria <span className={styles.required}>*</span>
        </label>
        <select
          id="category"
          className={`${styles.input} ${styles.select} ${
            errors.category ? styles.inputError : ""
          }`}
          disabled={isSubmitting}
          {...register("category")}
        >
          <option value={ItemCategory.BOOKS}>📚 Livros</option>
          <option value={ItemCategory.ELECTRONICS}>💻 Eletrônicos</option>
          <option value={ItemCategory.SCHOOL_SUPPLIES}>✏️ Material Escolar</option>
          <option value={ItemCategory.CLOTHING}>👕 Vestuário</option>
          <option value={ItemCategory.SPORTS}>⚽ Esportes</option>
          <option value={ItemCategory.FURNITURE}>🪑 Móveis</option>
          <option value={ItemCategory.OTHER}>📦 Outros</option>
        </select>
        {errors.category && (
          <span className={styles.errorText}>⚠ {errors.category.message}</span>
        )}
      </div>

      {}
      {isEdit && (
        <div className={styles.statusSection}>
          <span className={styles.statusBadge}>✏ Modo edição</span>
          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label htmlFor="status" className={styles.label}>
              Status do Item
            </label>
            <select
              id="status"
              className={`${styles.input} ${styles.select}`}
              disabled={isSubmitting}
              {...register("status")}
            >
              <option value={ItemStatus.AVAILABLE}>🟢 Disponível</option>
              <option value={ItemStatus.RESERVED}>🟡 Reservado</option>
              <option value={ItemStatus.SELLED}>✅ Vendido / Doado</option>
            </select>
            {errors.status && (
              <span className={styles.errorText}>
                ⚠ {errors.status.message}
              </span>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        id="item-form-submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Salvando...
          </>
        ) : isEdit ? (
          "Salvar Alterações →"
        ) : (
          "Publicar Anúncio →"
        )}
      </button>
    </form>
  );
}
