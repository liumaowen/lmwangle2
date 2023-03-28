import { QihuostatusPipe } from './pipe/qihuostatus.pipe';
import { KehutypePipe } from './pipe/kehutype.pipe';
import { GuigetypePipe } from './pipe/guigetype.pipe';
import { CountdownDirective } from './directive/countdown.directive';
import { CalendarModule } from 'primeng/primeng';
import { CustomerapiService } from './../../routes/customer/customerapi.service';
import { GetdayPipe } from './pipe/getday.pipe';
import { OrderstatusPipe } from './pipe/orderstatus.pipe';
import { AgentuserPipe } from './pipe/agentuser.pipe';
import { AutoCompleteModule, DropdownModule } from 'primeng/primeng';
import { SharedModule } from './../../shared/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsTranslatedPipe } from './pipe/is-translated.pipe';
import { YearmonthselectComponent } from './yearmonthselect/yearmonthselect.component';
import { UploaderComponent } from './uploader/uploader.component';
import { WiskusersearchComponent } from './wiskusersearch/wiskusersearch.component';
import { WiskusernamesearchComponent } from './wiskusernamesearch/wiskusernamesearch.component';
import { WiskcompanysearchComponent } from './wiskcompanysearch/wiskcompanysearch.component';
import { NgoperaDirective } from './directive/ngopera.directive';
import { ShoukuanstatusPipe } from './pipe/shoukuanstatus.pipe';
import { WiskinnercompanyComponent } from './wiskinnercompany/wiskinnercompany.component';
import { WiskorglistComponent } from './wiskorglist/wiskorglist.component';
import { OrgPipe } from './pipe/org.pipe';
import { CustomerPipe } from './pipe/customer.pipe';
import { FlagPipe } from './pipe/flag.pipe';
import { OrdertypePipe } from './pipe/ordertype.pipe';
import { TranstypePipe } from './pipe/transtype.pipe';
import { WiskcustomersearchComponent } from './wiskcustomersearch/wiskcustomersearch.component';
import { CgbuchatypePipe } from './pipe/cgbuchatype.pipe';
import { OrderpaytypePipe } from './pipe/orderpaytype.pipe';
import { WisfeecompanysearchComponent } from './wisfeecompanysearch/wisfeecompanysearch.component';
import { TihuostatusPipe } from './pipe/tihuostatus.pipe';
import { ProductPipe } from './pipe/product.pipe';
import { PaytypePipe } from './pipe/paytype.pipe';
import { PricePipe } from './pipe/price.pipe';
import { XstuihuostatusPipe } from './pipe/xstuihuostatus.pipe';
import { TihuotypePipe } from './pipe/tihuotype.pipe';
import { TihuoleibiePipe } from './pipe/tihuoleibie.pipe';
import { TransporttypePipe } from './pipe/transporttype.pipe';
import { TihuoistPipe } from './pipe/tihuoist.pipe';
import { CgfkstatusPipe } from './pipe/cgfkstatus.pipe';
import { IsprintPipe } from './pipe/isprint.pipe';
import { EditablePipe } from './pipe/editable.pipe';
import { Ordertype1Pipe } from './pipe/ordertype1.pipe';
import { OrderyunshutypePipe } from './pipe/orderyunshutype.pipe';
import { WisksuppliersearchComponent } from './wisksuppliersearch/wisksuppliersearch.component';
import { WiskfindbysaleComponent } from './wiskfindbysale/wiskfindbysale.component';
import { CgtuihuostatusPipe } from './pipe/cgtuihuostatus.pipe';
import { WiskfindproduceComponent } from './wiskfindproduce/wiskfindproduce.component';
import { CaigoutypePipe } from './pipe/caigoutype.pipe';
import { ShoukuanverifyPipe } from './pipe/shoukuanverify.pipe';
import { PrintPipe } from './pipe/print.pipe';
import { SubmitverifyPipe } from './pipe/submitverify.pipe';
import { CaigoukindPipe } from './pipe/caigoukind.pipe';
import { CgfkkindPipe } from './pipe/cgfkkind.pipe';
import { FeeimplistComponent } from './feeimplist/feeimplist.component';
import { FeetypePipe } from './pipe/feetype.pipe';
import { SalebillstatusPipe } from './pipe/salebillstatus.pipe';
import { SaletypePipe } from './pipe/saletype.pipe';
import { SalebillmailPipe } from './pipe/salebillmail.pipe';
import { SalebillverifyPipe } from './pipe/salebillverify.pipe';
import { OrderisonlinePipe } from './pipe/orderisonline.pipe';
import { DantypePipe } from './pipe/dantype.pipe';
import { XsbuchastatusPipe } from './pipe/xsbuchastatus.pipe';
import { JsbuchatypePipe } from './pipe/jsbuchatype.pipe';
import { ZhibaoshustatusPipe } from './pipe/zhibaoshustatus.pipe';
import { WiskonlinecustomerComponent } from './wiskonlinecustomer/wiskonlinecustomer.component';
import { WiskfindbybillnoComponent } from './wiskfindbybillno/wiskfindbybillno.component';
import { KuaijikemuPipe } from './pipe/kuaijikemu.pipe';
import { FkjiesuantypePipe } from './pipe/fkjiesuantype.pipe';
import { MystarComponent } from './mystar/mystar.component';
import { WiswiswlcompanysearchComponent } from './wiswlcompanysearch/wiswlcompanysearch.component';
import { NoticewuliuyuanComponent } from './noticewuliuyuan/noticewuliuyuan.component';
import { MaGangAddComponent } from 'app/dnn/shared/magangadd/magangadd.component';
import { InnertransterPipe } from './pipe/innertransfer.pipe';
import { AgGridModule } from 'ag-grid-angular';
import { ModalModule, PaginationModule } from 'ngx-bootstrap';
import { ZaitukucunimportComponent } from './zaitukucunimport/zaitukucunimport.component';
import { WiskonlineandsaleComponent } from './wiskonlineandsale/wiskonlineandsale.component';
import { ImpzhiyajinComponent } from './impzhiyajin/impzhiyajin.component';
import { YearselectComponent } from './yearselect/yearselect.component';
import { CreategoodscodeComponent } from './creategoodscode/creategoodscode.component';
import { DataTableModule } from 'angular2-datatable';
import { MdmselectgnComponent } from './mdmselectgn/mdmselectgn.component';
import { ToasterModule } from 'angular2-toaster';
import { ProducemodePipe } from './pipe/producemode.pipe';
import { isLinshicangkuPipe } from './pipe/islinshicangku.pipe';
import { JiesuanmouldPipe } from './pipe/jiesuanmould.pipe';
import { XmdiskcompanysearchComponent } from './xmdwiskcompanysearch/xmdwiskcompanysearch.component';
import { XmdkucundetimportComponent } from './xmdkucundetimport/xmdkucundetimport.component';
import { XmdwiskfindbysaleComponent } from './xmdwiskfindbysale/xmdwiskfindbysale.component';
import { XmdmdmselectgnComponent } from './xmdmdmselectgn/xmdmdmselectgn.component';
import { XmdWisksuppliersearchComponent } from './xmdwisksuppliersearch/xmdwisksuppliersearch.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DatepickerModule,
    BsDropdownModule,
    FileUploadModule,
    AutoCompleteModule,
    DropdownModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    ModalModule.forRoot(),
    DataTableModule,
    PaginationModule.forRoot(),
    ToasterModule
  ],
  providers: [CustomerapiService],
  declarations: [
    IsTranslatedPipe,
    YearmonthselectComponent,
    UploaderComponent,
    WiskusersearchComponent,
    WiskusernamesearchComponent,
    WiskcompanysearchComponent,
    NgoperaDirective,
    AgentuserPipe,
    ShoukuanstatusPipe,
    FkjiesuantypePipe,
    WiskinnercompanyComponent,
    WiskorglistComponent,
    OrgPipe,
    CustomerPipe,
    OrderstatusPipe,
    FlagPipe,
    OrdertypePipe,
    TranstypePipe,
    GetdayPipe,
    WiskcustomersearchComponent,
    CgbuchatypePipe,
    OrderpaytypePipe,
    WisfeecompanysearchComponent,
    WiswiswlcompanysearchComponent,
    TihuostatusPipe,
    ProductPipe,
    PaytypePipe,
    PricePipe,
    XstuihuostatusPipe,
    TihuotypePipe,
    TihuoleibiePipe,
    TransporttypePipe,
    TihuoistPipe,
    CgfkstatusPipe,
    IsprintPipe,
    EditablePipe,
    Ordertype1Pipe,
    OrderyunshutypePipe,
    WisksuppliersearchComponent,
    XmdWisksuppliersearchComponent,
    WiskfindbysaleComponent,
    XmdwiskfindbysaleComponent,
    CgtuihuostatusPipe,
    WiskfindproduceComponent,
    WiskfindbybillnoComponent,
    CaigoutypePipe,
    ShoukuanverifyPipe,
    PrintPipe,
    ProducemodePipe,
    SubmitverifyPipe,
    CaigoukindPipe,
    CgfkkindPipe,
    CountdownDirective,
    FeetypePipe,
    SalebillstatusPipe,
    SaletypePipe,
    SalebillmailPipe,
    SalebillverifyPipe,
    OrderisonlinePipe,
    DantypePipe,
    XsbuchastatusPipe,
    JsbuchatypePipe,
    GuigetypePipe,
    KehutypePipe,
    QihuostatusPipe,
    ZhibaoshustatusPipe,
    KuaijikemuPipe,
    InnertransterPipe,
    WiskonlinecustomerComponent,
    WiskonlineandsaleComponent,
    WiskfindbybillnoComponent,
    MystarComponent,
    NoticewuliuyuanComponent,
    MaGangAddComponent,
    CreategoodscodeComponent,
    MdmselectgnComponent,
    ZaitukucunimportComponent,
    ImpzhiyajinComponent,
    YearselectComponent,
    ProducemodePipe,
    isLinshicangkuPipe,
    JiesuanmouldPipe,
    XmdiskcompanysearchComponent,
    XmdkucundetimportComponent,
    XmdmdmselectgnComponent
  ],
  exports: [
    IsTranslatedPipe,
    YearmonthselectComponent,
    UploaderComponent,
    WiskusersearchComponent,
    WiskusernamesearchComponent,
    WiskcompanysearchComponent,
    NgoperaDirective,
    AgentuserPipe,
    ShoukuanstatusPipe,
    WiskinnercompanyComponent,
    WiskorglistComponent,
    OrgPipe,
    CustomerPipe,
    OrderstatusPipe,
    GetdayPipe,
    FlagPipe,
    OrdertypePipe,
    TranstypePipe,
    WiskcustomersearchComponent,
    CgbuchatypePipe,
    OrderpaytypePipe,
    WisfeecompanysearchComponent,
    WiswiswlcompanysearchComponent,
    TihuostatusPipe,
    ProductPipe,
    PaytypePipe,
    PricePipe,
    XstuihuostatusPipe,
    TihuotypePipe,
    TihuoleibiePipe,
    TransporttypePipe,
    TihuoistPipe,
    CgfkstatusPipe,
    IsprintPipe,
    EditablePipe,
    Ordertype1Pipe,
    OrderyunshutypePipe,
    WisksuppliersearchComponent,
    XmdWisksuppliersearchComponent,
    WiskfindbysaleComponent,
    XmdwiskfindbysaleComponent,
    CgtuihuostatusPipe,
    WiskfindproduceComponent,
    WiskfindbybillnoComponent,
    CaigoutypePipe,
    ShoukuanverifyPipe,
    FkjiesuantypePipe,
    PrintPipe,
    ProducemodePipe,
    SubmitverifyPipe,
    CaigoukindPipe,
    CgfkkindPipe,
    CountdownDirective,
    FeetypePipe,
    SalebillstatusPipe,
    SaletypePipe,
    SalebillmailPipe,
    SalebillverifyPipe,
    OrderisonlinePipe,
    DantypePipe,
    XsbuchastatusPipe,
    JsbuchatypePipe,
    GuigetypePipe,
    KehutypePipe,
    QihuostatusPipe,
    ZhibaoshustatusPipe,
    InnertransterPipe,
    KuaijikemuPipe,
    WiskonlinecustomerComponent,
    WiskonlineandsaleComponent,
    MystarComponent,
    NoticewuliuyuanComponent,
    MaGangAddComponent,
    CreategoodscodeComponent,
    MdmselectgnComponent,
    ZaitukucunimportComponent,
    YearselectComponent,
    isLinshicangkuPipe,
    JiesuanmouldPipe,
    XmdiskcompanysearchComponent,
    XmdkucundetimportComponent,
    XmdmdmselectgnComponent
  ],
  entryComponents: [MdmselectgnComponent,XmdkucundetimportComponent]
})
export class WiskSharedsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WiskSharedsModule
    };
  }
}
