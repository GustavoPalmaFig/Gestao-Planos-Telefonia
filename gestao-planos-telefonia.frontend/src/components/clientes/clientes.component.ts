import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../app/models/cliente';
import { ClienteService } from '../../app/services/cliente.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MultiSelectModule,
    NgxMaskDirective
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  providers: [ConfirmationService, MessageService, provideNgxMask()]
})
export class ClientesComponent implements OnInit {
  allClientes: Cliente[] = [];
  clienteForm!: FormGroup;
  selectedClientes!: Cliente[] | null;
  searchValue: string | undefined;

  isLoading: boolean = true;
  clienteFormDialog: boolean = false;
  submitted = false;

  constructor(private clienteService: ClienteService, private confirmationService: ConfirmationService,
    private messageService: MessageService, private fb: FormBuilder, private primengConfig: PrimeNGConfig) {
      this.clienteForm = this.fb.group({
        id: [null],
        nome: ['', Validators.required],
        cpf: ['', Validators.required],
        telefone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        clientesPlanos: [[]]
      });
  }

  ngOnInit() {
    this.clienteService.getAllClientes().subscribe(clientes => {
      this.allClientes = clientes;
      this.isLoading = false;
    });

    this.primengConfig.setTranslation({
      emptyMessage: 'Nenhum registro encontrado',
      apply: 'Aplicar',
      clear: 'Limpar'
  });
  }

  openClienteFormDialog(cliente?: Cliente) {
    if (cliente) {
      this.clienteForm.patchValue(cliente);
    } else {
      this.clienteForm.reset();
    }
    this.clienteFormDialog = true;
  }

  saveCliente() {
    this.submitted = true;
    
    if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value as Cliente;

      if (!cliente.clientesPlanos) {
        cliente.clientesPlanos = [];
      }

      if (cliente.id) {
        this.clienteService.updateCliente(cliente).subscribe(() => {
          const index = this.allClientes.findIndex(c => c.id === cliente.id);
          this.allClientes[index] = cliente;
          this.clienteFormDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente Atualizado', life: 3000 });
        });
      }
      else {
        this.clienteService.createCliente(cliente).subscribe((newCliente) => {
          this.allClientes.push(newCliente);
          this.clienteFormDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente Criado', life: 3000 });
        });
      }
    }
  }

  deleteSelectedClientes(cliente?: Cliente) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o(s) cliente(s) selecionado(s)?',
      header: 'Confirmar',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      const clientesToDelete = cliente ? [cliente] : this.selectedClientes || [];
      
      clientesToDelete.map(async cliente => {
        this.clienteService.deleteCliente(cliente.id!).subscribe(() => {
        this.allClientes = this.allClientes.filter(c => c.id !== cliente.id);
        });
      });

      this.selectedClientes = null;
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente(s) Deletedo(s)', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.clienteFormDialog = false;
    this.submitted = false;
  }

  getFilterOptionsByField(field: keyof Cliente) {
    const options = this.allClientes.map(cliente => cliente[field]);
    return[...new Set(options)]
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }
}