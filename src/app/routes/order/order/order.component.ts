import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ProorderapiService } from './../../produce/proorderapi.service';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { CustomerapiService } from './../../customer/customerapi.service';
import { BusinessorderapiService } from './../../businessorder/businessorderapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { OrderapiService } from './../orderapi.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectComponent } from 'ng2-select';
import { DatePipe } from '@angular/common';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  results: any;
  activating = false;
  search = { pagenum: 1, pagesize: 10 };
  singleData: any;
  totalItems: any;
  shengxiaodate: Date = new Date();
  public currentPage: number = 1;
  moneytypes = [{ value: '货款', label: '货款到账' }];
  // 单据类型
  dantypes;
  constructor(private storage: StorageService, private orderApi: OrderapiService, private businessOrderApi: BusinessorderapiService,
    private customerApi: CustomerapiService, private toast: ToasterService, private router: Router, private proOrderApi: ProorderapiService,
    private classifyApi: ClassifyApiService, private matchcarApi: MatchcarService, private datepipe: DatePipe) {
    this.listDetail();
  }

  ngOnInit() {
  }

  listDetail() {
    this.orderApi.query(this.search).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    });
  }

  // 分页点击查询
  pageChanged(event: any): void {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.listDetail();
  };

  queryDialog() {
    this.search['isonline'] = 'false';
    this.showqueryModal();
  }

  suser;
  companyOfName;
  // 重置条件
  selectNull() {
    this.search = { pagenum: 1, pagesize: 10 };
    this.suser = undefined;
    this.companyOfName = undefined;
  }

  // 查询订单

  query() {
    if (typeof (this.suser) === 'string' || !this.suser) {
      delete (this.search['cuserid']);
    } else if (typeof (this.suser) === 'object') {
      this.search['cuserid'] = this.suser['code'];
    }
    if (typeof (this.companyOfName) === 'string' || !this.companyOfName) {
      delete (this.search['customerid']);
    } else if (typeof (this.companyOfName) === 'object') {
      this.search['customerid'] = this.companyOfName['code'];
    }
    console.log(this.search);
    this.listDetail();
    this.hidequeryModal();
  }


  // 定义type的值
  // 2018.01.11 转货权开发 cpf MOD start
  // types = [{ label: '请选择订单状态', value: '' }, { label: '自提', value: 0 }, { label: '代运', value: 1 }];
  types = [{ label: '请选择运输类型', value: '' }, { label: '自提', value: 0 }, { label: '代运', value: 1 }, { label: '转货', value: 2 }];
  // 2018.01.11 转货权开发 end

  // 定义status的值
  status = [{ label: '请选择订单状态', value: '' }, { label: '制单中', value: 0 }, { label: '运费核算中', value: 1 },
  { label: '待付款', value: 2 }, { label: '待提货', value: 3 }, { label: '完成', value: 6 }, { label: '取消', value: 7 }, { label: '撤销', value: 8 }];


  // 弹出创建现货销售对话框
  createDialog() {
    this.shengxiaodate = new Date();
    this.clear();
    this.findWiskind();
    this.dantypes = [{ value: '0', label: '甲单' }, { value: '1', label: '乙单' }, { value: '2', label: '丙单' }];
    this.showcreateModal();
  }

  // 弹出创建加工订单对话框
  createProDialog() {
    this.shengxiaodate = new Date();
    this.clear();
    this.findWiskind();
    this.dantypes = [{ value: '0', label: '甲单' }, { value: '1', label: '乙单' }, { value: '2', label: '丙单' }];
    this.showcreateProModal();
  }

  companyOfCode;

  addrs = [];

  // 查找客户的地址
  findAddr() {
    if (this.businessorder['type'] === '1') {// 判断只有是代运的才能加载地址
      let arry = [{ label: '取消', value: '' }];
      this.businessOrderApi.findAddr(this.companyOfCode['code']).then((data) => {
        for (let i = 0; i < data.length; i++) {
          let address = { value: data[i].id, label: data[i].province + data[i].city + data[i].county + data[i].detail };
          arry.push(address);
        }
        this.addrs = arry;
      });
    }
  }

  companyIsWiskind = []
  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({ label: '请选择卖方单位', value: '' })
      this.customerApi.findwiskind().then((response) => {
        for (let i = 1; i < response.length; i++) {
          if (response[i].id === 3453) {
            response.splice(i, 1);
          }
        }
        response.forEach(element => {
          this.companyIsWiskind.push({
            label: element.name,
            value: element.id
          })
        });
        console.log(this.companyIsWiskind);
        // this.companyIsWiskind = response;
      })
    }
  }

  clear() {
    this.businessorder = { 'isself': true, 'isproduct2': false };
    this.addrs = [];
    this.companyOfCode = undefined;
  }

  // 创建
  create() {
    this.businessorder['shengxiaodate'] = this.datepipe.transform(this.shengxiaodate, 'y-MM-dd');
    if (this.businessorder['isproduct2'] === undefined) {
      this.toast.pop('warning', '请选择加工流程！');
      return '';
    }
    if (!this.businessorder['moneytype']) {
      this.toast.pop('warning', '请选择合同生效约定方式！');
      return '';
    }
    if (this.businessorder['type'] === undefined) {
      this.toast.pop('warning', '请选择运输方式！');
      return '';
    }
    if (this.businessorder['dantype'] === undefined) {
      this.toast.pop('warning', '请选择单据类别！');
      return '';
    }
    if (this.businessorder['type'] === '0' && this.businessorder['addrid']) {
      // Notify.alert("自提订单，没有运送地址！", { status: 'warning' });
      this.toast.pop('warning', '自提订单，没有运送地址！');
      return '';
    }
    if (this.businessorder['type'] === '1' && !this.businessorder['addrid']) {
      // Notify.alert("代运订单，请选择你的运送地址！", { status: 'warning' });
      this.toast.pop('warning', '代运订单，请选择你的运送地址！');
      return '';
    }
    if (!this.businessorder['sellerid']) {
      // Notify.alert("请选择卖方所在的单位！", { status: 'warning' });
      this.toast.pop('warning', '请选择卖方所在的单位！');
      return '';
    }
    //    		if($scope.businessorder.isself == 'false' && $scope.businessorder.isproduct2 == 'true') {
    //    			Notify.alert("代销不允许做加工！",{status:'warning'});
    //    			return '';
    //    		}
    console.log(this.companyOfCode);
    if (typeof (this.companyOfCode) === 'string' || !this.companyOfCode) {
      this.businessorder['buyerid'] = null;
      this.toast.pop('warning', '请选择买方单位！');
      return '';
    } else if (typeof (this.companyOfCode) === 'object') {
      this.businessorder['buyerid'] = this.companyOfCode['code'];
    } else {
      this.businessorder['buyerid'] = null;
    }
    if (this.businessorder['buyerid'] === null) {
      this.toast.pop('warning', '请选择买方单位！');
      return '';
    }
    console.log(this.businessorder);
    this.businessOrderApi.create(this.businessorder).then((datas) => {
      // ngDialog.close();
      this.hidecreateModal();
      this.router.navigate(['businessorder', datas['id']]);
      // $state.go('app.businessorder-view', { id: data.id });
    });
  }

  // 创建加工
  createPro() {
    this.businessorder['shengxiaodate'] = this.datepipe.transform(this.shengxiaodate, 'y-MM-dd');
    if (!this.businessorder['moneytype']) {
      this.toast.pop('warning', '请选择合同生效约定方式！');
      return '';
    }
    if (this.businessorder['type'] === undefined) {
      this.toast.pop('warning', '请选择运输方式！');
      // Notify.alert("请选择运输方式！", { status: 'warning' });
      return '';
    }
    if (this.businessorder['type'] === '0' && this.businessorder['addrid']) {
      // Notify.alert("自提订单，没有运送地址！", { status: 'warning' });
      this.toast.pop('warning', '自提订单，没有运送地址！');
      return '';
    }
    if (this.businessorder['type'] === '1' && !this.businessorder['addrid']) {
      this.toast.pop('warning', '代运订单，请选择你的运送地址！');
      // Notify.alert("代运订单，请选择你的运送地址！", { status: 'warning' });
      return '';
    }
    if (!this.businessorder['sellerid']) {
      // Notify.alert("请选择卖方所在的单位！", { status: 'warning' });
      this.toast.pop('warning', '请选择卖方所在的单位！');
      return '';
    }
    if (this.businessorder['dantype'] === undefined) {
      this.toast.pop('warning', '请选择单据类别！');
      return '';
    }
    console.log(this.companyOfCode);
    if (typeof (this.companyOfCode) === 'string' || !this.companyOfCode) {
      this.businessorder['buyerid'] = null;
      this.toast.pop('warning', '请选择买方单位！');
      return '';
    } else if (typeof (this.companyOfCode) === 'object') {
      this.businessorder['buyerid'] = this.companyOfCode['code'];
    } else {
      this.businessorder['buyerid'] = null;
    }
    if (this.businessorder['buyerid'] === null) {
      this.toast.pop('warning', '请选择买方单位！');
      return '';
    }
    this.proOrderApi.create(this.businessorder).then((data) => {
      this.hidecreateProModal();
      // ngDialog.close();
      this.router.navigate(['proorder', data['id']]);
      // $state.go('app.proorder-detail', { id: data.id });
    });
  }

  // 弹出添加地址的对话框

  addr = {};
  provinces = [];
  citys = [];
  countys = [];
  addAddrDialog() {
    if (this.businessorder['type'] == '0') {
      this.toast.pop('warning', '自提的订单无需添加地址^~^');
      // Notify.alert('自提的订单无需添加地址^~^', { status: 'warning' });
      return '';
    }
    if (typeof (this.companyOfCode) === 'string' || !this.companyOfCode) {
      this.search['buyerid'] = '';
      this.toast.pop('warning', '请选择买方所在的公司^~^');
      return '';
    } else if (typeof (this.companyOfCode) === 'object') {
      this.search['buyerid'] = this.companyOfCode['code'];
    }
    this.addr = {};
    this.provinces = [];
    this.citys = [];
    this.countys = [];
    this.showaddrModal();
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
    if (!this.addr['detail']) {
      this.toast.pop('warning', '请填写详细地址！');
      return;
    }
    this.addr['customerid'] = this.companyOfCode['code'];
    this.businessOrderApi.createAddr(this.addr).then((data) => {
      // addrDialog.close();
      this.hideaddrModal();
      this.findAddr();
    });
  }

  // 查询弹窗
  @ViewChild('queryModal') private queryModal: ModalDirective;

  showqueryModal() {
    this.queryModal.show();
  }

  hidequeryModal() {
    this.queryModal.hide();
  }

  // 声明一个业务销售合同对象
  businessorder = { 'isself': true, 'isproduct2': false };

  // 创建现货销售对话框
  @ViewChild('createModal') private createModal: ModalDirective;

  showcreateModal() {
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }

  // 创建加工订单对话框
  @ViewChild('createProModal') private createProModal: ModalDirective;

  showcreateProModal() {
    this.createProModal.show();
  }

  hidecreateProModal() {
    this.createProModal.hide();
  }

  @ViewChild('addrModal') private addrModal: ModalDirective;

  showaddrModal() {
    this.addrModal.show();
  }

  hideaddrModal() {
    this.addrModal.hide();
  }

  /**拷贝订单 */
  copyXianhuo(id) {
    this.orderApi.iscancopyxianhuo({ id: id }).then(res => {
      if (confirm(res['msg'])) {
        this.orderApi.copyxianhuo({ id: id }).then((data) => {
          this.toast.pop('success', '拷贝订单成功！');
          setTimeout(() => {
            this.router.navigate(['businessorder', data['id']]);
          }, 1000);
        });
      }
    });
  }

}
