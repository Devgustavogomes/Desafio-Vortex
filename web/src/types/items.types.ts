export const ItemType = {
  SALE: "sale",
  DONATION: "donation",
} as const;
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export const ItemCondition = {
  NEW: "NEW",
  USED: "USED",
} as const;
export type ItemCondition = (typeof ItemCondition)[keyof typeof ItemCondition];

export const ItemStatus = {
  AVAILABLE: "available",
  RESERVED: "reserved",
  SELLED: "selled",
} as const;
export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];

export const ItemCategory = {
  BOOKS: "books",
  ELECTRONICS: "electronics",
  SCHOOL_SUPPLIES: "school_supplies",
  CLOTHING: "clothing",
  SPORTS: "sports",
  FURNITURE: "furniture",
  OTHER: "other",
} as const;
export type ItemCategory = (typeof ItemCategory)[keyof typeof ItemCategory];

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ItemType;
  status: ItemStatus;
  condition: ItemCondition;
  category: ItemCategory;
  owner: string;
  imageUrl?: string;
}

export interface CreateItemInput {
  name: string;
  description: string;
  price: number;
  type: ItemType;
  condition: ItemCondition;
  category: ItemCategory;
  imageUrl?: string;
}

export interface UpdateItemInput {
  name?: string;
  description?: string;
  price?: number;
  type?: ItemType;
  status?: ItemStatus;
  condition?: ItemCondition;
  category?: ItemCategory;
  imageUrl?: string;
}
