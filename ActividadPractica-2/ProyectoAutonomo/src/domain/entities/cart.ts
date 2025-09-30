import type { Product } from "./product.js";
import type { Inventory } from "./inventory.js";
import type { Client } from "./client.js";

export interface Cart {
	id_cart: number;
	id_client: number;
    status: string;
	id_product: number;
	quantity: number;
	product?: Product;
    inventory?: Inventory;
    client: Client;

}
