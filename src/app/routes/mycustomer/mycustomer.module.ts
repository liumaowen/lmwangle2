import { MycustomerapiService } from './mycustomerapi.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MycustomerComponent } from './mycustomer/mycustomer.component';
import { MycustomerdetailComponent } from './mycustomerdetail/mycustomerdetail.component';
import { MycustomereditComponent } from './mycustomeredit/mycustomeredit.component';
import { MycustomeraddressComponent } from './mycustomeraddress/mycustomeraddress.component';
import { MycustomerbankaccountComponent } from './mycustomerbankaccount/mycustomerbankaccount.component';
import { MycustomerusersComponent } from './mycustomerusers/mycustomerusers.component';
import { TabViewModule } from 'primeng/primeng';
import { CustomerchaoqiimportComponent } from '../../dnn/shared/customerchaoqiimport/customerchaoqiimport.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReportService } from '../report/report.service';

const routes: Routes = [
  { path: '', component: MycustomerComponent, data: { 'title': '客户管理' } },
  {
    path: ':id', component: MycustomerdetailComponent,
    children: [
      { path: '', redirectTo: 'edit' },
      { path: 'edit', component: MycustomereditComponent, data: { 'title': '基本信息' } },
      { path: 'address', component: MycustomeraddressComponent, data: { 'title': '送货地址' } },
      { path: 'bankaccount', component: MycustomerbankaccountComponent, data: { 'title': '银行账户' } },
      { path: 'users', component: MycustomerusersComponent, data: { 'title': '员工信息' } },
      // { path: 'mailaddress', component: CustomermailaddressComponent, data: { 'title': '邮寄信息' } },
      // { path: 'money', component: CustomermoneyComponent, data: { 'title': '账户信息' } },
      // { path: 'yue', component: CustomeryueComponent, data: { 'title': '账户信息' } },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    TabViewModule,
    DropdownModule,
    FormsModule,
    AgGridModule
  ],
  declarations: [MycustomerComponent, MycustomerdetailComponent, MycustomereditComponent, MycustomeraddressComponent, MycustomerbankaccountComponent,
     MycustomerusersComponent,CustomerchaoqiimportComponent],
  providers: [
    MycustomerapiService,ReportService
  ],
  entryComponents: [CustomerchaoqiimportComponent]
})
export class MycustomerModule { }
