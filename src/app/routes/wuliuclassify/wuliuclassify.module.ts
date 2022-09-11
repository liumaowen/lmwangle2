import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule, DropdownModule } from 'primeng/primeng';
import { TreeModule } from 'angular-tree-component';
import { WuliuclassifyComponent } from './wuliuclassify/wuliuclassify.component';
import { WuliuclassifydetailComponent } from './wuliuclassifydetail/wuliuclassifydetail.component';

const routes: Routes = [
  {
    path: '', component: WuliuclassifyComponent, data: { 'title': '产地公差字典' },
    children: [{
      path: ':id', component: WuliuclassifydetailComponent,
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
  declarations: [WuliuclassifyComponent,WuliuclassifydetailComponent]
})
export class WuliuclassifyModule { }
