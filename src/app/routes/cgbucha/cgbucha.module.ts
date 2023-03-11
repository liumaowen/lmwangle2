import { CgbuchaapiService } from './cgbuchaapi.service';
import { DropdownModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { CalendarModule } from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable';
import { RouterModule } from '@angular/router';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { SelectModule } from 'ng2-select';
import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CgbuchaComponent } from './cgbucha/cgbucha.component';
import { CgbuchadetreportComponent } from './cgbuchadetreport/cgbuchadetreport.component';
import { CgbuchadetailComponent } from './cgbuchadetail/cgbuchadetail.component';
import { CgbuchaimportComponent } from './../../dnn/shared/cgbuchaimport/cgbuchaimport.component';
import { CgbuchafanliimportComponent } from 'app/dnn/shared/cgbuchafanliimport/cgbuchafanliimport.component';

const routes: Routes = [
  { path: 'cgbucha', component: CgbuchaComponent, data: { 'title': '采购补差时序表' } },
  { path: 'report/cgbuchadetreport', component: CgbuchadetreportComponent, data: { 'title': '采购补差明细表' } },
  { path: 'cgbucha/:id', component: CgbuchadetailComponent, data: { 'title': '采购补差明细' } }
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
    CgbuchaComponent, CgbuchadetreportComponent, CgbuchadetailComponent, CgbuchaimportComponent,CgbuchafanliimportComponent
  ],
  providers: [CgbuchaapiService],
  entryComponents: [CgbuchaimportComponent,CgbuchafanliimportComponent]
})
export class CgbuchaModule { }
