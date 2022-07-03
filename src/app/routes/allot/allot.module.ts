import { KucundetimportComponent } from './../../dnn/shared/kucundetimport/kucundetimport.component';
import { DropdownModule } from 'primeng/primeng';
import { IsTranslatedPipe } from './../../dnn/shared/pipe/is-translated.pipe';
import { AllotapiService } from './allotapi.service';
import { AgGridModule } from 'ag-grid-angular/main';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllotComponent } from './allot/allot.component';
import { AllotdetreportComponent } from './allotdetreport/allotdetreport.component';
import { AllotdetailComponent } from './allotdetail/allotdetail.component';
import { TabViewModule } from 'primeng/primeng';
import { TihuorenComponent } from './allotdetail/tihuoren/tihuoren.component';
import { DataTableModule } from 'angular2-datatable';

const routes: Routes = [
  { path: 'allot', component: AllotComponent, data: { 'title': '调拨时序表' } },
  { path: 'allot/:id', component: AllotdetailComponent, data: { 'title': '调拨单' } },
  { path: 'allotdetreport', component: AllotdetreportComponent, data: { 'title': '调拨明细表' } },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    AgGridModule,
    DropdownModule,
    DataTableModule,
    TabViewModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AllotComponent, AllotdetreportComponent, AllotdetailComponent, KucundetimportComponent, TihuorenComponent],
  providers: [AllotapiService, IsTranslatedPipe],
  exports: [
    RouterModule
  ],
  entryComponents: [KucundetimportComponent, TihuorenComponent]
})
export class AllotModule { }
