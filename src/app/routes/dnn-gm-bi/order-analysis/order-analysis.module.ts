import { ResolveService } from './../../../dnn/service/resolve.service';
import { WiskSharedsModule } from './../../../dnn/shared/wiskshared.module';
import { GmbiService } from './../gmbi.service';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { CalendarModule, AutoCompleteModule, GrowlModule } from 'primeng/primeng';
import { SharedModule } from './../../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdermonthComponent } from './ordermonth/ordermonth.component';
import { OrderdayComponent } from './orderday/orderday.component';
import { OrgdayComponent } from './orgday/orgday.component';
import { OrgmonthComponent } from './orgmonth/orgmonth.component';
import { UsermonthComponent } from './usermonth/usermonth.component';
import { UserdayComponent } from './userday/userday.component';

const routes: Routes = [
  { path: 'dnngmbi/orderanalysis/ordermonth', component: OrdermonthComponent ,data: {'title': '懒猫月销售进度表'}},
  { path: 'dnngmbi/orderanalysis/orderday', component: OrderdayComponent ,data: {'title': '懒猫日销售进度表'},canActivate: [ResolveService]},
  { path: 'dnngmbi/orderanalysis/orderorgday', component: OrgdayComponent ,data: {'title': '机构日销售进度表'},canActivate: [ResolveService]},
  { path: 'dnngmbi/orderanalysis/orderorgmonth', component: OrgmonthComponent ,data: {'title': '机构月销售进度表'},canActivate: [ResolveService]},
  { path: 'dnngmbi/orderanalysis/orderuserday', component: UserdayComponent ,data: {'title': '业务员日销售进度表'},canActivate: [ResolveService]},
  { path: 'dnngmbi/orderanalysis/orderusermonth', component: UsermonthComponent ,data: {'title': '业务员月销售进度表'},canActivate: [ResolveService]}
]

@NgModule({
  imports: [
    SharedModule,
    CalendarModule,
    AutoCompleteModule,
    SelectModule,
    RouterModule.forChild(routes),
    GrowlModule,
    AgGridModule.withComponents([]),
    WiskSharedsModule
  ],
  declarations: [OrdermonthComponent, OrderdayComponent, OrgdayComponent, OrgmonthComponent, UsermonthComponent, UserdayComponent],
  exports: [
        RouterModule
  ],
  providers:[
    GmbiService
  ]
})
export class OrderAnalysisModule { }
