import type { Order } from "./order.js";

export interface Client {
	id_client: number;
	client_name: string;
	client_email: string;
	client_password: string;
	address: string;
	created_at: Date;
	orders?: Order[];
}
