import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SelectModule } from 'ng2-select';
import { DropdownModule, CalendarModule, DataTableModule } from 'primeng/primeng';
import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DingjinfanxiComponent } from './dingjinfanxi/dingjinfanxi.component';
import { YanqitihuoComponent } from './yanqitihuo/yanqitihuo.component';
import { ErpkaoheService } from './erpkaohe.service';
import { HtexecuteComponent } from './htexecute/htexecute.component';
import { FeejixiaoComponent } from './feejixiao/feejixiao.component';
import { LirunjixiaoComponent } from './lirunjixiao/lirunjixiao.component';
import { LirunkaoheComponent } from './lirunkaohe/lirunkaohe.component';
import { FundinterestsumComponent } from './fundinterestsum/fundinterestsum.component';
import { FundinterestsumdetComponent } from './fundinterestsum/fundinterestsumdet/fundinterestsumdet.component';
import { JixiaotemplateComponent } from './jixiaotemplate/jixiaotemplate.component';
import { DingjinshouxiComponent } from './dingjinshouxi/dingjinshouxi.component';

const routes: Routes = [
  { path: 'dingjinfanxi', component: DingjinfanxiComponent, data: { 'title': '定金反息' } },
  { path: 'dingjinshouxi', component: DingjinshouxiComponent, data: { 'title': '定金收息' } },
  { path: 'yanqitihuo', component: YanqitihuoComponent, data: { 'title': '延期提货' } },
  { path: 'htexecute', component: DingjinfanxiComponent, data: { 'title': '合同执行情况' } },
  { path: 'lirunjixiao', component: LirunjixiaoComponent, data: { 'title': '利润绩效' } },
  { path: 'feejixiao', component: FeejixiaoComponent, data: { 'title': '费用绩效' } },
  { path: 'lirunkaohe', component: LirunkaoheComponent, data: { 'title': '利润考核' } },
  { path: 'fundinterestsum', component: FundinterestsumComponent, data: { 'title': '资金占用利息收取表' } },
  { path: 'jixiaotemplate', component: JixiaotemplateComponent, data: { 'title': '绩效核算明细' } },
  { path: 'fundinterestsum/:id', component: FundinterestsumdetComponent, data: { 'title': '资金占用利息收取表详情' } },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    CalendarModule,
    SelectModule,
    WiskSharedsModule,
    DataTableModule,
    AgGridModule.withComponents([]),
    RouterModule.forChild(routes)
  ],
  declarations: [
    DingjinfanxiComponent,
    YanqitihuoComponent,
    HtexecuteComponent,
    FeejixiaoComponent,
    LirunjixiaoComponent,
    LirunkaoheComponent,
    FundinterestsumComponent,
    FundinterestsumdetComponent,
    JixiaotemplateComponent,
    DingjinshouxiComponent
  ],
  providers: [
    ErpkaoheService
  ]
})
export class ErpkaoheModule { }