import type { SubCategory } from "./sub_category.js";
import type { Product } from "./product.js";

export interface Category {
	id_category: number;
	category_name: string;
	description: string;
	photo: string;
	subcategories?: SubCategory[];
	products?: Product[];
}
