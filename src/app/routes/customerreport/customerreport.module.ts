import { Routes, RouterModule } from '@angular/router';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerreportComponent } from './customerreport/customerreport.component';
import { CustomerchaoqiComponent } from './customerchaoqi/customerchaoqi.component';
import { SelectModule } from 'ng2-select';
import { CalendarModule, DropdownModule, DataTableModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { UserchandiComponent } from './userchandi/userchandi.component';
import { CustomerbehaviorComponent } from './customerbehavior/customerbehavior.component';
import { CustomerchangeComponent } from './customerchange/customerchange.component';

const routes: Routes = [
  { path: 'customerreport', component: CustomerreportComponent, data: { 'title': '客户信息' } },
  { path: 'customerchaoqi', component: CustomerchaoqiComponent, data: { 'title': '超期客户信息' } },
  { path: 'userchandi', component: UserchandiComponent, data: { 'title': '代理商' } },
  { path: 'customerbehavior', component: CustomerbehaviorComponent, data: { 'title': '线上客户行为分析表' } },
  { path: 'customerchange', component: CustomerchangeComponent, data: { 'title': '变更记录表' } },
];

@NgModule({
  imports: [ 
    CommonModule,
    CommonModule,
    AgGridModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents([]),
    SelectModule,
    CalendarModule,
    DropdownModule,
    DataTableModule,
    FormsModule
  ],
  declarations: [CustomerreportComponent,CustomerchaoqiComponent, UserchandiComponent, CustomerbehaviorComponent,CustomerchangeComponent]
})
export class CustomerreportModule { }
