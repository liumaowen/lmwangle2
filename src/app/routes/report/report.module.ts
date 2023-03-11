import { ChengbenModule } from './../chengben/chengben.module';
import { YunfeeModule } from './../yunfee/yunfee.module';
import { CustomerreportModule } from './../customerreport/customerreport.module';
import { PriceModule } from './../price/price.module';
import { BpriceModule } from './../bprice/bprice.module';
import { KaipiaoModule } from './../kaipiao/kaipiao.module';
import { FeeModule } from './../fee/fee.module';
import { DeptpriceModule } from './../deptprice/deptprice.module';
import { PaymentModule } from './../payment/payment.module';
import { ReceiveModule } from './../receive/receive.module';
import { ProduceModule } from './../produce/produce.module';
import { OrderModule } from './../order/order.module';
import { BusinessorderModule } from './../businessorder/businessorder.module';
import { XiaoshouModule } from './../xiaoshou/xiaoshou.module';
import { CgbuchaModule } from './../cgbucha/cgbucha.module';
import { InnersaleModule } from './../innersale/innersale.module';
import { AllotModule } from './../allot/allot.module';
import { KucunModule } from './../kucun/kucun.module';
import { MaoliModule } from './../maoli/maoli.module';
import { RukuModule } from './../ruku/ruku.module';
import { OrderAnalysisModule } from './../dnn-gm-bi/order-analysis/order-analysis.module';
import { UserAnalysisModule } from './../dnn-gm-bi/user-analysis/user-analysis.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GmbiService } from './../dnn-gm-bi/gmbi.service';
import { SelectModule } from 'ng2-select';
import { SharedModule } from './../../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import 'ag-grid-enterprise/main';
import { ReportComponent } from './report.component';
import { ShoukuanModule } from '../shoukuan/shoukuan.module';
import { CaigouModule } from '../caigou/caigou.module';
import { QihuoModule } from '../qihuo/qihuo.module';
import { BpricelogModule } from 'app/routes/bpricelog/bpricelog.module';
import { SellproModule } from 'app/routes/sellpro/sellpro.module';
import { CouponModule } from 'app/routes/coupon/coupon.module';
import { FeedbackModule } from 'app/routes/feedback/feedback.module';
import { BanksmsModule } from '../banksms/banksms.module';
import { WmchengbenModule } from '../wmchengben/wmchengben.module';
import { QihuochangeModule } from '../qihuochange/qihuochange.module';
import { QualityModule } from '../quality/quality.module';
import { ZentaoModule } from '../zentao/zentao.module';
import { MatchcarModule } from '../matchcar/matchcar.module';
import { VoucherModule } from '../voucher/voucher.module';
import { OverdraftdetreportModule } from './overdraftdetreport/overdraftdetreport.module';
import { OverdraftdetreportComponent } from './overdraftdetreport/overdraftdetreport.component';
import { KucunwarningModule } from './kucunwarning/kucunwarning.module';
import { DingdingModule } from '../dingding/dingding.module';
import { KucunstatisticsComponent } from './kucunstatistics/kucunstatistics.component';
import { KucunstatisticsModule } from './kucunstatistics/kucunstatistics.module';
import { UserlogdetModule } from '../dnn-gm-bi/userlogdet/userlogdet.module';
import { WuliuscoreModule } from '../wuliu/wuliuscore/wuliuscore.module';
import { OrginterestModule } from '../orginterest/orginterest.module';
import { YijiaModule } from '../yijia/yijia.module';
import { TiaohuobiddingModule } from '../tiaohuobidding/tiaohuobidding.module';
import { InquiryorderComponent } from './inquiryorder/inquiryorder.component';
import { InquiryorderModule } from './inquiryorder/inquiryorder.module';
import { OrglirunModule } from './orglirun/orglirun.module';
import { BankuailirunModule } from './bankuailirun/bankuailirun.module';
import { TeshulirunModule } from '../maoli/teshumaoli/teshumaoli.module';
import { QuestionPermissionModule } from '../questionpermission/questionpermission.module';
import { ChandimaoliModule } from './chandimaoli/chandimaoli.module';
import { ChengyunweightModule } from './chengyunweight/chengyunweight.module';
import { WuliupushModule } from './wuliupush/wuliupush.module';
import { IntercompanyModule } from './intercompany/intercompany.module';
import { TiaohuoModule } from '../tiaohuo/tiaohuo.module';



const routes: Routes = [
  { path: 'overdraftdetreport', component: OverdraftdetreportComponent, data: { 'title': '欠款明细' } },
  { path: 'kucunstatistics', component: KucunstatisticsComponent, data: { 'title': '库存管理统计' } },
  { path: 'inqueryorder', component: InquiryorderComponent, data: { 'title': '询单系统明细' } }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SelectModule,
    AgGridModule.withComponents([]),
    UserAnalysisModule,
    OrderAnalysisModule,
    KucunModule,
    RukuModule,
    MaoliModule,
    ChengbenModule,
    WmchengbenModule,
    ShoukuanModule,
    QihuoModule,
    AllotModule,
    ShoukuanModule,
    CaigouModule,
    InnersaleModule,
    CgbuchaModule,
    XiaoshouModule,
    BusinessorderModule,
    OrderModule,
    ProduceModule,
    ReceiveModule,
    PaymentModule,
    DeptpriceModule,
    FeeModule,
    KaipiaoModule,
    BpriceModule,
    BpricelogModule,
    PriceModule,
    CustomerreportModule,
    YunfeeModule,
    SellproModule,
    CouponModule,
    BanksmsModule,
    FeedbackModule,
    QihuochangeModule,
    QualityModule,
    MatchcarModule,
    ZentaoModule,
    VoucherModule,
    OverdraftdetreportModule,
    KucunwarningModule,
    DingdingModule,
    KucunstatisticsModule,
    InquiryorderModule,
    UserlogdetModule,
    WuliuscoreModule,
    OrginterestModule,
    YijiaModule,
    TiaohuobiddingModule,
    OrglirunModule,
    BankuailirunModule,
    TeshulirunModule,
    QuestionPermissionModule,
    ChandimaoliModule,
    ChengyunweightModule,
    WuliupushModule,
    IntercompanyModule,
    TiaohuoModule
  ],
  declarations: [ReportComponent],
  exports: [
    AgGridModule,
    RouterModule
  ],
  providers: [
    GmbiService
  ]
})
export class ReportModule { }
