import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../app/models/cliente';
import { ClienteService } from '../../app/services/cliente.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

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
    ToastModule
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ClientesComponent implements OnInit {
  allClientes: Cliente[] = [];
  clienteForm!: FormGroup;
  selectedClientes!: Cliente[] | null;
  
  isLoading: boolean = true;
  clienteFormDialog: boolean = false;
  submitted = false;

  constructor(private clienteService: ClienteService, private confirmationService: ConfirmationService,
    private messageService: MessageService, private fb: FormBuilder) {
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
          this.messageService.add({ severity: 'successo', summary: 'Successful', detail: 'Cliente Atualizado', life: 3000 });
        });
      }
      else {
        this.clienteService.createCliente(cliente).subscribe((newCliente) => {
          this.allClientes.push(newCliente);
          this.clienteFormDialog = false;
          this.messageService.add({ severity: 'successo', summary: 'Successful', detail: 'Cliente Criado', life: 3000 });
        });
      }
    }
  }

  deleteSelectedClientes(cliente?: Cliente) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o(s) cliente(s) selecionado(s)?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      const clientesToDelete = cliente ? [cliente] : this.selectedClientes || [];
      
      clientesToDelete.map(async cliente => {
        this.clienteService.deleteCliente(cliente.id!).subscribe(() => {
        this.allClientes = this.allClientes.filter(c => c.id !== cliente.id);
        });
      });

      this.selectedClientes = null;
      this.messageService.add({ severity: 'successo', summary: 'Successful', detail: 'Cliente(s) Deletedo(s)', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.clienteFormDialog = false;
    this.submitted = false;
  }
}