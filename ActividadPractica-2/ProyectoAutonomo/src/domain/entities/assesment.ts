import type { Product } from "./product.js";
import type { Client } from "./client.js";

export interface Assesment {
	id_assesment: number;
	rating: number;
	comment: string;
	id_product: number;
	id_client: number;
	product?: Product;
	client?: Client;
}
