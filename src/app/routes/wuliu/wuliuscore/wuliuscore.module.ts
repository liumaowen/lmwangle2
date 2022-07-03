import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { SelectModule } from 'ng2-select';
import { DropdownModule, CalendarModule, MultiSelectModule } from 'primeng/primeng';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WuliuscoreapiService } from './wuliuscoreapi.service';
import { WuliuscoreComponent } from './wuliuscore.component';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { TransportfenxiComponent } from '../transportfenxi/transportfenxi.component';
import { WuliusupplierComponent } from '../wuliusupplier/wuliusupplier.component';

const routes: Routes = [
  { path: 'wuliuscore', component: WuliuscoreComponent, data: { 'title': '物流评价表' } },
  { path: 'transportfenxi', component: TransportfenxiComponent, data: { 'title': '物流运输分析表' } },
  { path: 'wuliusupplier', component: WuliusupplierComponent, data: { 'title': '物流供应商名录' } }
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    CalendarModule,
    SelectModule,
    WiskSharedsModule,
    DataTableModule,
    AgGridModule,
    MultiSelectModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WuliuscoreComponent, TransportfenxiComponent, WuliusupplierComponent],
  providers: [
    WuliuscoreapiService
  ]
})
export class WuliuscoreModule { }
