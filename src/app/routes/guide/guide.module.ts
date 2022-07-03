import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideComponent } from './guide/guide.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { DataTableModule } from 'angular2-datatable';
import { TabViewModule, DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { GuideService } from './guide.service';
import { OrderapiService } from '../order/orderapi.service';
const routes: Routes = [
  { path: '', component: GuideComponent, data: { 'title': '引导页管理' }, }
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
  declarations: [GuideComponent],
  providers: [GuideService, OrderapiService]
})
export class GuideModule { }
