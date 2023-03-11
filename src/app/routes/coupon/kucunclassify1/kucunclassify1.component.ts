import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-kucunclassify1',
  templateUrl: './kucunclassify1.component.html',
  styleUrls: ['./kucunclassify1.component.scss']
})
export class Kucunclassify1Component implements OnInit {

  @ViewChild('modifyModal') modifyModal: ModalDirective;
  classifylist = [];
  classify = {};
  constructor(public classifyapi: ClassifyApiService, private toast: ToasterService) {
    this.getclassify();
  }

  ngOnInit() {
  }
  getclassify() {
    this.classifyapi.listBypid({ pid: 13660 }).then(data => {
      this.classifylist = data;
    });
  }
  modify(item) {
    this.classify = item;
    this.modifyModal.show();
  }
  mod() {
    console.log(this.classify);
    if (null === this.classify['value']) {
      this.toast.pop('warning', '请填写吨位!');
      return;
    }
    if (0 === this.classify['value']) {
      this.toast.pop('warning', '吨位不能为零!');
      return;
    }
    this.classifyapi.updatekucunclassify(this.classify).then(data => {
      this.toast.pop('success', '吨位设置成功!');
      this.getclassify();
      this.close();
    });
  }
  close() {
    this.modifyModal.hide();
  }
}
