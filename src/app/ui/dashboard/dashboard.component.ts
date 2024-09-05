import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartData, Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';

// Register the required controllers
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective]
})
export class DashboardComponent implements OnInit {
  public revenueChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y} units`;
            }
            return label;
          }
        }
      }
    }
  };
  public revenueChartLabels: string[] = [];
  public revenueChartType: 'bar' = 'bar';
  public revenueChartLegend = true;
  public revenueChartData: ChartData<'bar'> = {
    labels: this.revenueChartLabels,
    datasets: [{ data: [], label: 'Revenue' }]
  };

  public ordersChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y} orders`;
            }
            return label;
          }
        }
      }
    }
  };
  public ordersChartLabels: string[] = [];
  public ordersChartType: 'line' = 'line';
  public ordersChartLegend = true;
  public ordersChartData: ChartData<'line'> = {
    labels: this.ordersChartLabels,
    datasets: [{ data: [], label: 'Orders' }]
  };

  public productsChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed >= 0) {
              label += `${context.parsed} units`;
            }
            return label;
          }
        }
      }
    }
  };
  public productsChartLabels: string[] = [];
  public productsChartType: 'pie' = 'pie';
  public productsChartLegend = true;
  public productsChartData: ChartData<'pie'> = {
    labels: this.productsChartLabels,
    datasets: [{ data: [], label: 'Most Sold Products' }]
  };

  public customersChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed >= 0) {
              label += `${context.parsed} orders`;
            }
            return label;
          }
        }
      }
    }
  };
  public customersChartLabels: string[] = [];
  public customersChartType: 'doughnut' = 'doughnut';
  public customersChartLegend = true;
  public customersChartData: ChartData<'doughnut'> = {
    labels: this.customersChartLabels,
    datasets: [{ data: [], label: 'Top Customers' }]
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.fetchChartData();
  }

  fetchChartData(): void {
    this.dashboardService.getStats().subscribe(data => {
      // Update Revenue Chart
      this.revenueChartLabels = data.ordersPerDay.map((item: any) => item.date);
      this.revenueChartData.datasets[0].data = data.ordersPerDay.map((item: any) => item.revenue);

      // Update Orders Chart
      this.ordersChartLabels = data.ordersPerDay.map((item: any) => item.date);
      this.ordersChartData.datasets[0].data = data.ordersPerDay.map((item: any) => item.orders);

      // Update Products Chart
      this.productsChartLabels = data.mostSoldProducts.map((item: any) => item.nom_produit);
      this.productsChartData.datasets[0].data = data.mostSoldProducts.map((item: any) => item.commandes_count);

      // Update Customers Chart
      this.customersChartLabels = data.topCustomers.map((item: any) => item.nom);
      this.customersChartData.datasets[0].data = data.topCustomers.map((item: any) => item.commandes_count);
    }, error => {
      console.error('Error fetching chart data', error);
    });
  }
}
