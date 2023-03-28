import {Router} from '@angular/router';
import {ToasterService} from 'angular2-toaster/angular2-toaster';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ClassifyApiService} from '../../../../dnn/service/classifyapi.service';
import {XmdcustomerService} from '../xmdcustomer.service';

@Component({
  selector: 'app-xmdcustomer',
  templateUrl: './xmdcustomer.component.html',
  styleUrls: ['./xmdcustomer.component.scss']
})
export class XmdCustomerComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  // 查询数据
  querys: object = {pagenum: 1, pagesize: 10, isonline: 'false'};

  suser;

  userName;

  model = {isonline: 'false'};

  categorys;

  constructor(private customerApi: XmdcustomerService,
              private toast: ToasterService,
              private router: Router,
              private classifyApi: ClassifyApiService) {
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
    this.customerApi.pagelist(this.querys).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = data.json();
      console.log('xxx');
      console.log(this.tableData);
    });
  }

  queryDialog() {
    this.selectNull();
    this.showclassicModal();
  }

  selectNull() {
    this.querys = {pagenum: 1, pagesize: 10, isonline: 'false'};
    this.suser = undefined;
    this.model = {isonline: 'false'};

  }

  query() {
    if (typeof (this.userName) === 'object') {
      this.querys['salemanid'] = this.userName['code'];
    } else {
      this.querys['salemanid'] = '';
    }
    console.log('this.querys', this.querys);
    this.querydata();
    this.hideclassicModal();
  }

  createDialog() {
    this.model = {isonline: 'false'};
    this.classifyApi.listBypid({pid: 4346}).then((data) => {
      const categorylist = [{label: '请选择行业类别', value: ''}];
      data.forEach(element => {
        categorylist.push({
          label: element.name,
          value: element.id
        });
      });
      this.categorys = categorylist;
    });
    this.showcreateModal();
  }

  // 执行添加操作
  addCustomer() {
    if (!this.model['usernature']) {
      this.toast.pop('warning', '请填写用户性质');
      // Notify.alert('请填写用户性质', { status: 'warning' });
      return;
    }
    if (!this.model['name']) {
      this.toast.pop('warning', '请输入公司名称');
      return;
    }
    if (this.model['usernature'] == '0' && !this.model['categoryid']) {
      this.toast.pop('warning', '请填写行业类别');
      // Notify.alert('请填写行业类别', { status: 'warning' });
      return;
    }
    if (!this.model['taxno']) {
      this.toast.pop('warning', '请输入纳税人识别号');
      return;
    }
    if (this.model['taxno'].length < 18) {
      this.toast.pop('warning', '输入的纳税人识别号必须大于18位');
      return;
    }
    if (confirm('确定要添加')) {
      this.customerApi.createCustomer(this.model).then((data) => {
        this.hidecreateModal();
        this.router.navigate(['xmdcustomer', data['id'], 'certmanagement']);
        this.toast.pop('success', '创建成功');
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
}
