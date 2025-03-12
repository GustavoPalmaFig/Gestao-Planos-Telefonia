import { Cliente } from "./cliente";
import { Plano } from "./plano";

export interface ClientePlano {
    id?: number;
    clienteId?: number;
    cliente?: Cliente;
    planoId?: number;
    plano?: Plano;
    createdAt?: Date;
    updatedAt?: Date;
}