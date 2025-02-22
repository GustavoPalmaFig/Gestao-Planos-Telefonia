import { Cliente } from "./cliente";
import { Plano } from "./plano";

export interface ClientePlano {
    id?: string;
    clienteId?: string;
    cliente?: Cliente;
    planoId?: string;
    plano?: Plano;
}