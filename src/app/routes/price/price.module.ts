import { PriceapiService } from './priceapi.service';
import { DataTableModule } from 'angular2-datatable';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceComponent } from './price/price.component';
import { AgGridModule } from 'ag-grid-angular/main';
import { TabViewModule, DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PricelogComponent } from './pricelog/pricelog.component';
import { PricelogdateilComponent } from './pricelogdateil/pricelogdateil.component';

const routes: Routes = [
  { path: 'price', component: PriceComponent, data: { 'title': '价格表' } },
  { path: 'pricelog', component: PricelogComponent, data: { 'title': '价格表' } },
  { path: 'pricelogdet/:id', component: PricelogdateilComponent, data: { 'title': '差价调整记录明细' } },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    AgGridModule,
    TabViewModule,
    DropdownModule,
    FormsModule,
  ],
  declarations: [PriceComponent, PricelogComponent, PricelogdateilComponent],
  providers: [
    PriceapiService
  ]
})
export class PriceModule { }
