import { ClientePlano } from "./clientePlano";

export interface Cliente {
    id?: string;
    nome?: string;
    cpf?: string;
    telefone?: string;
    email?: string;
    clientesPlanos?: ClientePlano[];
}