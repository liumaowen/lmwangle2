import { PaymentapiService } from './paymentapi.service';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SelectModule } from 'ng2-select';
import { DropdownModule, CalendarModule } from 'primeng/primeng';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import { PaymentdetailComponent } from './paymentdetail/paymentdetail.component';
import { PayjihuaComponent } from './payjihua/payjihua.component';
// import { PaymentreportComponent } from './paymentreport/paymentreport.component';

const routes: Routes = [
  { path: 'payment', component: PaymentComponent, data: { 'title': '付款管理' } },
  //{ path: 'paymentreport', component: PaymentreportComponent, data: { 'title': '付款明细表' } },
  { path: 'payment/:id', component: PaymentdetailComponent, data: { 'title': '付款详情', customerid: '' } },
  { path: 'payjihua', component: PayjihuaComponent, data: { 'title': '付款计划' } },
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
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentComponent, PaymentdetailComponent, PayjihuaComponent,],//PaymentreportComponent
  providers: [PaymentapiService]
})
export class PaymentModule { }
