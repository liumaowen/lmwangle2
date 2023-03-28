import {ToasterService} from 'angular2-toaster';
import {ModalDirective} from 'ngx-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {XmdcustomerService} from '../../xmdcustomer.service';

@Component({
  selector: 'app-xmdcertmanagement',
  templateUrl: './xmdcertmanagement.component.html',
  styleUrls: ['./xmdcertmanagement.component.scss']
})
export class XmdCertmanagementComponent implements OnInit {
  start: Date;
  end: Date;
  isvalid: false;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('uploadModal') private uploadModal: ModalDirective;

  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  querys = {pagenum: 1, pagesize: 10};

  certificate: any = {};
  uploadParam = {module: 'ruku', count: 1, sizemax: 10, extensions: ['tiff', 'pdf', 'jpeg', 'png', 'jpg']};
  // 设置上传文件类型
  accept = '.jpeg, image/jpeg ,application/pdf,image/tiff,image/png';

  constructor(private customerApi: XmdcustomerService,
              private toast: ToasterService,
              private route: ActivatedRoute,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.querydata();
  }

  addzixin() {
    this.certificate = {};
    this.start = null;
    this.end = null;
    this.certificate['isvalid'] = false;
    this.showclassicModal();
  }

  // 创建资信评价
  save() {

    if (!this.certificate['title']) {
      this.toast.pop('warning', '证件名称不能为空！');
      return;
    }
    if (this.certificate['isvalid']) {
      if (!this.start) {
        this.toast.pop('warning', '开始时间不能为空！');
        return;
      }
      this.certificate['start'] = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      this.certificate['end'] = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      if (!this.end && (new Date(this.certificate['start']).getTime() === new Date(this.certificate['end']).getTime())) {
        this.toast.pop('warning', '结束时间不能等于开始时间！');
        return;
      }
      if (!this.end && (new Date(this.certificate['start']).getTime() > new Date(this.certificate['end']).getTime())) {
        this.toast.pop('warning', '结束时间必须大于开始时间！');
        return;
      }
    }
    this.certificate['customerid'] = this.route.parent.params['value']['id'];
    this.uploadModal.show();
    this.uploadModal.config.ignoreBackdropClick = true;
  }

  // 查询时序表数据
  querydata() {
    this.querys['customerid'] = this.route.parent.params['value']['id'];
    this.customerApi.getcertificatelist(this.querys).then(data => {
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
    this.classicModal.config.ignoreBackdropClick = true;
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  // 点击上传执行的回调函数
  uploads($event) {
    const addData = {
      url: [$event.url], title: this.certificate.title,
      start: this.certificate['start'], end: this.certificate['end'], customerid: this.certificate['customerid'],
      isvalid: this.certificate['isvalid']
    };
    if ($event.length !== 0) {
      this.customerApi.createcertificate(addData).then(data => {
        this.hideclassicModal();
        this.hideDialog();
        this.querydata();
      });
    }
  }

  // 关闭上传弹窗
  hideDialog() {
    this.uploadModal.hide();
  }

  delete(id) {
    this.customerApi.delcertificatelist(id).then(data => {
      this.toast.pop('success', '删除成功');
      this.querydata();
    });
  }

  titletypes: any = [{value: '', label: '请选择证件名称'}, {value: '合作期限', label: '合作期限'},
    {value: '营业执照', label: '营业执照'}, {value: '道路运输许可证', label: '道路运输许可证'}, {value: '授权委托函', label: '授权委托函'},
    {value: '打款资料', label: '打款资料'}];
}
