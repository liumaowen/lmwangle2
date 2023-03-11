import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanksmsComponent } from './banksms/banksms.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { DataTableModule } from 'angular2-datatable';
import { TabViewModule, DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { BanksmsapiService } from 'app/routes/banksms/banksmsapi.service';
import { AgGridModule, BaseComponentFactory } from 'ag-grid-angular/main';

const routes: Routes = [
  {
    path: '', component: BanksmsComponent, data: { 'title': '银行收支记录管理' }
  }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    TabViewModule,
    DropdownModule,
    AgGridModule,
    FormsModule,
    TreeModule
  ],
  declarations: [BanksmsComponent],
  providers: [BanksmsapiService, BaseComponentFactory]
})
export class BanksmsModule { }
