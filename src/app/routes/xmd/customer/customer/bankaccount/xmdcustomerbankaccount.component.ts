import {ToasterService} from 'angular2-toaster';
import {ModalDirective} from 'ngx-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {XmdcustomerService} from '../../xmdcustomer.service';
import {XmdreceiveapiService} from '../../../receive/xmdreceive.service';

@Component({
  selector: 'app-xmdcustomerbankaccount',
  templateUrl: './xmdcustomerbankaccount.component.html',
  styleUrls: ['./xmdcustomerbankaccount.component.scss']
})
export class XmdCustomerbankaccountComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('updateModal') private updateModal: ModalDirective;

  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  querys = {pagenum: 1, pagesize: 10};

  bank = {};

  constructor(private customerApi: XmdcustomerService,
              private receiveApi: XmdreceiveapiService,
              private toast: ToasterService,
              private route: ActivatedRoute) {
    this.querydata();
  }

  ngOnInit() {
  }

  addBankaccount() {
    this.showclassicModal();
  }

  // 创建付款银行信息
  addbankaccount() {
    this.bank['customerid'] = this.route.parent.params['value']['id'];
    this.receiveApi.createbankaccount(this.bank).then(() => {
      // ngDialog.close();
      this.hideclassicModal();
      this.toast.pop('success', '账户创建成功');
      // Notify.alert("账户创建成功", { status: 'success' });
      // 执行刷新
      // $scope.tableParams.reload();
      this.querydata();
    });
  }

  // 查询时序表数据
  querydata() {
    this.customerApi.getBaccount(this.route.parent.params['value']['id']).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = data.json();
    });
  }

  // 分页点击查询数据
  pageChanged(event) {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.querydata();
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  showupdateModel(id) {
    this.bank['id'] = id;
    this.updateModal.show();
  }

  hideupdateModal() {
    this.updateModal.hide();
  }

  update() {
    this.customerApi.updtebank(this.bank).then(data => {
      this.toast.pop('success', '修改成功');
      this.querydata();
      this.hideupdateModal();
    });
  }

  delete(id) {
    if (confirm('你确定要删除吗？')) {
      this.customerApi.deletebank(id).then(data => {
        this.toast.pop('success', '删除成功');
        this.querydata();
      });
    }
  }


}
