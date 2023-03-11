import { QualityService } from './../quality.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-quality-detail',
  templateUrl: './quality-detail.component.html',
  styleUrls: ['./quality-detail.component.scss']
})
export class QualityDetailComponent implements OnInit {
  @ViewChild('logdialog') private logdialog: ModalDirective;
  qualityid;
  quality = {};
  loglist = [];
  list = [];
  deal = {deal: '', id: ''};
  log = {msg: '', qualityid: ''};
  imgs = [];
  constructor(private toast: ToasterService, private router: Router, private qualityApi: QualityService,
    private route: ActivatedRoute) {
    this.qualityid = this.route.params['value']['id'];
    this.deal.id = this.route.params['value']['id'];
    this.log.qualityid = this.route.params['value']['id'];
    this.getdetail();
  }

  ngOnInit() {
  }
  // 获取详情
  getdetail() {
    this.qualityApi.getdetail(this.qualityid).then(data => {
      // console.log(data);
      this.quality = data.quality;
      this.deal.deal = this.quality['deal'];
      this.list = data.list;
      this.loglist = data.loglist;
      this.imgs = data.quality.fujian.split('#');
    });
  }
  // 打印预览
  print() {
    this.qualityApi.print(this.qualityid).then(data => {
      if (!data['flag']) {
        this.toast.pop('warning', data['msg']);
      } else {
        window.open(data['msg']);
      }
    });
  }
  modifydeal() {
    if (this.quality['deal'] !== this.deal.deal) {
      this.deal.deal = this.quality['deal'];
      this.qualityApi.modifydeal(this.deal).then(data => {
        this.getdetail();
      });
    }
  }
  pushlog() {
    if (!this.log.msg || this.log.msg === '') {
      this.toast.pop('warning', '意见不能为空');
      return;
    }
    this.qualityApi.publish(this.log).then(data => {
      this.log.msg = '';
      this.closelogdialog();
      this.getdetail();
    });
  }
  openlog() {
    this.logdialog.show();
  }
  closelogdialog() {
    this.logdialog.hide();
  }
  makePDF() {
    this.qualityApi.makepdf(this.qualityid).then(data => {
      this.toast.pop('success', '正在生成，等待几秒后，请重新打印预览！······');
    });
  }
}
