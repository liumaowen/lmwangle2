import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { UserapiService } from '../../../dnn/service/userapi.service';
import { DatePipe } from '@angular/common';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { BusinessorderapiService } from '../../businessorder/businessorderapi.service';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';
import { TiaohuoService } from '../tiaohuo.service';


@Component({
  selector: 'app-tiaohuo',
  templateUrl: './tiaohuo.component.html',
  styleUrls: ['./tiaohuo.component.scss']
})
export class TiaohuoComponent implements OnInit {
  ordertypes: Array<any>; // 订单类型
  buyer: any; // 买方
  addrs: Array<any>;
  results: any;
  tiaohuo = {
    ordertype: null, // 订单类型
    type: null, // 配送方式
    buyerid: null, // 买方单位
    addrid: null, // 收货地址
    sellerid: null, // 卖方单位
    jiaohuogongcha: null,
    jiaohuoqixian: null,
    dingjin: null,
    guigetype: false,
    isweishi: false,
    isft: false, // 是否外贸单子
    jiaohuoaddr: null, // 交货地点
    paytype: null,
    witharrears: null
  };
  canzero = false; // 生效约定方式为定金到账时，不可为0
  showwitharrears = false; // 欠款周期是否显示
  @ViewChild('createtiaohuodialog') private createtiaohuodialog: ModalDirective;
  @ViewChild('querydialog') private querydialog: ModalDirective;// 查询
  public totalItems: number;
  public currentPage: number = 1;
  shengxiaodate: Date = new Date();
  categorys: any = []; // 行业类别所属行业
  moneytypes = [{ value: '定金', label: '定金到账' }, { value: '货款', label: '货款到账' }, { value: '其他约定方式', label: '其他约定方式' }];
  paytypes = [{ value: '0', label: '款到发货' }, { value: '1', label: '欠款发货' }];
  releasetypes = [{ value: '0', label: '不释放' }, { value: '1', label: '等比例释放' }, { value: '2', label: '最后一次释放' }];
  isshowaddr = false; // 默认收货地址不显示
  dantypes;
  zhidaoprices;
  // 定义status的值
  qihuostatuses = [{ label: '请选择订单状态', value: '' }, { label: '制单中', value: 1 }, { label: '审核中', value: 2 },
  { label: '已审核', value: 3 }, { label: '已下单', value: 4 }, { label: '已采购', value: 5 }, { label: '待提货', value: 6 },
  { label: '已完成', value: 7 }, { label: '变更中', value: 8 }];
  pageChanged(event) {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.querydata();
  }
  constructor(private tiaohuoApi: TiaohuoService, private toast: ToasterService, private router: Router,
    private userapi: UserapiService, private datepipe: DatePipe, private matchcarApi: MatchcarService,
    private classifyApi: ClassifyApiService, private businessOrderApi: BusinessorderapiService,) {
    this.querydata();
  }
  ngOnInit() { }
  // 分页查询的条件
  search: any = {
    pagenum: 1,
    pagesize: 10
  };
  //ngtable的表格数据
  singleData: Array<any> = null;
  //查询数据
  querydata() {
    this.tiaohuoApi.query(this.search).then((data) => {
      //获取到总条目
      this.totalItems = data.headers.get('total');
      //获取到当前数据
      this.singleData = data.json();
    })
  }

  //打开查询框
  queryopen() {
    this.querydialog.show();
  }
  //关闭查询框
  queryclose() {
    this.querydialog.hide();
  }
  cuser: any;
  select() {
    console.log(this.search);
    if (this.buyer) {
      this.search['buyerid'] = this.buyer['code'];
    }
    if (this.cuser) {
      this.search['cuserid'] = this.cuser['code'];
    }
    this.querydata();
    this.queryclose();
  }
  //删除
  delQihuo(qihuoid) {
    this.tiaohuoApi.delQihuo(qihuoid).then(() => {
      this.toast.pop('success', '删除成功！');
      this.querydata();
   })
 }

