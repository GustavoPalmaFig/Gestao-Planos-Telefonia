import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { Plano } from '../../models/plano';
import { PlanoService } from '../../services/plano.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexLegend
} from "ng-apexcharts";
import { LoadingService } from '../../services/loading.service';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    TooltipModule,
    NgApexchartsModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit{
  allPlanos: Plano[] = [];
  allClientes: Cliente[] = [];
  selectedPlanos: Plano[] = [];
  selectedClientes: Cliente[] = [];
  averageAssociatedPlanosClientes: number = 0;
  pieChart!: PieChartOptions;
  barChart!: BarChartOptions;

  months = ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  availableYears!: { label: string, value: number }[];
  selectedYears: number[] = [new Date().getFullYear()];
  
  constructor(private clienteService: ClienteService, private planoService: PlanoService, private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.show();
    forkJoin({
      planos: this.planoService.getAllPlanos(),
      clientes: this.clienteService.getAllClientes()
    }).subscribe(({ planos, clientes }) => {
      this.allPlanos = planos;
      this.allClientes = clientes;
      this.calculateAverageAssociatedPlanosClientes();
      this.getAvailableYears();
      this.onYearChange();
      this.loadingService.hide();
    });
  }

  calculateAverageAssociatedPlanosClientes() {
    const totalClientes = this.allClientes.length;
    const totalAssociatedPlanos = this.allClientes.reduce((acc, cliente) => acc + (cliente.clientesPlanos?.length ?? 0), 0);
    this.averageAssociatedPlanosClientes = (totalAssociatedPlanos / totalClientes) || 0;
  }

  navigate(address: string) {
    address && this.router.navigate([address]);
  }

  preparePieChartData() {
    const planoCounts = this.allPlanos.map(plano => {
      return {
        label: plano.nome,
        value: this.selectedClientes.filter(cliente => cliente.clientesPlanos?.some(cp => cp.planoId === plano.id)).length
      };
    });

    this.pieChart = {
      series: planoCounts.map(pc => pc.value),
      chart: {
        type: 'pie',
        height: 400,
        width: 400
      },
      labels: planoCounts.map(pc => pc.label),
      legend: {
        show: true,
        position: 'right',
        fontSize: '16px',
        fontFamily: 'Segoe UI',
        fontWeight: 600,
        labels: {
          useSeriesColors: true
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }

  prepareBarChartData() {
    const registeredClientesByDate: number[] = this.months.map((month, index) => {
      return this.selectedClientes.filter(c => c.createdAt && new Date(c.createdAt).getMonth() == index).length;
    });

    const commonStyle = this.getStyle();

    this.barChart = {
      series: [
        {
          name: 'Clientes Cadastrados',
          type: 'column',
          data: registeredClientesByDate,
          color: '#5897fb'
        }
      ],
      chart: {
        height: 350,
        type: 'line'
      },
      xaxis: {
        categories: this.months,
        labels: {
          style: commonStyle
        }
      },
      yaxis: [{
        labels: {
          style: commonStyle,
          formatter: (val: number) => val.toFixed(0)
        }
      }],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 5
        }
      },
      dataLabels: {
        enabled: true
      },
      
      tooltip: {
        shared: true,
        intersect: false
      }
    };
  }

  getStyle(): { colors: string, fontWeight: string, fontSize: string } {
    return {
      colors: '#fafafa',
      fontWeight: 'bold',
      fontSize: '14px'
    };
  }

  getAvailableYears() {
    const clienteYears = this.allClientes.map(c => c.createdAt && new Date(c.createdAt).getFullYear()) as number[];
    this.availableYears = [...new Set(clienteYears)].map(year => ({ label: year.toString(), value: year }));
  }

  onYearChange() {
    this.selectedClientes = this.allClientes.filter(c => c.createdAt && this.selectedYears.includes(new Date(c.createdAt).getFullYear()));
    this.preparePieChartData();
    this.prepareBarChartData();
  }

  checkIfBarHasData(): boolean {
    return this.barChart?.series?.some(series => series.data.some(d => typeof d === 'number' && d > 0));
  }
}
