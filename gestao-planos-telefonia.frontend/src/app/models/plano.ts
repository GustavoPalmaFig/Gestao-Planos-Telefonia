import { ClientePlano } from "./clientePlano";

export interface Plano {
    id?: number;
    nome?: string;
    preco?: number;
    franquiaDados?: number;
    minutosLigacao?: number;
    clientesPlanos?: ClientePlano[];
    createdAt?: Date;
    updatedAt?: Date;
}