import { DataTableModule } from 'angular2-datatable/index';
import { SelectModule } from 'ng2-select';
import { DropdownModule, CalendarModule } from 'primeng/primeng';
import { InnersaleapiService } from './innersaleapi.service';
import { AgGridModule } from 'ag-grid-angular/main';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnersaleComponent } from './innersale/innersale.component';
import { InnersaledetailComponent } from './innersaledetail/innersaledetail.component';
import { InnersaledetreportComponent } from './innersaledetreport/innersaledetreport.component';
import { QualityobjectionimportComponent } from './../../dnn/shared/qualityobjectionimport/qualityobjectionimport.component';

const routes: Routes = [
  { path: 'innersale', component: InnersaleComponent, data: { 'title': '内部采购单明细' } },
  { path: 'innersale/:id', component: InnersaledetailComponent, data: { 'title': '内部采购单明细' } },
  { path: 'innersaledetreport', component: InnersaledetreportComponent, data: { 'title': '内采明细表' } }
];

@NgModule({
  imports: [
    SharedModule,
    DropdownModule,
    CommonModule,
    CalendarModule,
    SelectModule,
    WiskSharedsModule,
    DataTableModule,
    AgGridModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InnersaleComponent, InnersaledetailComponent, InnersaledetreportComponent, QualityobjectionimportComponent],
  providers: [InnersaleapiService],
  entryComponents: [QualityobjectionimportComponent]
})
export class InnersaleModule { }
