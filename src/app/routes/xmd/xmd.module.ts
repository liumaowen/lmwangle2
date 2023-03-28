import {Routes, RouterModule} from '@angular/router';
import {WiskSharedsModule} from '../../dnn/shared/wiskshared.module';
import {SharedModule} from '../../shared/shared.module';
import {AgGridModule} from 'ag-grid-angular/main';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectModule} from 'ng2-select';
import {CalendarModule, DropdownModule, MessagesModule, TabViewModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {XmdOrderComponent} from './order/xmdorder.component';
import {DataTableModule} from 'angular2-datatable';
import {XmdorderService} from './order/xmdorder.service';
import {XmdorderdetailComponent} from './order/detail/xmdorderdetail.component';
import {XmdGoodscodeComponent} from './goodscode/xmdgoodscode.component';
import {XmdGoodscodeService} from './goodscode/xmdgoodscode.service';
import {XmdDingjinfanxiComponent} from './dingjinfanxi/xmddingjinfanxi.component';
import {XmdService} from './xmd.service';
import {XmdQihuoModule} from './qihuo/xmdqihuo.module';
import {XmdCaigouService} from './caigou/xmdcaigou.service';
import {XmdCaigouComponent} from './caigou/xmdcaigou.component';
import {XmdCaigoudetComponent} from './caigou/detail/xmdcaigoudet.component';
import {XmdCaigoudetimportComponent} from './caigou/import/xmdcaigoudetimport.component';
import {XmdcustomerService} from './customer/xmdcustomer.service';
import {XmdMycustomerComponent} from './customer/mycustomer/xmdmycustomer.component';
import {XmddingjinshouxiModule} from './dingjinshouxi/xmddingjinshouxi.module';
import {XmdOrderdetreportComponent} from './orderdetreport/xmdorderdetreport.component';
import {XmdreceiveModule} from './receive/xmdreceive.module';
import {XmdBusinessorderapiService} from './order/xmdbusinessorderapi.service';
import {XmdOfflineComponent} from './tihuo/offline/xmdoffline.component';
import {XmdtihuoService} from './tihuo/xmdtihuo.service';
import {XmdrukuModule} from './ruku/xmdruku.module';
import {XmdkucundetailComponent} from './kucundetail/xmdkucundetail.component';
import {XmdoverdraftdetreportModule} from './overdraftdetreport/xmdoverdraftdetreport.module';
import {XmdfeeModule} from './fee/xmdfee.module';
import {XmderpkaoheService} from './erpkaohe/xmderpkaohe.service';
import {XmdTihuoComponent} from './tihuo/tihuo/xmdtihuo.component';
import {XmdTihuodetailComponent} from './tihuo/tihuodetail/xmdtihuodetail.component';
import { XmdCgbuchaModule } from './cgbucha/xmdcgbucha.module';
const routes: Routes = [
  {path: 'xmdxianhuo', component: XmdOrderComponent, data: {'title': '新美达现货时序表'}},
  {path: 'xmdorderdet/:id', component: XmdorderdetailComponent, data: {'title': '新美达订单明细'}},
  {path: 'xmdmycustomer', component: XmdMycustomerComponent, data: {'title': '我的客户-新美达'}},
  {path: 'xmdgc', component: XmdGoodscodeComponent, data: {'title': '新美达物料明细'}},
  {path: 'xmddjfx', component: XmdDingjinfanxiComponent, data: {'title': '定金返息明细表'}},
  {path: 'xmdcaigou', component: XmdCaigouComponent, data: {'title': '采购明细表'}},
  {path: 'xmdcaigou/:id', component: XmdCaigoudetComponent, data: {'title': '采购详情'}},
  {path: 'xmdorderdetreport', component: XmdOrderdetreportComponent, data: {'title': '新美达订单明细表'}},
  {path: 'xmdoffline', component: XmdOfflineComponent, data: {'title': '线下发货'}},
  {path: 'xmdkucun', component: XmdkucundetailComponent, data: {'title': '新美达库存明细表'}},
  {path: 'xmdtihuo', component: XmdTihuoComponent, data: {'title': '提货单时序表'}},
  {path: 'xmdtihuo/:id', component: XmdTihuodetailComponent, data: {'title': '提货单'}},
];

@NgModule({
  imports: [
    CommonModule,
    AgGridModule,
    AgGridModule.withComponents([]),
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    SelectModule,
    CalendarModule,
    DropdownModule,
    DataTableModule,
    FormsModule,
    TabViewModule,
    MessagesModule,
    XmdQihuoModule,
    XmddingjinshouxiModule,
    XmdreceiveModule,
    XmdrukuModule,
    XmdoverdraftdetreportModule,
    XmdfeeModule,
    XmdCgbuchaModule
  ],
  declarations: [
    XmdOrderComponent, XmdorderdetailComponent, XmdMycustomerComponent,
    XmdGoodscodeComponent, XmdDingjinfanxiComponent, XmdCaigoudetimportComponent,
    XmdCaigouComponent, XmdCaigoudetComponent, XmdOrderdetreportComponent,
    XmdOfflineComponent, XmdkucundetailComponent, XmdTihuoComponent,
    XmdTihuodetailComponent
  ],
  providers: [XmdService, XmdorderService, XmdCaigouService,
    XmdGoodscodeService, XmdcustomerService, XmdBusinessorderapiService,
    XmdtihuoService, XmderpkaoheService],
  entryComponents: [XmdCaigoudetimportComponent]
})
export class XmdReportModule {
}
