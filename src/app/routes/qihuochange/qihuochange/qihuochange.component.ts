import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Router } from '@angular/router';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { DatePipe } from '@angular/common';
import { SettingsService } from 'app/core/settings/settings.service';
import { QihuochangeService } from '../qihuochange.service';

@Component({
  selector: 'app-qihuochange',
  templateUrl: './qihuochange.component.html',
  styleUrls: ['./qihuochange.component.scss']
})
export class QihuochangeComponent implements OnInit {
  qihuobillno;
  @ViewChild('qihuochangedialog') private qihuochangedialog: ModalDirective;
  constructor(
    public settings: SettingsService,
    private toast: ToasterService,
    private router: Router,
    private changeApi: QihuochangeService) { }

  ngOnInit() {
  }
  createdialog() {
    this.qihuochangedialog.show();
  }
  createclose() {
    this.qihuochangedialog.hide();
  }
  createqihuochange() {
    this.changeApi.createqihuochange(this.qihuobillno).then(data => {
      console.log(data['_body']);
      //跳转至期货变更明细页面
      this.router.navigate(['qihuochange', data['_body']]);
    });
    console.log(this.qihuobillno);
  }
}