  // 获取选择公司的送货地址
  findAddr(customerid) {
    console.log(customerid);
    console.log(this.tiaohuo);
    if (customerid && this.tiaohuo['type'] === '1') {// 判断只有是代运的才能加载地址
      this.addrs = [{ value: '', label: '请选择地址' }];
      this.userapi.findAddr(customerid).then((data) => {
        data.forEach((element) => {
          this.addrs.push({
            value: element['id'],
            label: element['province'] + element['city'] + element['county'] + element['detail']
          })
        });
      });
    }
  }
  showaddr(event) {
    console.log(event);
    if (!event['code']) {
      return;
    }
    this.findAddr(event['code']);
  }

  // 打开弹出框
  addopen() {
    this.selectNull();
    this.ordertypes = [{ label: '请选择', value: null },
    { label: '现货调货', value: 16 }, { label: '期货调货', value: 18 },{ label: '现货调货加工', value: 17 },{ label: '期货调货加工', value: 19 }];
    this.dantypes = [{ value: '0', label: '甲单' }, { value: '1', label: '乙单' }, { value: '2', label: '丙单' }];
    this.tiaohuo['jiaohuogongcha'] = '以钢厂实际交货数量为准';
    this.getcategory();
    this.createtiaohuodialog.show();
  }
  addclose() {
    this.createtiaohuodialog.hide();
  }

  // 卖方公司
  innercompany(event) {
    this.tiaohuo['sellerid'] = event;
  }
  selectNull() {
    this.shengxiaodate = new Date();
    this.search = {
      pagenum: 1,
      pagesize: 10
    };
    this.cuser = null;
    this.buyer = null; // 买方
    this.tiaohuo = {
      ordertype: null, // 订单类型
      type: null, // 配送方式
      buyerid: null, // 买方单位
      addrid: null, // 收货地址
      sellerid: null, // 卖方单位
      jiaohuogongcha: null,
      jiaohuoqixian: null,
      dingjin: null,
      guigetype: false,
      isweishi: false,
      isft: false, // 是否外贸
      jiaohuoaddr: null, // 交货地点
      paytype: null,
      witharrears: null
    }
  }

  // 生效约定方式改变
  selectedmoneytype(event) {
    console.log(event);
    if (event === '定金') {
      this.canzero = true;
    } else {
      this.canzero = false;
    }
  }

