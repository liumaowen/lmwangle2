import {StorageService} from '../../../../dnn/service/storage.service';
import {ToasterService} from 'angular2-toaster';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap/modal';
import {ClassifyApiService} from '../../../../dnn/service/classifyapi.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {XmdcustomerService} from '../xmdcustomer.service';

@Component({
  selector: 'app-xmdmycustomer',
  templateUrl: './xmdmycustomer.component.html',
  styleUrls: ['./xmdmycustomer.component.scss']
})
export class XmdMycustomerComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;

  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  model = {isonline: 'false'};

  userName;

  current = this.storage.getObject('cuser');

  // 查询数据
  querys: object = {pagenum: 1, pagesize: 10, salemanid: this.current['id']};

  flag = [{label: '请选择', value: ''}, {label: '线上客户', value: true}, {label: '线下客户', value: false}];

  categorys;
  //超期客户
  cqbsModalRef: BsModalRef;

  isimport = {flag: true};

  constructor(private customerApi: XmdcustomerService,
              private storage: StorageService,
              private router: Router,
              private toast: ToasterService,
              private modalService: BsModalService,
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
    });
  }

  // 重置条件
  selectNull() {
    this.querys = {pagenum: 1, pagesize: 10, salemanid: this.current['id']};
    this.userName = undefined;
    this.model = {isonline: 'false'};
  }

  // 弹出创建对话框
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
      return;
    }
    if (!this.model['name']) {
      this.toast.pop('warning', '请输入公司名称');
      return;
    }
    if (this.model['usernature'] == '0' && !this.model['categoryid']) {
      this.toast.pop('warning', '请填写行业类别');
      return;
    }
    if (!this.model['taxno']) {
      this.toast.pop('warning', '请输入纳税人识别号');
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

  // 查询按钮
  queryDialog() {
    this.selectNull();
    this.showclassicModal();
  }

  // 查询方法
  query() {
    if (typeof (this.userName) === 'object') {
      this.querys['salemanid'] = this.userName['code'];
    } else {
      this.querys['salemanid'] = this.current['id'];
    }
    console.log(this.querys);
    this.customerApi.pagelist(this.querys).then((response) => {
      this.querydata();
      this.hideclassicModal();
    });

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
