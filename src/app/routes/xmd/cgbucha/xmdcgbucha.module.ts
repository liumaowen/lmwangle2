import { DropdownModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { CalendarModule } from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable';
import { RouterModule } from '@angular/router';
import { SelectModule } from 'ng2-select';
import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmdCgbuchaComponent } from './xmdcgbucha/xmdcgbucha.component';
import { XmdCgbuchadetreportComponent } from './xmdcgbuchadetreport/xmdcgbuchadetreport.component';
import { XmdCgbuchadetailComponent } from './xmdcgbuchadetail/xmdcgbuchadetail.component';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { XmdCgbuchaapiService } from './xmdcgbuchaapi.service';
import { XmdCgbuchaimportComponent } from 'app/dnn/shared/xmdcgbuchaimport/xmdcgbuchaimport.component';

const routes: Routes = [
  { path: 'xmdcgbucha', component: XmdCgbuchaComponent, data: { 'title': '采购补差时序表' } },
//   { path: 'report/xmdcgbuchadetreport', component: XmdCgbuchadetreportComponent, data: { 'title': '采购补差明细表' } },
  { path: 'xmdcgbucha/:id', component: XmdCgbuchadetailComponent, data: { 'title': '采购补差明细' } }
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
  declarations: [
    XmdCgbuchaComponent, XmdCgbuchadetreportComponent, XmdCgbuchadetailComponent, XmdCgbuchaimportComponent
  ],
  providers: [XmdCgbuchaapiService],
  entryComponents: [XmdCgbuchaimportComponent]
})
export class XmdCgbuchaModule { }