  // 支付方式改变
  changepaytype(event) {
    if (event && event === '1') {
      this.showwitharrears = true;
    } else {
      this.showwitharrears = false;
      this.tiaohuo['witharrears'] = null;
    }
  }
  modifyweishi() {
    if (this.tiaohuo['ordertype'] === 15) {
      this.tiaohuo['isweishi'] = true;
    } else {
      this.tiaohuo['isweishi'] = false;
    }
  }
  createtiaohuo() {
    this.tiaohuo['shengxiaodate'] = this.datepipe.transform(this.shengxiaodate, 'y-MM-dd');
    if (this.tiaohuo['ordertype'] == null) {
      this.toast.pop('warning', '请选择订单类型');
      return;
    }
    if (!this.tiaohuo['moneytype']) {
      this.toast.pop('warning', '请选择合同生效约定方式！');
      return;
    }
    if (!this.tiaohuo['paytype']) {
      this.toast.pop('warning', '请选择支付类型！');
      return;
    } else if (this.tiaohuo['paytype'] === '1') {
      if (!this.tiaohuo['witharrears'] || this.tiaohuo['witharrears'] === '') {
        this.toast.pop('warning', '欠款发货时,欠款周期必填！');
        return;
      }
    }
    if (this.buyer instanceof Object) {
      this.tiaohuo['buyerid'] = this.buyer['code'];
    } else {
      this.tiaohuo['buyerid'] = null;
    }
    if (this.tiaohuo['buyerid'] === null) {
      this.toast.pop('warning', '请选择买方公司');
      return;
    }
    if (!this.tiaohuo['type']) {
      this.toast.pop('warning', '请选择提货方式');
      return;
    } else if (this.tiaohuo['type'] === 1 && !this.tiaohuo['addrid']) {
      this.toast.pop('warning', '请填写收货地址！');
      return;
    }
    if (!this.tiaohuo['sellerid']) {
      this.toast.pop('warning', '请选择卖方公司');
      return;
    }
    this.tiaohuo['jiaohuogongcha'] = '以钢厂实际交货数量为准';

    if (!this.tiaohuo['jiaohuoqixian']) {
      this.toast.pop('warning', '请选择交货期限');
      return;
    } else {
      this.tiaohuo['jiaohuoqixian'] = this.datepipe.transform(this.tiaohuo['jiaohuoqixian'], 'y-MM-dd');
    }
    if (this.tiaohuo['dantype'] === undefined) {
      this.toast.pop('warning', '请选择单据类别！');
      return '';
    }
    if (!this.tiaohuo['projectname']) {
      this.toast.pop('warning', '请输入项目名称！');
      return '';
    }
    if (!this.tiaohuo['categoryid']) {
      this.toast.pop('warning', '请选择所属行业！');
      return '';
    }
    // 检查完成开始数据库创建期货销售订单主表
    if (confirm('期货订单实付定金低于10万或者定金比例小于15%，最后一次释放定金。你确定要创建吗？')) {
      this.tiaohuoApi.add(this.tiaohuo).then((data) => {
        this.toast.pop('success', '创建成功！');
        this.addclose();
        this.router.navigate(['qihuo', data]);
      });
    }
  }
  //地址添加 弹出添加地址的对话框
  @ViewChild('addrdialog') private addrdialog: ModalDirective;
  addr = {};
  provinces = [];
  citys = [];
  countys = [];
  addAddrDialog() {
    if (this.tiaohuo['type'] === '0') {
      this.toast.pop('warning', '自提的订单无需添加地址^~^');
      return '';
    }
    if (this.buyer) {
      this.search['buyerid'] = this.buyer['code'];
    } else {
      this.toast.pop("warning", "请选择买方公司");
      return;
    }
    this.addr = {};
    this.provinces = [];
    this.citys = [];
    this.countys = [];
    this.addrdialog.show();
    this.getProvince();
  }

  getProvince() {
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element.id
        })
      });
      this.citys = [];
      this.countys = [];
    })
  }

  getcity() {
    this.citys = [];
    this.classifyApi.getChildrenTree({ pid: this.addr['provinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        })
      });
      this.countys = [];
    })
  }

  getcounty() {
    this.countys = [];
    this.classifyApi.getChildrenTree({ pid: this.addr['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        })
      });
    })
  }
  searchplace(e) {
    console.log(e.query);
    this.matchcarApi.getSuggestionPlace(e.query).then(data => {
      console.log(data);
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.title + '\r\n' + element.address,
          code: element
        });
      });
    });
  }
  // 开始往数据库中添加内容
  addAddr() {
    this.addr['customerid'] = this.buyer['code'];
    console.log(this.results);
    console.log(this.addr);
    this.businessOrderApi.createAddr(this.addr).then((data) => {
      // addrDialog.close();
      this.addrdialogclose();
      this.findAddr(this.addr['customerid']);
    });
  }
  addrdialogclose() {
    this.addrdialog.hide();
  }
  /**获取行业类别所属行业*/
  getcategory() {
    this.classifyApi.liststage('qihuo_category').then((data) => {
      const categorylist = [{ label: '请选择所属行业', value: '' }];
      data.forEach(element => {
        categorylist.push({
          label: element.name,
          value: element.id
        });
      });
      this.categorys = categorylist;
    });
  }
  typechange(event) {
    if (event === '1') {
      this.isshowaddr = true;
    } else {
      this.isshowaddr = false;
      this.tiaohuo.addrid = null;
    }
  }
}

