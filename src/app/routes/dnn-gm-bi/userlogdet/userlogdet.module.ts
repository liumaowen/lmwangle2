import { WiskSharedsModule } from './../../../dnn/shared/wiskshared.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { SharedModule } from './../../../shared/shared.module';
import { GmbiService } from './../gmbi.service';
import { UserlogdetComponent } from './userlogdet.component';

const routes: Routes = [
  { path: 'userlogdet', component: UserlogdetComponent , data: {'title': '单据操作日志'}},
];

@NgModule({
  imports: [
    WiskSharedsModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule
  ],
  declarations: [UserlogdetComponent],
  exports: [
  ],
  providers: [
    GmbiService
  ]
})
export class UserlogdetModule { }
