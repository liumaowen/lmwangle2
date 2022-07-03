import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { CangkuApiService } from '../cangkuapi.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressparseService } from 'app/dnn/service/address_parse';
const sweetalert = require('sweetalert');
@Component({
  selector: 'app-cangkudetail',
  templateUrl: './cangkudetail.component.html',
  styleUrls: ['./cangkudetail.component.scss']
})
export class CangkudetailComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  gnchandiflag = 0; // 0-出库费添加,1-转货费添加
  @ViewChild('fuzerencreateModal') private fuzerencreateModal: ModalDirective;

  @ViewChild('chukufeecreateModal') private chukufeecreateModal: ModalDirective;

  @ViewChild('zhuanhuofeecreateModal') private zhuanhuofeecreateModal: ModalDirective;

  @ViewChild('guanliancreateModal') private guanliancreateModal: ModalDirective;

  @ViewChild('addModal') private addModal: ModalDirective;

  @ViewChild('addrmodifyModal') private addrmodifyModal: ModalDirective;

  gridOptions: GridOptions;

  gridOptions1: GridOptions;

  gridOptions2: GridOptions;

  gridOptions3: GridOptions;

  results: any;
  model = { user: {} };

  companyOfProduce: any;

  areas = new Array();

  // 省市县
  provinces = [];
  citys = [];
  countys = [];
  provinces1 = [];
  citys1 = [];
  countys1 = [];

  isxieyi = [];
  iszhuanhuo = [];
  cangkutype = [];

  chukufee = {};

  zhuanhuofee = {};
  isinput: Boolean = false;
  // 仓储费核算标准
  storagefeelist: any = []; // 时间范围列表
  mintimes: any = []; // 时间范围最小值
  maxtimes: any = []; // 时间最大值
  // 核算单位
  units = [{ label: '请选择。。。', value: null }, { label: '元/吨/天', value: 1 }, { label: '元/吨/月', value: 2 }];
  storagefee = {};
  settletype: any;

  constructor(public settings: SettingsService,
    private route: ActivatedRoute,
    private toast: ToasterService,
    private router: Router,
    private cangkuApi: CangkuApiService,
    private addressparseService: AddressparseService,
    private classifyApi: ClassifyApiService) {
    console.log(this.route.params['value']['id']);

    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableSorting: true // 排序
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'id', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandiname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '现结费用', field: 'nowfee', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月结费用', field: 'monthfee', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代运现结费用', field: 'nowdaiyunfee', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', width: 90,
        cellRenderer: (params) => '删除',
        onCellClicked: (params) => {
          if (confirm('你确定要删除吗?')) {
            this.classifyApi.deleteChukufee(params.data.id).then(() => {
              this.toast.pop('success', '删除成功！！！');
              this.classifyApi.chukufeeList(this.route.params['value']['id']).then((data) => {
                this.gridOptions.api.setRowData(data);
              });
            });
          }
        }
      }
    ];


    this.gridOptions1 = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableSorting: true// 排序
    };

    this.gridOptions1.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'id', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandiname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '现结费用', field: 'nowfee', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月结费用', field: 'monthfee', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', width: 90,
        cellRenderer: (params) => '删除',
        onCellClicked: (params) => {
          if (confirm('你确定要删除吗?')) {
            this.classifyApi.deleteZhuanhuofee(params.data.id).then((response) => {
              // Notify.alert('删除成功！！！', { status: 'success' });
              this.toast.pop('success', '删除成功！！！');
              this.classifyApi.zhuanhuofeeList(this.route.params['value']['id']).then((response) => {
                this.gridOptions1.api.setRowData(response);
              });
            });
          }
        }
      }
    ];
    this.gridOptions2 = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableSorting: true// 排序
    };

    this.gridOptions2.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'id', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', width: 90,
        cellRenderer: (params) => '删除',
        onCellClicked: (params) => {
          if (confirm('你确定要删除吗?')) {
            this.classifyApi.deleteCangkuCustomer(params.data.id).then((response) => {
              // Notify.alert('删除成功！！！', { status: 'success' });
              this.toast.pop('success', '删除成功！！！');
              this.classifyApi.customerList(this.route.params['value']['id']).then((response) => {
                this.gridOptions2.api.setRowData(response);
              });
            });
          }
        }
      }
    ];

    this.gridOptions3 = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableSorting: true,// 排序
      getContextMenuItems: this.settings.getContextMenuItems,
    };

    this.gridOptions3.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '结算方式', field: 'settletypename', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '添加时间', field: 'cdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '最小时间', field: 'mintime', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '最大时间', field: 'maxtime', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '核算单价', field: 'price', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '核算单位', field: 'unitname', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', width: 90,
        cellRenderer: (params) => '删除',
        onCellClicked: (params) => {
          this.del(params.data.id, 0);
        }
      }
    ];
  }

  ngOnInit() {
    this.getdetail();
    this.getTimeSection();
  }

  getdetail() {
    this.isxieyi = [{ label: '请选择是否' }, { label: '是', value: true }, { label: '否', value: false }];
    this.iszhuanhuo = [{ label: '请选择是否' }, { label: '是', value: true }, { label: '否', value: false }];
    this.cangkutype = [
      { label: '请选择仓库性质' },
      { label: '钢厂库', value: 1 },
      { label: '协议库', value: 2 },
      { label: '第三方非协议库', value: 3 },
    ];
    this.getcangku();
    this.classifyApi.listBypid({ pid: 3814 }).then((data) => {
      const arealist = [{ label: '请选择仓库所在区域', value: '' }];
      data.forEach(element => {
        arealist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.areas = arealist;
    });
    this.classifyApi.chukufeeList(this.route.params['value']['id']).then((response) => {
      this.gridOptions.api.setRowData(response);
      console.log(response);
    });
    this.classifyApi.zhuanhuofeeList(this.route.params['value']['id']).then((response) => {
      this.gridOptions1.api.setRowData(response);
    });
    this.classifyApi.customerList(this.route.params['value']['id']).then((response) => {
      this.gridOptions2.api.setRowData(response);
    });
    this.setgridOptions3(this.route.params['value']['id']);


  }

  setgridOptions3(cangkuid) {
    this.cangkuApi.getStorageFeeList(cangkuid).then((response) => {
      this.gridOptions3.api.setRowData(response);
    });
  }
  getcangku() {
    this.classifyApi.getcangku(this.route.params['value']['id']).then((data: any) => {
      // tslint:disable-next-line:radix
      data.areaid = parseInt(data.areaid);


      this.getProvince1();

      if (null != data['proviceid']) {
        this.classifyApi.getChildrenTree({ pid: data['proviceid'] }).then((data1) => {
          this.citys = [];
          data1.forEach(element => {
            this.citys.push({
              label: element.label,
              value: element.id
            });
          });
          this.classifyApi.getChildrenTree({ pid: data['cityid'] }).then((data2) => {
            this.countys = [];
            data2.forEach(element => {
              this.countys.push({
                label: element.label,
                value: element.id
              });
            });
            this.model = data;
          });
        });

      } else {
        this.model = data;
      }

    });
  }



  suser;

  // 添加负责人
  modifyUser() {
    this.suser = undefined;
    this.showfuzerencreateModal();
  }

  addfuzerencreate() {
    if (typeof (this.suser) === 'object') {
      console.log(this.suser);
      this.model['userid'] = this.suser['code'];
      this.model.user['realname'] = this.suser['name'];
    } else {
      this.toast.pop('warning', '选择人员错误，请重新选择！')
    }
  }

  gns = [];

  chandis = [];

  addchukufeedialog() {
    this.chukufee = {};
    this.gns = [];
    this.chandis = [];
    // 获取品名
    this.classifyApi.listBypid({ pid: 2 }).then((response) => {
      const gnlist = [{ value: '', label: '请选择品名' }];
      response.forEach(element => {
        gnlist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.gns = gnlist;
    });
    this.showchukufeecreateModal();
  }



  getChandiByGn(gnid) {
    // 获取品名
    this.classifyApi.listBypid({ pid: gnid }).then((response) => {
      const chandilist = [{ label: '请选择产地', value: '' }];
      response.forEach(element => {
        chandilist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.chandis = chandilist;
    });
  }

  // 充填
  selectNull() {
    this.chukufee = {};
    this.chandis = [];
    this.chandioptions = [];
  }

  // 添加出库费用
  addchukufee() {
    if (!this.chukufee['gn']) {
      this.toast.pop('warning', '品名不能为空！');
      return;
    }
    if (!this.chukufee['chandiname']) {
      this.toast.pop('warning', '产地不能为空！');
      return;
    }
    if (!this.chukufee['nowfee']) {
      this.toast.pop('warning', '现结费用不能为空！');
      return;
    }
    if (!this.chukufee['monthfee']) {
      this.toast.pop('warning', '月结费用不能为空！');
      return;
    }
    if (!this.chukufee['nowdaiyunfee']) {
      this.toast.pop('warning', '现结代运费用不能为空！');
      return;
    }

    this.chukufee['cangkuid'] = this.route.params['value']['id'];
    console.log(this.chukufee);
    if (confirm('你确定添加吗？')) {
      this.classifyApi.addChukufee(this.chukufee).then(() => {
        this.getdetail();
        this.toast.pop('success', '添加成功！');
        this.hidechukufeecreateModal();
      });
    }
  }

  chukufeeguanlian() {
    if (this.chukufee['nowfee'] === '0') {
      this.isinput = true;
      this.chukufee['nowdaiyunfee'] = '0';
    } else {
      this.isinput = false;
    }
  }
  // 转货权费用添加
  addzhuanhuofeedialog() {
    this.zhuanhuofee = {};
    this.gns = []; this.chandis = [];
    // 获取品名
    // this.classifyApi.listBypid({ pid: 2 }).then((response) => {
    //   const gnlist = [{ label: '', value: '' }];
    //   response.forEach(element => {
    //     gnlist.push({
    //       label: element['name'],
    //       value: element['id']
    //     });
    //   });
    //   this.gns = gnlist;
    // });
    this.showzhuanhuofeecreateModal();
  }

  addzhuanhuofee() {
    if (!this.zhuanhuofee['gn']) {
      this.toast.pop('warning', '品名不能为空！');
      return;
    }
    if (!this.zhuanhuofee['chandiname']) {
      this.toast.pop('warning', '产地不能为空！');
      return;
    }
    if (!this.zhuanhuofee['nowfee']) {
      this.toast.pop('warning', '现结费用不能为空！');
      return;
    }
    if (!this.zhuanhuofee['monthfee']) {
      this.toast.pop('warning', '月结费用不能为空！');
      return;
    }
    this.zhuanhuofee['cangkuid'] = this.route.params['value']['id'];
    console.log(this.zhuanhuofee);
    if (confirm('你确定添加吗？')) {
      this.classifyApi.addZhuanhuofee(this.zhuanhuofee).then(() => {
        this.getdetail();
        this.toast.pop('success', '添加成功！');
        this.hidezhuanhuofeecreateModal();
      });
    }
  }

  // 保存更新
  modifyModel() {
    if (!this.model['areaid']) {
      this.toast.pop('warning', '请填写仓库所在的区域！');
      return;
    }
    this.classifyApi.updatecangku(this.model).then(() => {
      this.toast.pop('success', '更新成功');
      this.router.navigate(['cangku']);
    });
  }

  openCangkuTime() {
    this.router.navigate(['cangku/cangkutime', this.route.params['value']['id']]);
    // $state.go("app.cangkutime", { id: $stateParams.id });
  }

  // 仓库停用
  disable() {
    if (confirm('你确定停用吗？')) {
      this.classifyApi.disable(this.model['id']).then(() => {
        this.getdetail();
        this.toast.pop('success', '停用成功！');
      });
    }
  }

  // 仓库启用
  enable() {
    if (confirm('你确定启用吗？')) {
      this.classifyApi.enable(this.model['id']).then(() => {
        this.getdetail();
        this.toast.pop('success', '启用成功！');
      });
    }
  }
  addguanliancreate() {
    if (!this.companyOfProduce['code']) {
      this.toast.pop('warning', '请选择关联公司');
      return;
    }
    this.classifyApi.createGuanlian(this.companyOfProduce['code'], this.route.params['value']['id']).then(data => {
      this.toast.pop('success', '创建成功');
      this.hideguanliancreateModal();
      this.classifyApi.customerList(this.route.params['value']['id']).then((response) => {
        this.gridOptions2.api.setRowData(response);
      });
    })
  }

  showfuzerencreateModal() {
    this.fuzerencreateModal.show();
  }

  hidefuzerencreateModal() {
    this.fuzerencreateModal.hide();
  }

  showchukufeecreateModal() {
    this.chukufeecreateModal.show();
  }

  hidechukufeecreateModal() {
    this.chukufeecreateModal.hide();
  }

  showzhuanhuofeecreateModal() {
    this.zhuanhuofeecreateModal.show();
  }

  hidezhuanhuofeecreateModal() {
    this.zhuanhuofeecreateModal.hide();
  }

  addguanliandialog() {
    this.guanliancreateModal.show();
  }

  hideguanliancreateModal() {
    this.guanliancreateModal.hide();
  }

  // 添加仓储费
  showaddmodal() {
    this.settletype = this.model['settletype'];
    this.getStorageFeeList();
    this.addModal.show();
  }
  hideaddModal() {
    this.addModal.hide();
  }
  add() {
    if (this.settletype === null || this.settletype === undefined) {
      this.toast.pop('warning', '请选择结算方式!');
      return;
    }
    const isall = this.storagefeelist.some(storagefee =>
      !storagefee['mintime'] ||
      !storagefee['maxtime'] ||
      storagefee['price'] === null ||
      storagefee['price'] === undefined ||
      !storagefee['unit']);
    if (isall) {
      this.toast.pop('warning', '请把仓储费填写完成!');
      return;
    }
    this.storagefee['storagefeelist'] = this.storagefeelist;
    this.storagefee['cangkuid'] = this.model['id'];
    this.storagefee['settletype'] = this.settletype;
    this.cangkuApi.create(this.storagefee).then(data => {
      this.toast.pop('success', '创建成功！');
      this.hideaddModal();
      this.getcangku();
      this.setgridOptions3(this.model['id']);
    });
  }

  addstoragefee() {
    if (this.storagefeelist.length && this.storagefeelist[0]['unit'] !== undefined && this.storagefeelist[0]['unit'] !== null) {
      this.storagefeelist.push({ unit: this.storagefeelist[0]['unit'] })
    } else {
      this.storagefeelist.push({});
    }
  }

  getTimeSection() {
    this.cangkuApi.getTimeSection().then(data => {
      data['mintimes'].forEach(mintime => {
        this.mintimes.push({ label: mintime, value: mintime });
      });
      data['maxtimes'].forEach(maxtime => {
        this.maxtimes.push({ label: maxtime, value: maxtime });
      });
    });
  }
  // 删除时间范围
  deletestoragefee(i) {
    this.storagefeelist.splice(i, 1);
  }

  /**后台删除区间 */
  del(id, i) {
    sweetalert({
      title: '你确定要删除吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.cangkuApi.delstoragefee(id).then(data => {
        this.toast.pop('success', '删除成功！');
        this.getStorageFeeList();
        if (data) {
          this.setgridOptions3(this.model['id']);
        }
        sweetalert.close();
      });
    });
  }

  // 获取仓储费核算列表
  getStorageFeeList() {
    this.cangkuApi.getStorageFeeList(this.model['id']).then(data => {
      this.storagefeelist = [];
      this.storagefeelist = data;
      if (!this.storagefeelist.length) {
        this.addstoragefee();
      }
    });
  }

  getProvince1() {
    this.provinces = [];
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys = [];
      this.countys = [];
    });
  }

  getcity1() {
    this.citys = [];
    delete this.model['cityid'];
    delete this.model['countyid'];
    this.classifyApi.getChildrenTree({ pid: this.model['proviceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
        console.log(element.label)
      });

      this.countys = [];
    });
  }

  getcounty1() {
    this.countys = [];
    delete this.model['countyid'];
    this.classifyApi.getChildrenTree({ pid: this.model['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }

  getProvince() {
    this.provinces1 = [];
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces1.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys1 = [];
      this.countys1 = [];
    });
  }
  getcity() {
    this.citys1 = [];
    delete this.model['startcityid'];
    delete this.model['startcountyid'];
    this.classifyApi.getChildrenTree({ pid: this.model['startprovinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys1.push({
          label: element.label,
          value: element.id
        });
      });

      this.countys1 = [];
    });
  }

  getcounty() {
    this.countys1 = [];
    delete this.model['startcountyid'];
    this.classifyApi.getChildrenTree({ pid: this.model['startcityid'] }).then((data) => {
      data.forEach(element => {
        this.countys1.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }

  addrmodifydialog() {
    this.getProvince();
    this.addrmodifyModal.show();
  }
  hideaddrmodifydialog() {
    this.addrmodifyModal.hide();
  }
  // 增加腾讯地图地址自动补充
  searchplace(e) {
    this.classifyApi.getSuggestionPlace(e.query).then(data => {
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.address + '\r\n' + element.title,
          code: element
        });
      });
    });
  }
  modifyaddr() {
    if (!this.model['detail']) {
      this.toast.pop('warning', '请填写仓库地址！');
      return;
    }
    this.model['detail']['proviceid'] = this.model['startprovinceid'];
    this.model['detail']['cityid'] = this.model['startcityid'];
    this.model['detail']['countryid'] = this.model['startcountyid'];
    if (confirm('确定要修改仓库地址吗？')) {
      this.classifyApi.updatecangkuaddr(this.model['id'], this.model['detail']).then(data => {
        this.toast.pop('success', '修改成功');
        this.getdetail();
        this.hideaddrmodifydialog();
      });

    }
  }

  selectedaddress(destination) {
    console.log('#########', destination);
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys1 = []; this.countys1 = [];
      this.model['startprovinceid'] = '';
      this.model['startcityid'] = '';
      this.model['startcountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.model['startprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.model['startprovinceid'], this.citys1).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.model['startcityid'] = addressObj['cityValue'];
                this.getpcc(this.model['startcityid'], this.countys1).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.model['startcountyid'] = addressObj['countyValue'];
                      }
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }
  getpcc(pid, pccname: any[]) {
    return new Promise((resolve: (data) => void) => {
      this.classifyApi.getChildrenTree({ pid: pid }).then((data) => {
        data.forEach(element => {
          pccname.push({
            label: element.label,
            value: element.id + ''
          });
        });
        resolve(pccname);
      });
    });
  }
  showselectgn(flag) {
    this.gnchandiflag = flag;
    this.mdmgndialog.show();
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi') {
        this.chandioptions = element['options'];
        this.chandioptions.unshift({ value: '', label: '全部' });
        break;
      }
    }
    if (this.gnchandiflag === 1) {
      this.zhuanhuofee['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.zhuanhuofee['chandiname'] = this.chandioptions[this.chandioptions.length - 1]['value'];
      }
    } else {
      this.chukufee['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.chukufee['chandiname'] = this.chandioptions[this.chandioptions.length - 1]['value'];
      }
    }
  }


}
