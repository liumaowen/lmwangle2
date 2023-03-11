import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgComponent } from './org/org.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { DataTableModule } from 'angular2-datatable';
import { TabViewModule, DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { OrgdetailComponent } from './orgdetail/orgdetail.component';

const routes: Routes = [
  {
    path: '', component: OrgComponent, data: { 'title': '字典管理' },
    children: [{
      path: ':id', component: OrgdetailComponent,
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
    TabViewModule,
    DropdownModule,
    FormsModule,
    TreeModule
  ],
  declarations: [OrgComponent, OrgdetailComponent]
})
export class OrgModule { }
