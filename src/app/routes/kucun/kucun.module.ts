import { RadioButtonModule } from 'primeng/primeng';
import { GetdayPipe } from './../../dnn/shared/pipe/getday.pipe';
import { OrderstatusPipe } from './../../dnn/shared/pipe/orderstatus.pipe';
import { DataTableModule } from 'angular2-datatable';
import { ReportService } from './../report/report.service';
import { FavoritelistComponent } from './../../dnn/shared/favoritelist/favoritelist.component';
import { DropdownModule } from 'primeng/primeng';
import { SharedModule } from './../../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { RouterModule, Routes } from '@angular/router';
import { KucunService } from './kucun.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KucunComponent } from './kucun/kucun.component';
import { KucundetailComponent } from './kucundetail/kucundetail.component';
import { KucunkulingComponent } from './kucunkuling/kucunkuling.component';
import { KucunsaledetailComponent } from './kucunsaledetail/kucunsaledetail.component';
import { ChainComponent } from './chain/chain.component';
import { PricekucunComponent } from './pricekucun/pricekucun.component';
import { GoodscodeComponent } from './goodscode/goodscode.component';
import { CangkudetComponent } from './cangkudet/cangkudet.component';
import { KucundayComponent } from './kucunday/kucunday.component';
import { SaleandcaigouComponent } from './saleandcaigou/saleandcaigou.component';
import { TudufenxiComponent } from './tudufenxi/tudufenxi.component';
import { PricekucundateilComponent } from './pricekucundateil/pricekucundateil.component';
import { NoticeshelveComponent } from './noticeshelve/noticeshelve.component';
import { OnlinekucundetailComponent } from './onlinekucundetail/onlinekucundetail.component';
import { ZaitukucundetailComponent } from './zaitukucundetail/zaitukucundetail.component';
import { ZaitucangkuComponent } from './zaitukucundetail/zaitucangku/zaitucangku.component';
import { OverduekucunComponent } from './overduekucun/overduekucun.component';
import { QzkulingComponent } from './qzkuling/qzkuling.component';
import { LongkucuninterestComponent } from './longkucuninterest/longkucuninterest.component';
import { BasematerialComponent } from './basematerial/basematerial.component';
import { KucuncheckComponent } from './kucuncheck/kucuncheck.component';
import { KucuncheckhuizongComponent } from './kucuncheckhuizong/kucuncheckhuizong.component';
import { KucunfqkComponent } from './kucunfqk/kucunfqk.component';
import { AutopaidanComponent } from './autopaidan/autopaidan.component';
import { DailypriceComponent } from './dailyprice/dailyprice.component';
import { SelectModule } from 'ng2-select';
import { LaoercolornumComponent } from './laoercolornum/laoercolornum.component';
import { KucuncustomerComponent } from './kucuncustomer/kucuncustomer.component';

const routes: Routes = [{ path: 'kucun', component: KucunComponent, data: { 'title': '库存汇总表' } },
{ path: 'kucundetail', component: KucundetailComponent, data: { 'title': '库存明细表' } },
{ path: 'kucunkuling', component: KucunkulingComponent, data: { 'title': '权重库龄' } },
{ path: 'kucunsaledetail', component: KucunsaledetailComponent, data: { 'title': '懒猫每日销售进度表' } },
{ path: 'chain', component: ChainComponent, data: { 'title': '钢卷生命周期' } },
{ path: 'chain/:id', component: ChainComponent, data: { 'title': '钢卷生命周期' } },
{ path: 'pricekucun', component: PricekucunComponent, data: { 'title': '价格-库存' } },
{ path: 'goodscode', component: GoodscodeComponent, data: { 'title': '物料编码' } },
{ path: 'cangkudet', component: CangkudetComponent, data: { 'title': '仓库明细表' } },
{ path: 'saleandcaigou', component: SaleandcaigouComponent, data: { 'title': '销售及订货量统计' } },
{ path: 'dinghuofenxi', component: TudufenxiComponent, data: { 'title': '流通单订货分析表' } },
{ path: 'kucunday', component: KucundayComponent, data: { 'title': '库存日报表' } },
{ path: 'pricekucundateil/:id', component: PricekucundateilComponent, data: { 'title': '上架记录明细' } },
{ path: 'pricekucundateil', component: NoticeshelveComponent, data: { 'title': '上架下架时序表' } },
{ path: 'onlinekucundetail', component: OnlinekucundetailComponent, data: { 'title': '线上库存明细表' } },
{ path: 'zaitukucundetail', component: ZaitukucundetailComponent, data: { 'title': '在途库存明细表' } },
{ path: 'overduekucun', component: OverduekucunComponent, data: { 'title': '超期库存' } },
{ path: 'qzkuling', component: QzkulingComponent, data: { 'title': '机构库存权重库龄' } },
{ path: 'longkucuninterest', component: LongkucuninterestComponent, data: { 'title': '机构长期库存吨利息' } },
{ path: 'countbasematerial', component: BasematerialComponent, data: { 'title': '原卷汇总表' } },
{ path: 'kucuncheckdet', component: KucuncheckComponent, data: { 'title': '库存核对明细表' } },
{ path: 'kucuncheckhuizong', component: KucuncheckhuizongComponent, data: { 'title': '库存核对汇总表' } },
{ path: 'kucunfqk', component: KucunfqkComponent, data: { 'title': '各机构非全款库存情况表' } },
{ path: 'autopaidan', component: AutopaidanComponent, data: { 'title': '自动排单表' } },
{ path: 'dailyprice', component: DailypriceComponent, data: { 'title': '每日价格登记' } },
{ path: 'laoercolornum', component: LaoercolornumComponent, data: { 'title': '劳尔色号对照表' } },
{ path: 'kucuncustomer', component: KucuncustomerComponent, data: { 'title': '各机构流通商未付款待提货库存' } },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    WiskSharedsModule,
    SharedModule,
    DropdownModule,
    SelectModule,
    DataTableModule,
    AgGridModule,
    RadioButtonModule
  ],
  declarations: [KucunComponent, KucundetailComponent, FavoritelistComponent,
    KucunsaledetailComponent, ChainComponent, PricekucunComponent, PricekucundateilComponent,
    GoodscodeComponent, CangkudetComponent, KucundayComponent, SaleandcaigouComponent,
    TudufenxiComponent, NoticeshelveComponent, OnlinekucundetailComponent, ZaitukucundetailComponent,
    ZaitucangkuComponent, OverduekucunComponent, QzkulingComponent, LongkucuninterestComponent, BasematerialComponent,KucunkulingComponent,
    KucuncheckComponent, KucuncheckhuizongComponent, KucunfqkComponent, AutopaidanComponent, DailypriceComponent, LaoercolornumComponent,KucuncustomerComponent],
  providers: [KucunService, ReportService, OrderstatusPipe, GetdayPipe],
  entryComponents: [FavoritelistComponent, ZaitucangkuComponent]
})
export class KucunModule { }
