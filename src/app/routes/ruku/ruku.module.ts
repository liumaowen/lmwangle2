import { RukucollectedetimportComponent } from './../../dnn/shared/rukucollectedetimport/rukucollectedetimport.component';
import { AgGridModule } from 'ag-grid-angular/main';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { CalendarModule, DropdownModule, TabViewModule } from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable';
import { SharedModule } from './../../shared/shared.module';
import { RukuService } from './ruku.service';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SelectModule } from 'ng2-select';
import { CommonModule } from '@angular/common';
import { RukuComponent } from './ruku/ruku.component';
import { RukudetailComponent } from './rukudetail/rukudetail.component';
import { RukudetreportComponent } from './rukudetreport/rukudetreport.component';
import { RukuCollectedetComponent } from './ruku-collectedet/ruku-collectedet.component';
import { NetmaterialrukuComponent } from './netmaterialruku/netmaterialruku.component';
import { ZaiturukuComponent } from './zaituruku/zaituruku.component';
import { ZaiturukudetailComponent } from './zaiturukudetail/zaiturukudetail.component';
import { ProductzhijianComponent } from './productzhijian/productzhijian.component';
import { WeishizhibaoComponent } from './weishizhibao/weishizhibao.component';

const routes: Routes = [
  { path: 'ruku', component: RukuComponent, data: { 'title': '入库管理' } },
  { path: 'netmaterialruku', component: NetmaterialrukuComponent, data: { 'title': '净料入库管理' } },
  { path: 'report/rukudetreport', component: RukudetreportComponent, data: { 'title': '入库明细表' } },
  { path: 'ruku/:id', component: RukudetailComponent, data: { 'title': '入库明细' } },
  { path: 'rukuCollectedet', component: RukuCollectedetComponent, data: { 'title': '入库汇总明细表' } },
  { path: 'zaituruku', component: ZaiturukuComponent, data: { 'title': '在途入库管理' } },
  { path: 'zaituruku/:id', component: ZaiturukudetailComponent, data: { 'title': '在途入库明细' } },
  { path: 'productzhijian', component: ProductzhijianComponent, data: { 'title': '产品质检反馈表' } },
  { path: 'weishizhibao', component: WeishizhibaoComponent, data: { 'title': '维实质保书' } },
];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    WiskSharedsModule,
    SelectModule,
    DropdownModule,
    TabViewModule
  ],
  declarations: [RukuComponent, RukudetailComponent, RukudetreportComponent, RukuCollectedetComponent,
    RukucollectedetimportComponent, NetmaterialrukuComponent, ZaiturukuComponent, ZaiturukudetailComponent, ProductzhijianComponent,WeishizhibaoComponent],
  exports: [
    RouterModule
  ],
  providers: [
    RukuService
  ],
  entryComponents: [RukucollectedetimportComponent]
})
export class RukuModule { }
