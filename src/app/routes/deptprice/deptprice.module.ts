import { DeptpriceapiService } from './deptpriceapi.service';
import { AgGridModule } from 'ag-grid-angular/main';
import { CalendarModule, DropdownModule } from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SelectModule } from 'ng2-select';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeptpriceComponent } from './deptprice/deptprice.component';
import { DeptpricedetComponent } from './deptpricedet/deptpricedet.component';

const routes: Routes = [
  { path: 'deptprice', component: DeptpriceComponent, data: { 'title': '价格表' } },
  { path: 'deptpricedet', component: DeptpricedetComponent, data: { 'title': '机构价格调整记录明细' } },
  { path: 'deptpricedet/:id', component: DeptpricedetComponent, data: { 'title': '机构价格调整记录明细' } }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SelectModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    DropdownModule
  ],
  declarations: [DeptpriceComponent, DeptpricedetComponent],
  providers: [DeptpriceapiService]
})
export class DeptpriceModule { }
