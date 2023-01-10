import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule } from 'primeng/primeng';
import { IntercompanyComponent } from './intercompany.component';

const routes: Routes = [
  { path: 'intercompany', component: IntercompanyComponent , data: {'title': '内部公司交易明细表'}}
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    WiskSharedsModule,
    AgGridModule.withComponents([]),
    CommonModule,
    DropdownModule
  ],
  declarations: [IntercompanyComponent],
  exports: [
    RouterModule
  ]
})
export class IntercompanyModule { }
