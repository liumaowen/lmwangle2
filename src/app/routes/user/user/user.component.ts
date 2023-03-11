import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { BusinessorderapiService } from 'app/routes/businessorder/businessorderapi.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;

  @ViewChild('createModal') private createModal: ModalDirective;

  @ViewChild('registerModal') private registerModal: ModalDirective;

  @ViewChild('addrcreateModal') private addrcreateModal: ModalDirective;

  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  // 查询数据
  querys: object = { pagenum: 1, pagesize: 10, wiskind: true, useing: true };

  activating = false;

  model = {};

  suser = {};

  companys = {};

  constructor(private userApi: UserapiService,
    private toast: ToasterService,
    private classifyApi: ClassifyApiService,
    private router: Router,
    private businessOrderApi: BusinessorderapiService,
    private orgApi: OrgApiService) {
    this.querydata();
  }

  ngOnInit() {
  }

  // 分页点击查询数据
  pageChanged(event) {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.querydata();
  }

  // 查询时序表数据
  querydata() {
    this.userApi.query(this.querys).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = data.json();
    });
  }

  // 重置条件
  selectNull() {
    this.querys = { pagenum: 1, pagesize: 10, wiskind: true, useing: true };
    this.suser = {};
    this.companys = undefined;
    this.model = {};
  }

  flag = { use: true };
  // 启动查询对话框
  queryDialog() {
    this.flag = { use: true };
    this.showclassicModal();
  }

  iswiskind() {
    if (!this.querys['wiskind']) {
      this.flag.use = false;
    } else {
      this.flag.use = true;
    }
  }

  // 查询
  query() {
    console.log(this.querys);
    this.querys['pagenum'] = 1;
    this.querydata();
    this.hideclassicModal();
  }

  // 启动添加对话框
  createDialog() {
    // 获取机构列表
    this.model = {};
    this.companys = undefined;
    this.showcreateModal();
  }

  // 添加用户
  addUser() {
    if (!this.model['phone']) {
      this.toast.pop('warning', '请填写手机号！');
      return;
    }
    if (!this.model['realname']) {
      this.toast.pop('warning', '请填写姓名！');
      return;
    }
    if (!this.model['name']) {
      this.toast.pop('warning', '请填写用户名！');
      return;
    }
    if (!this.model['dingid']) {
      this.toast.pop('warning', '请填写钉钉ID！');
      return;
    }
    if (!this.model['orgid']) {
      this.toast.pop('warning', '请选择机构！');
      return;
    }
    if (typeof (this.companys) === 'object') {
      this.model['kehuid'] = this.companys['code'];
    } else {
      this.model['kehuid'] = '';
      this.toast.pop('warning', '请选择所属公司！');
      return;
    }

    if (confirm('确定要添加')) {
      this.userApi.create(this.model).then(() => {
        this.router.navigateByUrl('user');
        this.toast.pop('success', '添加成功');
        this.querys['pagenum'] = 1;
        this.querydata();
        this.hidecreateModal();
      });
    }
  }

  categorys = [];

  // 注册用户对话框
  registerDialog() {
    this.model = {};
    this.classifyApi.listBypid({ pid: 4346 }).then((data) => {
      const categorylist = [{ label: '请选择行业类别', value: '' }];
      console.log(data);
      data.forEach(element => {
        categorylist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.categorys = categorylist;
    });
    this.showregisterModal();
  }

  addr = {};
  provinces = [];
  citys = [];
  countys = [];

  // 弹出添加地址的对话框
  addAddrDialog() {
    this.addr = {};
    this.provinces = [];
    this.citys = [];
    this.countys = [];
    this.showaddrcreateModal();
    this.getProvince();
  }

  getProvince() {
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

  getcity() {
    this.citys = [];
    this.classifyApi.get(this.addr['provinceid']).then((data) => {
      this.provincelabel = data.json().name;
    });
    this.classifyApi.getChildrenTree({ pid: this.addr['provinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }

  citylabel;

  getcounty() {
    this.countys = [];
    this.classifyApi.get(this.addr['cityid']).then((data) => {
      this.citylabel = data.json().name;
    });
    this.classifyApi.getChildrenTree({ pid: this.addr['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }

  countylabel;
  provincelabel;

  // 开始往数据库中添加内容
  addAddr() {
    this.classifyApi.get(this.addr['countyid']).then((data) => {
      this.countylabel = data.json().name;
      this.model['maddress'] = this.provincelabel + this.citylabel + this.countylabel + this.addr['detail'];
      this.hideaddrcreateModal();
    });
  }

  // 注册用户
  registerUser() {
    if (!/^[0-9]*$/.test(this.model['phone'])) {
      this.toast.pop('warning', '请正确填写手机号！');
      return;
    }
    if (!this.model['realname']) {
      this.toast.pop('warning', '请填写姓名！');
      return;
    }
    if (!/^[\u4e00-\u9fa5\·]{1,10}$/.test(this.model['realname'])) {
      this.toast.pop('warning', '姓名只能填写汉字');
      return;
    }
    if (!this.model['name']) {
      this.toast.pop('warning', '请填写姓名全拼！');
      return;
    }
    if (!this.model['company']) {
      this.toast.pop('warning', '请填写公司名称！');
      return;
    }
    if (this.model['usernature'] == undefined) {
      this.toast.pop('warning', '请填写用户性质');
      // Notify.alert('请填写用户性质', { status: 'warning' });
      return;
    }
    if (this.model['usernature'] == '0' && !this.model['categoryid']) {
      this.toast.pop('warning', '请填写行业类别');
      return;
    }
    if (!this.model['address']) {
      this.toast.pop('warning', '请填写公司地址！');
      return;
    }
    if (!this.model['contactway']) {
      this.toast.pop('warning', '请填写公司电话！');
      return;
    }
    if (!this.model['kaihubank']) {
      this.toast.pop('warning', '请填写开户银行！');
      return;
    }
    if (!this.model['kaihuaccount']) {
      this.toast.pop('warning', '请填写银行账号！');
      return;
    }
    if (!this.model['shuihao']) {
      this.toast.pop('warning', '请填写公司税号！');
      return;
    }
    if (confirm('确定要注册吗？')) {
      this.userApi.register(this.model).then((data) => {
        this.addr['customerid'] = data.json().id;
        this.addr['ismailaddr'] = true;
        if (this.addr['provinceid']) {
          this.businessOrderApi.createAddr(this.addr).then((res) => {
            // $state.go('app.customer-view', { id: data.id });
            this.router.navigate(['customer', data.json()['id']]);
          });
        } else {
          this.router.navigate(['customer', data.json()['id']]);
        }
      });

    }
  }


  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  showcreateModal() {
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }

  showregisterModal() {
    this.registerModal.show();
  }

  hideregisterModal() {
    this.registerModal.hide();
  }

  showaddrcreateModal() {
    this.addrcreateModal.show();
  }

  hideaddrcreateModal() {
    this.addrcreateModal.hide();
  }

}
