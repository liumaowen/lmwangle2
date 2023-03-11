import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassifyComponent } from './classify/classify.component';
import { ClassifydetailComponent } from './classifydetail/classifydetail.component';
import { TabViewModule, DropdownModule } from 'primeng/primeng';
import { TreeModule } from 'angular-tree-component';


const routes: Routes = [
  {
    path: '', component: ClassifyComponent, data: { 'title': '字典管理' },
    children: [{
      path: ':id', component: ClassifydetailComponent,
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
  declarations: [ClassifyComponent, ClassifydetailComponent]
})
export class ClassifyModule { }
