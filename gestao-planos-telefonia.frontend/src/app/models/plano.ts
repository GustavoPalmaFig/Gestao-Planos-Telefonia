import { ClientePlano } from "./clientePlano";

export interface Plano {
    id?: string;
    nome?: string;
    cpf?: string;
    telefone?: string;
    email?: string;
    ClientesPlanos?: ClientePlano[];
}