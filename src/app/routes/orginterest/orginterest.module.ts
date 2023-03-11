import { AgGridModule } from 'ag-grid-angular/main';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WiskSharedsModule } from '../../dnn/shared/wiskshared.module';
import { DataTableModule } from 'angular2-datatable';
import { DialogModule, TabViewModule } from 'primeng/primeng';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DropdownModule } from 'primeng/primeng';
import { OrginterestComponent } from './orginterest/orginterest.component';
import { OrginterestService } from './orginterest.service';

const routes: Routes = [
  { path: 'orginterest', component: OrginterestComponent, data: { 'title': '机构资金占用利息' } },
]

@NgModule({
  imports: [
    TabViewModule,
    SharedModule,
    CommonModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DialogModule,
    DropdownModule,
    DataTableModule,
    AgGridModule.withComponents([]),
  ],
  declarations: [OrginterestComponent],
  exports: [
    RouterModule
  ],
  providers: [
    OrginterestService
  ]
})
export class OrginterestModule { }
