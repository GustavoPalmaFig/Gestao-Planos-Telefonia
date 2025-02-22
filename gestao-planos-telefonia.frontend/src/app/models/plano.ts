import { ClientePlano } from "./clientePlano";

export interface Plano {
    id?: string;
    nome?: string;
    preco?: number;
    franquiaDados?: number;
    minutosLigacao?: number;
    clientesPlanos?: ClientePlano[];
}