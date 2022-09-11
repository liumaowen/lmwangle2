import { FormsModule } from '@angular/forms';
import { DropdownModule, TabViewModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { OrderapiService } from './orderapi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { OrderdetailComponent } from './orderdetail/orderdetail.component';
import { OrderdetreportComponent } from './orderdetreport/orderdetreport.component';
import { OrderdetcxreportComponent } from './orderdetcxreport/orderdetcxreport.component';
import { OrdercalcComponent } from './ordercalc/ordercalc.component';
import { SaledetreportComponent } from './saledetreport/saledetreport.component';
import { ProorderdetailComponent } from './proorderdetail/proorderdetail.component';
import { OrderjiagongfeeComponent } from './orderjiagongfee/orderjiagongfee.component';
import { SelectModule } from 'ng2-select';
import { JiagongmsgComponent } from './jiagongmsg/jiagongmsg.component';
import { EditComponent } from './edit/edit.component';
import { OnlineorderkaoheComponent } from './onlineorderkaohe/onlineorderkaohe.component';
import { JingliaoorderdetailComponent } from './jingliaoorderdetail/jingliaoorderdetail.component';
import { QihuodaiyundetComponent } from './qihuodaiyundet/qihuodaiyundet.component';
import { NoticewuliuyuanComponent } from 'app/dnn/shared/noticewuliuyuan/noticewuliuyuan.component';
import { TudusaledetComponent } from './tudusaledet/tudusaledet.component';
import { DaydealdetailComponent } from './daydealdetail/daydealdetail.component';
import { NeicaigoufapiaodetailComponent } from './neicaigoufapiaodetail/neicaigoufapiaodetail.component';
import { NeicaigoufapiaoreporterComponent } from './neicaigoufapiaoreporter/neicaigoufapiaoreporter.component';
import { OrderlirunComponent } from './orderlirun/orderlirun.component';

const routes: Routes = [
  { path: 'order', component: OrderComponent, data: { 'title': '订单管理' } },
  { path: 'order/:id', component: OrderdetailComponent, data: { 'title': '订单明细' } },
  { path: 'orderdetreport', component: OrderdetreportComponent, data: { 'title': '订单明细表' } },
  { path: 'orderdetcxreport', component: OrderdetcxreportComponent, data: { 'title': '创新订单明细表' } },
  { path: 'order_calc', component: OrdercalcComponent, data: { 'title': '订单运费核算列表' } },
  { path: 'saledetreport', component: SaledetreportComponent, data: { 'title': '销售收入明细表' } },
  { path: 'proorder/:id', component: ProorderdetailComponent, data: { 'title': '加工合同单明细' } },
  { path: 'orderjiagongfee', component: OrderjiagongfeeComponent, data: { 'title': '订单加工费核算列表' } },
  { path: 'onlineorderkaohe', component: OnlineorderkaoheComponent, data: { 'title': '线上订单考核明细表' } },
  { path: 'jingliaoorderdetail', component: JingliaoorderdetailComponent, data: { 'title': '净料期货加工明细表' } },
  { path: 'qihuodaiyundet', component: QihuodaiyundetComponent, data: { 'title': '期货代运汇总表' } },
  { path: 'tudusaledet', component: TudusaledetComponent, data: { 'title': '涂镀公司销量情况' } },
  { path: 'daydealdetail', component: DaydealdetailComponent, data: { 'title': '日常接单及成交情况表' } },
  { path: 'neicaigoufapiao/:id', component: NeicaigoufapiaodetailComponent, data: { 'title': '内部采购发票明细表' } },
  { path: 'neicaigoufapiaoreporter', component: NeicaigoufapiaoreporterComponent, data: { 'title': '内部采购发票表' } },
  { path: 'orderlirun', component: OrderlirunComponent, data: { 'title': '订单创造利润一览表' } },
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
    SelectModule
  ],
  declarations: [OrderComponent, OrderdetailComponent, OrderdetreportComponent, OrderdetcxreportComponent,
    OrdercalcComponent,
    SaledetreportComponent, ProorderdetailComponent, OrderjiagongfeeComponent, JiagongmsgComponent,
    EditComponent, OnlineorderkaoheComponent, JingliaoorderdetailComponent, QihuodaiyundetComponent,
    TudusaledetComponent, DaydealdetailComponent, NeicaigoufapiaodetailComponent, NeicaigoufapiaoreporterComponent,OrderlirunComponent],
  providers: [OrderapiService],
  entryComponents: [JiagongmsgComponent, EditComponent, NoticewuliuyuanComponent]
})
export class OrderModule { }
