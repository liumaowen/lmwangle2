import { ReceiveapiService } from './../receive/receiveapi.service';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { CustomerapiService } from './customerapi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer/customer.component';
import { TabViewModule, DropdownModule } from 'primeng/primeng';
import { CustomerdetailComponent } from './customerdetail/customerdetail.component';
import { CustomereditComponent } from './customeredit/customeredit.component';
import { CustomeraddressComponent } from './customeraddress/customeraddress.component';
import { CustomerbankaccountComponent } from './customerbankaccount/customerbankaccount.component';
import { CustomerusersComponent } from './customerusers/customerusers.component';
import { CustomermailaddressComponent } from './customermailaddress/customermailaddress.component';
import { CustomermoneyComponent } from './customermoney/customermoney.component';
import { CustomeryueComponent } from './customeryue/customeryue.component';
import { ZixinComponent } from './zixin/zixin.component';
import { CertmanagementComponent } from './certmanagement/certmanagement.component';

const routes: Routes = [
  { path: '', component: CustomerComponent, data: { 'title': '客户管理' } },
  {
    path: ':id', component: CustomerdetailComponent,
    children: [
      { path: '', redirectTo: 'edit' },
      { path: 'edit', component: CustomereditComponent, data: { 'title': '基本信息' } },
      { path: 'address', component: CustomeraddressComponent, data: { 'title': '送货地址' } },
      { path: 'bankaccount', component: CustomerbankaccountComponent, data: { 'title': '银行账户' } },
      { path: 'users', component: CustomerusersComponent, data: { 'title': '员工信息' } },
      { path: 'mailaddress', component: CustomermailaddressComponent, data: { 'title': '邮寄信息' } },
      { path: 'money', component: CustomermoneyComponent, data: { 'title': '账户信息' } },
      { path: 'yue', component: CustomeryueComponent, data: { 'title': '账户信息' } },
      { path: 'zixin', component: ZixinComponent, data: { 'title': '资信运营情况' } },
      { path: 'certmanagement', component: CertmanagementComponent, data: { 'title': '证件管理' } },
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
  ],
  declarations: [CustomerComponent,
    CustomerdetailComponent,
    CustomereditComponent,
    CustomeraddressComponent,
    CustomerbankaccountComponent,
    CustomerusersComponent,
    CustomermailaddressComponent,
    CustomermoneyComponent,
    CustomeryueComponent,
    ZixinComponent,
    CertmanagementComponent],
  providers: [CustomerapiService, ReceiveapiService]
})
export class CustomerModule { }
