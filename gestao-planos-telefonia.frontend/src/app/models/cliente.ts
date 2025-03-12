import { ClientePlano } from "./clientePlano";

export interface Cliente {
    id?: number;
    nome?: string;
    cpf?: string;
    telefone?: string;
    email?: string;
    clientesPlanos?: ClientePlano[];
    createdAt?: Date;
    updatedAt?: Date;
}