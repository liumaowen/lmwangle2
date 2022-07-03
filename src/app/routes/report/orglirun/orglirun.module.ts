import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { FileUploadModule } from 'ng2-file-upload';
import { DataTableModule } from 'angular2-datatable';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule } from 'primeng/primeng';
import { OrglirunComponent } from './orglirun.component';

const routes: Routes = [
  { path: 'orglirun', component: OrglirunComponent, data: { 'title': '机构实时创造利润表' } }
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    WiskSharedsModule,
    FileUploadModule,
    AgGridModule.withComponents([]),
    SelectModule,
    CommonModule,
    DataTableModule,
    DropdownModule
  ],
  declarations: [OrglirunComponent],
  exports: [
    RouterModule
  ]
})
export class OrglirunModule { }
