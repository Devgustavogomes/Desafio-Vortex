import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ItemType,
  ItemCondition,
  ItemStatus,
} from "../../../../types/items.types";
import styles from "./ItemForm.module.css";
import { useEffect } from "react";

// Matches backend validation
const itemFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  price: z.number().positive("O preço deve ser maior que zero"),
  type: z.enum(ItemType, { message: "Tipo inválido" }),
  condition: z.enum(ItemCondition, { message: "Condição inválida" }),
  status: z.enum(ItemStatus).optional(),
  imageUrl: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine((val) => !val || /^https?:\/\//.test(val), {
      message: "Deve ser uma URL válida",
    }),
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
      imageUrl: "",
      ...initialData,
    },
  });

  // Update default values when initialData changes (useful for edit page fetching data asynchronously)
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price,
        type: initialData.type || ItemType.SALE,
        condition: initialData.condition || ItemCondition.NEW,
        status: initialData.status,
        imageUrl: initialData.imageUrl || "",
      });
    }
  }, [initialData, reset]);

  return (
    <form
      className={styles.formContainer}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Nome do Item *
        </label>
        <input
          id="name"
          type="text"
          className={styles.input}
          placeholder="Ex: Bicicleta Caloi"
          disabled={isSubmitting}
          {...register("name")}
        />
        {errors.name && (
          <span className={styles.errorText}>{errors.name.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Descrição *
        </label>
        <textarea
          id="description"
          className={`${styles.input} ${styles.textarea}`}
          placeholder="Descreva os detalhes do item..."
          disabled={isSubmitting}
          {...register("description")}
        />
        {errors.description && (
          <span className={styles.errorText}>{errors.description.message}</span>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            Preço (R$) *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            className={styles.input}
            placeholder="0.00"
            disabled={isSubmitting}
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <span className={styles.errorText}>{errors.price.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imageUrl" className={styles.label}>
            URL da Imagem
          </label>
          <input
            id="imageUrl"
            type="url"
            className={styles.input}
            placeholder="https://..."
            disabled={isSubmitting}
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <span className={styles.errorText}>{errors.imageUrl.message}</span>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="type" className={styles.label}>
            Tipo de Anúncio *
          </label>
          <select
            id="type"
            className={`${styles.input} ${styles.select}`}
            disabled={isSubmitting}
            {...register("type")}
          >
            <option value={ItemType.SALE}>Venda</option>
            <option value={ItemType.DONATION}>Doação</option>
          </select>
          {errors.type && (
            <span className={styles.errorText}>{errors.type.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="condition" className={styles.label}>
            Condição *
          </label>
          <select
            id="condition"
            className={`${styles.input} ${styles.select}`}
            disabled={isSubmitting}
            {...register("condition")}
          >
            <option value={ItemCondition.NEW}>Novo</option>
            <option value={ItemCondition.USED}>Usado</option>
          </select>
          {errors.condition && (
            <span className={styles.errorText}>{errors.condition.message}</span>
          )}
        </div>
      </div>

      {isEdit && (
        <div className={styles.formGroup}>
          <label htmlFor="status" className={styles.label}>
            Status do Item
          </label>
          <select
            id="status"
            className={`${styles.input} ${styles.select}`}
            disabled={isSubmitting}
            {...register("status")}
          >
            <option value={ItemStatus.AVAILABLE}>Disponível</option>
            <option value={ItemStatus.RESERVED}>Reservado</option>
            <option value={ItemStatus.SELLED}>Vendido / Doado</option>
          </select>
          {errors.status && (
            <span className={styles.errorText}>{errors.status.message}</span>
          )}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Salvando...
          </>
        ) : isEdit ? (
          "Salvar Alterações"
        ) : (
          "Anunciar Item"
        )}
      </button>
    </form>
  );
}
