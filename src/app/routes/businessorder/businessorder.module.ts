import { FormsModule } from '@angular/forms';
import { DropdownModule, MessagesModule, TabViewModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { BusinessorderapiService } from './businessorderapi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessorderComponent } from './businessorder/businessorder.component';
import { BusinessorderdetailComponent } from './businessorderdetail/businessorderdetail.component';
import { OverdraftComponent } from './overdraft/overdraft.component';
import { OverdraftdetailComponent } from './overdraftdetail/overdraftdetail.component';
import { OverdraftreportComponent } from './overdraftreport/overdraftreport.component';

const routes: Routes = [
  { path: 'businessorder', component: BusinessorderComponent, data: { 'title': '订单管理' } },
  { path: 'businessorder/:id', component: BusinessorderdetailComponent, data: { 'title': '订单明细' } },
  { path: 'overdraft', component: OverdraftComponent, data: { 'title': '欠款申请单管理' } },
  { path: 'overdraft/:id', component: OverdraftdetailComponent, data: { 'title': '欠款申请单详情' } },
  { path: 'overdraftreport', component: OverdraftreportComponent, data: { 'title': '欠款利息表' } }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    AgGridModule,
    DropdownModule,
    FormsModule,
    TabViewModule,
    MessagesModule
  ],
  exports: [RouterModule],
  declarations: [BusinessorderComponent, BusinessorderdetailComponent, OverdraftComponent, OverdraftdetailComponent, OverdraftreportComponent],
  providers: [BusinessorderapiService]
})
export class BusinessorderModule { }
