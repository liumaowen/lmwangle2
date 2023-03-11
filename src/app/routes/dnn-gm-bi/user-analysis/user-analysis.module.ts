import { WiskSharedsModule } from './../../../dnn/shared/wiskshared.module';
import { ResolveService } from './../../../dnn/service/resolve.service';
import { NgModule } from '@angular/core';
import { UseroverviewComponent } from './useroverview/useroverview.component';
import { Routes, RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';

import { SharedModule } from './../../../shared/shared.module';
import { GmbiService } from './../gmbi.service';
import { UseractiveComponent } from './useractive/useractive.component';
import { SelectModule } from 'ng2-select';
import { UserdistrictComponent } from './userdistrict/userdistrict.component';

const routes: Routes = [
  { path: 'dnngmbi/useranalysis/useroverview', component: UseroverviewComponent ,data: {'title': '系统用户概览'}},
  { path: 'dnngmbi/useranalysis/useractive', component: UseractiveComponent ,data: {'title': '用户日访问量'}},
  { path: 'dnngmbi/useranalysis/userdistrict', component: UserdistrictComponent ,data: {'title': '访问地区及设备'}},
]

@NgModule({
  imports: [
    WiskSharedsModule,
    SharedModule,
    SelectModule,
    RouterModule.forChild(routes),
    AgGridModule
  ],
  declarations: [UseroverviewComponent, UseractiveComponent, UserdistrictComponent],
  exports: [
  ],
  providers:[
    GmbiService
  ]
})
export class UserAnalysisModule { }
