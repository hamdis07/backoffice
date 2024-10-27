import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType, Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';

// Register the required chart components for Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective]
})
export class DashboardComponent implements OnInit {
  // Metrics
  totalRevenue: number = 0;
  dailyVisits: number = 0;
  conversionRate: number = 0;
  mostSoldProducts: any[] = [];
  topCustomers: any[] = [];

  // Chart configurations
  ordersPerDayChartData: ChartConfiguration<'line'>['data'] = { datasets: [] };
  ordersPerDayChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };

  // Most Sold Products chart
  mostSoldProductsChartData: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  mostSoldProductsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  // Top Customers chart
  topCustomersChartData: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  topCustomersChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe((data) => {
      // Assigning metrics from API response
      this.totalRevenue = data.totalRevenue;
      this.dailyVisits = data.dailyVisits;
      this.conversionRate = data.conversionRate;
      this.mostSoldProducts = data.mostSoldProducts;
      this.topCustomers = data.topCustomers;

      // Prepare data for Orders Per Day chart
      this.ordersPerDayChartData = {
        labels: data.ordersPerDay.map((order: any) => order.date),
        datasets: [
          {
            label: 'Orders per Day',
            data: data.ordersPerDay.map((order: any) => order.orders),
            fill: false,
            borderColor: '#42A5F5',
            tension: 0.4,  // Adds smooth lines
          }
        ]
      };

      // Prepare data for Most Sold Products chart
      this.mostSoldProductsChartData = {
        labels: this.mostSoldProducts.map((product: any) => product.nom_produit),
        datasets: [
          {
            label: 'Orders',
            data: this.mostSoldProducts.map((product: any) => product.commandes_count),
            backgroundColor: '#42A5F5'
          }
        ]
      };

      // Prepare data for Top Customers chart
      this.topCustomersChartData = {
        labels: this.topCustomers.map((customer: any) => `${customer.nom} ${customer.prenom}`),
        datasets: [
          {
            label: 'Orders',
            data: this.topCustomers.map((customer: any) => customer.commandes_count),
            backgroundColor: '#FF6384'
          }
        ]
      };
    });
  }
}
