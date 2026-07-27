export interface CreateItemInput {
  name: string;
  description: string;
  /** Valor float recebido da API (ex.: 10.99). Convertido para Price no use case. */
  price: number;
  /** Validado pelo Zod (Task 04) antes de chegar ao use case. */
  type: string;
}

export interface UpdateItemInput {
  name?: string;
  description?: string;
  /** Valor float recebido da API (ex.: 10.99). Convertido para Price no use case. */
  price?: number;
  /** Validado pelo Zod (Task 04) antes de chegar ao use case. */
  type?: string;
}
