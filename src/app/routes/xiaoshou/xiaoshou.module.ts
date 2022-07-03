import { RadioButtonModule } from 'primeng/primeng';
import { XsbuchaimportComponent } from './../../dnn/shared/xsbuchaimport/xsbuchaimport.component';
import { XsbuchaapiService } from './xsbuchaapi.service';
import { FormsModule } from '@angular/forms';
import { XiaoshouapiService } from './xiaoshouapi.service';
import { CalendarModule, DropdownModule, TabViewModule } from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LdtihuodetailComponent } from './ldtihuodetail/ldtihuodetail.component';
import { LdtihuoComponent } from './ldtihuo/ldtihuo.component';
import { OfflineComponent } from './offline/offline.component';
import { TihuoComponent } from './tihuo/tihuo.component';
import { TihuodetailComponent } from './tihuodetail/tihuodetail.component';
import { TihuodetComponent } from './tihuodet/tihuodet.component';
import { TihuodetreportComponent } from './tihuodetreport/tihuodetreport.component';
import { TihuodetcxreportComponent } from './tihuodetcxreport/tihuodetcxreport.component';
import { XstuihuoComponent } from './xstuihuo/xstuihuo.component';
import { XsbuchadetailComponent } from './xsbuchadetail/xsbuchadetail.component';
import { XstuihuodetailComponent } from './xstuihuodetail/xstuihuodetail.component';
import { XsbuchaComponent } from './xsbucha/xsbucha.component';
import { LdorderComponent } from './ldorder/ldorder.component';
import { UrgeComponent } from './urge/urge.component';
import { CangkutihuoComponent } from './cangkutihuo/cangkutihuo.component';
import { CangkutihuodetailComponent } from './cangkutihuodetail/cangkutihuodetail.component';
import { MatchcarService } from '../matchcar/matchcar.service';
import { YanqitihuoComponent2 } from './yanqitihuo/yanqitihuo.component';
import { WuliuorderimportComponent } from './offline/wuliuorderimport/wuliuorderimport.component';
import { WstihuodetreportComponent } from './wstihuodetreport/wstihuodetreport.component';
import { CangkuApiService } from '../cangku/cangkuapi.service';
import { ReleasedetComponent } from './releasedet/releasedet.component';
import { RoleapiService } from '../role/roleapi.service';

const routes: Routes = [
  { path: 'offline', component: OfflineComponent, data: { 'title': '线下发货', 'offline': true } },
  { path: 'tihuocreate', component: OfflineComponent, data: { 'title': '线上发货' } },
  { path: 'tihuo', component: TihuoComponent, data: { 'title': '销售提货单时序表' } },
  { path: 'tihuo/:id', component: TihuodetailComponent, data: { 'title': '销售提货单时序表' } },
  { path: 'tihuodet', component: TihuodetComponent, data: { 'title': '提货明细表' } },
  { path: 'tihuodetreport', component: TihuodetreportComponent, data: { 'title': '提单考核明细表' } },
  { path: 'tihuodetcxreport', component: TihuodetcxreportComponent, data: { 'title': '创新产品提单考核明细表' } },
  { path: 'xstuihuo', component: XstuihuoComponent, data: { 'title': '销售退货时序表' } },
  { path: 'xstuihuo/:id', component: XstuihuodetailComponent, data: { 'title': '销售退货明细' } },
  { path: 'xsbucha', component: XsbuchaComponent, data: { 'title': '销售补差时序表' } },
  { path: 'xsbucha/:id', component: XsbuchadetailComponent, data: { 'title': '销售补差明细' } },
  { path: 'ldtihuo', component: LdtihuoComponent, data: { 'title': '待临调货物列表' } },
  { path: 'ldtihuo/:id', component: LdtihuodetailComponent, data: { 'title': '临调提货单详情' } },
  { path: 'ldorder/:id', component: LdorderComponent, data: { 'title': '临调订单详情' } },
  { path: 'cangkutihuo', component: CangkutihuoComponent, data: { 'title': '仓库提货' } },
  { path: 'cangkutihuo/:id', component: CangkutihuodetailComponent, data: { 'title': '仓库提货明细' } },
  { path: 'urge', component: UrgeComponent, data: { 'title': '鼓励类销售汇总表' } },
  { path: 'yanqitihuo', component: YanqitihuoComponent2, data: { 'title': '延期提货明细表' } },
  { path: 'wstihuodetreport', component: WstihuodetreportComponent, data: { 'title': '维实成本核算表' } },
  { path: 'releasedet', component: ReleasedetComponent, data: { 'title': '释放货物明细表' } }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    DropdownModule,
    TabViewModule,
    FormsModule,
    RadioButtonModule
  ],
  declarations: [
    LdtihuodetailComponent,
    LdtihuoComponent,
    OfflineComponent,
    TihuoComponent,
    TihuodetailComponent,
    TihuodetComponent,
    TihuodetreportComponent,
    TihuodetcxreportComponent,
    XstuihuoComponent,
    XsbuchaComponent,
    XsbuchadetailComponent,
    XstuihuodetailComponent,
    XsbuchaimportComponent,
    LdorderComponent,
    UrgeComponent,
    CangkutihuoComponent,
    CangkutihuodetailComponent,
    YanqitihuoComponent2,
    WuliuorderimportComponent,
    WstihuodetreportComponent,
    ReleasedetComponent
  ],
  providers: [XiaoshouapiService, XsbuchaapiService, MatchcarService, CangkuApiService,RoleapiService],
  entryComponents: [XsbuchaimportComponent, WuliuorderimportComponent]
})
export class XiaoshouModule { }
