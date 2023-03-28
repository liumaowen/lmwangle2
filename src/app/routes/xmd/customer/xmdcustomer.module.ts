import {FormsModule} from '@angular/forms';
import {DataTableModule} from 'angular2-datatable';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabViewModule, DropdownModule} from 'primeng/primeng';
import {XmdcustomerService} from './xmdcustomer.service';
import {XmdCustomerComponent} from './customer/xmdcustomer.component';
import {XmdCustomerdetailComponent} from './customer/detail/xmdcustomerdetail.component';
import {XmdCustomereditComponent} from './customer/edit/xmdcustomeredit.component';
import {SharedModule} from '../../../shared/shared.module';
import {WiskSharedsModule} from '../../../dnn/shared/wiskshared.module';
import {XMdCustomeraddressComponent} from './customer/address/xmdcustomeraddress.component';
import {XmdCustomerusersComponent} from './customer/users/xmdcustomerusers.component';
import {XmdcustomermailaddressComponent} from './customer/mailaddress/xmdcustomermailaddress.component';
import {XmdcustomermoneyComponent} from './customer/money/xmdcustomermoney.component';
import {XmdCustomeryueComponent} from './customer/yue/xmdcustomeryue.component';
import {XmdcustomerzixinComponent} from './customer/zixin/xmdcustomerzixin.component';
import {XmdCertmanagementComponent} from './customer/certmanagement/xmdcertmanagement.component';
import {XmdCustomerbankaccountComponent} from './customer/bankaccount/xmdcustomerbankaccount.component';
import {XmdreceiveapiService} from '../receive/xmdreceive.service';

const routes: Routes = [
  {path: '', component: XmdCustomerComponent, data: {'title': '新美达客户管理'}},
  {
    path: ':id', component: XmdCustomerdetailComponent,
    children: [
      {path: '', redirectTo: 'edit'},
      {path: 'edit', component: XmdCustomereditComponent, data: {'title': '基本信息'}},
      {path: 'address', component: XMdCustomeraddressComponent, data: {'title': '送货地址'}},
      {path: 'bankaccount', component: XmdCustomerbankaccountComponent, data: {'title': '银行账户'}},
      {path: 'users', component: XmdCustomerusersComponent, data: {'title': '员工信息'}},
      {path: 'mailaddress', component: XmdcustomermailaddressComponent, data: {'title': '邮寄信息'}},
      {path: 'money', component: XmdcustomermoneyComponent, data: {'title': '账户信息'}},
      {path: 'yue', component: XmdCustomeryueComponent, data: {'title': '账户信息'}},
      {path: 'zixin', component: XmdcustomerzixinComponent, data: {'title': '资信运营情况'}},
      {path: 'certmanagement', component: XmdCertmanagementComponent, data: {'title': '证件管理'}},
    ]
  }
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
  declarations: [XmdCustomerComponent,
    XmdCustomerdetailComponent,
    XmdCustomereditComponent,
    XMdCustomeraddressComponent,
    XmdCustomerbankaccountComponent,
    XmdCustomerusersComponent,
    XmdcustomermailaddressComponent,
    XmdcustomermoneyComponent,
    XmdCustomeryueComponent,
    XmdcustomerzixinComponent,
    XmdCertmanagementComponent,
  ],
  providers: [XmdcustomerService, XmdreceiveapiService]
})
export class XmdCustomerModule {
}
