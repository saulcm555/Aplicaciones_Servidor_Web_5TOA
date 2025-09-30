import type { Delivery } from "./delivery.js";

export interface Service {
    id_service: number;
    id_order: number;
    service_type: string;
    service_name: string;
    service_description: string;
    service_cost: number;
    delivery: Delivery;
    status: string;
    created_at: Date;
    updated_at: Date;
    rating: number;
}

