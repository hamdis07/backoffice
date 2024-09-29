// import { Component, OnInit } from '@angular/core';
// import { ChartConfiguration, ChartType } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';
// import { CommonModule } from '@angular/common';
// import { NgChartsModule } from 'ng2-charts';
// import { DashboardService } from '../../services/dashboard.service';
// import { ChartsModule } from 'ng2-charts';

// @Component({
//   standalone: true,
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css'],
//   imports: [CommonModule, ChartsModule],
// })
// export class DashboardComponent implements OnInit {
//   totalRevenue: number = 0;
//   dailyVisits: number = 0;
//   conversionRate: number = 0;

//   // Chart configurations
//   ordersPerDayChartData: ChartConfiguration['data'] = {
//     labels: [],
//     datasets: [
//       {
//         label: 'Commandes par jour',
//         data: [],
//         fill: true,
//         borderColor: '#4caf50',
//         backgroundColor: 'rgba(76, 175, 80, 0.3)',
//       },
//     ],
//   };

//   mostSoldProductsChartData: ChartConfiguration['data'] = {
//     labels: [],
//     datasets: [
//       {
//         label: 'Produits les plus vendus',
//         data: [],
//         backgroundColor: '#ff5722',
//       },
//     ],
//   };

//   topCustomersChartData: ChartConfiguration['data'] = {
//     labels: [],
//     datasets: [
//       {
//         label: 'Meilleurs clients',
//         data: [],
//         backgroundColor: '#03a9f4',
//       },
//     ],
//   };

//   constructor(private dashboardService: DashboardService) {}

//   ngOnInit(): void {
//     this.loadStats();
//   }

//   loadStats() {
//     this.dashboardService.getStats().subscribe((data) => {
//       // Mettre à jour les statistiques
//       this.totalRevenue = data.totalRevenue;
//       this.dailyVisits = data.dailyVisits;
//       this.conversionRate = data.conversionRate;

//       // Mettre à jour les données des courbes
//       this.ordersPerDayChartData.labels = data.ordersPerDay.map((item: any) => item.date);
//       this.ordersPerDayChartData.datasets[0].data = data.ordersPerDay.map((item: any) => item.orders);

//       this.mostSoldProductsChartData.labels = data.mostSoldProducts.map((product: any) => product.nom);
//       this.mostSoldProductsChartData.datasets[0].data = data.mostSoldProducts.map((product: any) => product.commandes_count);

//       this.topCustomersChartData.labels = data.topCustomers.map((customer: any) => customer.name);
//       this.topCustomersChartData.datasets[0].data = data.topCustomers.map((customer: any) => customer.commandes_count);
//     });
//   }
// }
