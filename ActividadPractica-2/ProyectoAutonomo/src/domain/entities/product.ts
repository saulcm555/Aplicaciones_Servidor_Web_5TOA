import type { Inventory } from "./inventory.js";
import type { Seller } from "./seller.js";
import type { Category } from "./category.js";
import type { SubCategory } from "./subcategory.js";

export interface Product {
	id_product: number;
	id_seller: number;
	id_inventory: number;
	id_category: number;
	id_sub_category: number;
	product_name: string;
	description: string;
	price: number;
	stock: number;
	image_url: string;
	created_at: Date;
	inventory?: Inventory;
	seller?: Seller;
	category?: Category;
	subcategory?: SubCategory;
}
