import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QihuochangeComponent } from './qihuochange/qihuochange.component';
import { QihuochangedetailComponent } from './qihuochangedetail/qihuochangedetail.component';
import { QihuochangeService } from './qihuochange.service';
import { RouterModule, Routes } from '@angular/router';
import {
  TabViewModule, DropdownModule,
  DataTableModule
} from 'primeng/primeng';
import { SharedModule } from '../../shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { ToasterModule } from 'angular2-toaster';
import { QihuodetailimpComponent } from 'app/dnn/shared/qihuodetailimp/qihuodetailimp.component';
const routes: Routes = [
  { path: 'qihuochange', component: QihuochangeComponent, data: { 'title': '期货变更时序表' } },
  { path: 'qihuochange/:id', component: QihuochangedetailComponent, data: { 'title': '期货变更详情' } },
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    AgGridModule,
    TabViewModule,
    DropdownModule,
    FormsModule,
    ToasterModule
  ],
  declarations: [QihuochangeComponent, QihuochangedetailComponent, QihuodetailimpComponent],
  exports: [
    RouterModule
  ],
  providers: [
    QihuochangeService
  ],
  entryComponents: [
    QihuodetailimpComponent
  ]
})
export class QihuochangeModule { }
