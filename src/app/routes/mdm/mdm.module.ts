import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'angular2-datatable/index';
import { DropdownModule, CalendarModule, TabViewModule, RadioButtonModule, ListboxModule } from 'primeng/primeng';
import { TreeModule } from 'angular-tree-component';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { SharedModule } from 'app/shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MdmService } from './mdm.service';
import { MdmattrComponent } from './mdmattr/mdmattr.component';
import { MdmcategoryComponent } from './mdmcategory/mdmcategory.component';
import { MdmclassifyComponent } from './mdmclassify/mdmclassify/mdmclassify.component';
import { MdmclassifydetailComponent } from './mdmclassify/mdmclassifydetail/mdmclassifydetail.component';
const routes: Routes = [
  { path: 'mdmattr', component: MdmattrComponent, data: { 'title': 'MDM分类属性' } },
  { path: 'mdmcategory', component: MdmcategoryComponent, data: { 'title': 'MDM分类品名' } },
  {
    path: 'mdmclassify', component: MdmclassifyComponent, data: { 'title': 'MDM字典管理' },
    children: [{
      path: ':id', component: MdmclassifydetailComponent, data: { 'title': '字典管理详情' }
    }]
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    DropdownModule,
    TabViewModule,
    FormsModule,
    RadioButtonModule,
    TreeModule,
    ListboxModule
  ],
  exports: [RouterModule],
  declarations: [MdmattrComponent, MdmcategoryComponent, MdmclassifyComponent, MdmclassifydetailComponent],
  providers: [MdmService]

})
export class MdmModule { }
