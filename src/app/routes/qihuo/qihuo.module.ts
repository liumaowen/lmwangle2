import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QihuoComponent } from './qihuo/qihuo.component';
import { RouterModule, Routes } from '@angular/router';
import { QihuoService } from './qihuo.service';
import { QihuodetailComponent } from './qihuodetail/qihuodetail.component';
import { WiskSharedsModule } from '../../dnn/shared/wiskshared.module';
import { SharedModule } from '../../shared/shared.module';
import { DataTableModule } from 'angular2-datatable/index';
import { AgGridModule } from 'ag-grid-angular/main';
import { DropdownModule, MultiSelectModule } from 'primeng/primeng';
import { CalendarModule, RadioButtonModule, AutoCompleteModule } from 'primeng/primeng';
import { UserapiService } from '../../dnn/service/userapi.service';
import { TabViewModule } from 'primeng/primeng';
import { FlagPipe } from '../../dnn/shared/pipe/flag.pipe';
import { TranstypePipe } from '../../dnn/shared/pipe/transtype.pipe';
import { OrdertypePipe } from '../../dnn/shared/pipe/ordertype.pipe';
import { OrderpaytypePipe } from '../../dnn/shared/pipe/orderpaytype.pipe';
import { DingjindetComponent } from './dingjindet/dingjindet.component';
import { QihuojiedanhuizongComponent } from './qihuojiedanhuizong/qihuojiedanhuizong.component';
import { QihuoexecuteComponent } from './qihuoexecute/qihuoexecute.component';
import { ContactprojectComponent } from './contactproject/contactproject.component';
import { GongchengdetailComponent } from './gongchengdetail/gongchengdetail/gongchengdetail.component';
import { NoticewuliuyuanComponent } from 'app/dnn/shared/noticewuliuyuan/noticewuliuyuan.component';
import { ImporttiaohuobidComponent } from './importtiaohuobid/importtiaohuobid.component';
import { MessagesModule } from 'primeng/primeng';
import { CreategoodscodeComponent } from 'app/dnn/shared/creategoodscode/creategoodscode.component';
import { MdmService } from '../mdm/mdm.service';


const routes: Routes = [
  { path: 'qihuo', component: QihuoComponent, data: { 'title': '期货时序表' } },
  { path: 'qihuo/:id', component: QihuodetailComponent, data: { 'title': '期货详情' } },
  { path: 'dingjindet', component: DingjindetComponent, data: { 'title': '定金明细' } },
  { path: 'qihuojiedanhuizong', component: QihuojiedanhuizongComponent, data: { 'title': '期货接单汇总' } },
  { path: 'qihuoexecute', component: QihuoexecuteComponent, data: { 'title': '期货合同执行情况表' } },
  { path: 'gongchengdetail', component: GongchengdetailComponent, data: { 'title': '工程项目明细表' } },
];
@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    WiskSharedsModule,
    DropdownModule,
    RadioButtonModule,
    AutoCompleteModule,
    TabViewModule,
    MessagesModule,
    MultiSelectModule
  ],
  declarations: [QihuoComponent, QihuodetailComponent, DingjindetComponent,
    QihuojiedanhuizongComponent,
    QihuoexecuteComponent,
    ContactprojectComponent,
    GongchengdetailComponent,
    ImporttiaohuobidComponent
  ],
  exports: [
    RouterModule
  ],
  providers: [
    QihuoService,
    UserapiService,
    FlagPipe,
    OrdertypePipe,
    TranstypePipe,
    OrderpaytypePipe,
    MdmService
  ],
  entryComponents: [ContactprojectComponent, NoticewuliuyuanComponent, ImporttiaohuobidComponent, CreategoodscodeComponent]
})
export class QihuoModule { }
