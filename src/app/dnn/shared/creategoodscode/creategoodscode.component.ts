import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MdmService } from 'app/routes/mdm/mdm.service';
import { MdmselectgnComponent } from '../mdmselectgn/mdmselectgn.component';

@Component({
  selector: 'create-goodscode',
  templateUrl: './creategoodscode.component.html',
  styleUrls: ['./creategoodscode.component.scss'],
  providers: [MdmService, BsModalRef]
})
export class CreategoodscodeComponent implements OnInit {
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  search = {itemname: '',itemcode: ''};
  gnData: any = [];
  attrs: any = [];
  showGuige = false;
  goodscode: any = {};
  @Output() public selectgoodscode = new EventEmitter<any>();
  gnbsModalRef: BsModalRef;
  constructor(
    public settings: SettingsService,
    public mdmService: MdmService,
    private toast: ToasterService,
    private modalService: BsModalService,) {
  }

  ngOnInit() {
  }
  showmdmgn() {
    this.modalService.config.class = 'modal-lg';
    this.gnbsModalRef = this.modalService.show(MdmselectgnComponent);
    this.gnbsModalRef.content.parent = this;
  }
  show() {
    this.mdmgndialog.show();
    this.modalService.setScrollbar();
  }
  closedmdmgndialog() {
    this.mdmgndialog.hide();
  }
  getMdmgn() {
    this.mdmService.gnMdmgn(this.search).then(data => {
      this.gnData = data;
    });
  }
  getattr(json) {
    console.log(json);
    this.gnbsModalRef.hide();
    setTimeout(() => {
      this.showGuige = true;
      this.attrs = json['attrs'];
      this.goodscode = json['goodscode'];
    }, 2000);
  }
  closedgnbsModalRef() {
    this.gnbsModalRef.hide();
    this.gnbsModalRef = null;
  }
  creategoogscode() {
    const itemcodes = [];
    this.gnData.forEach(item => {
      if (item.checked) {
        itemcodes.push(item);
      }
    });
    if (itemcodes.length === 1) {
      this.mdmService.getMdmAttributeDic({ itemcode: itemcodes[0].itemcode }).then(data => {
        this.goodscode['mat_itemname'] = itemcodes[0].itemname;
        this.goodscode['mat_itemname_id'] = itemcodes[0].itemcode;
        this.goodscode['category_desc'] = itemcodes[0].categorydesc;
        this.goodscode['category_code'] = itemcodes[0].categorycode;
        this.closedmdmgndialog();
        this.showGuige = true;
        this.attrs = data;
      });
    } else {
      this.toast.pop('warning', '请选择一条记录！');
    }
  }
  savegoodcode() {
    for (let index = 0; index < this.attrs.length; index++) {
      const attrjson = this.attrs[index];
      if (attrjson.isrequired) {
        if (!this.goodscode[attrjson.value]){
          this.toast.pop('warning', '请选择'+attrjson.name+'！');
          return;
        }
      }
    }
    this.selectgoodscode.emit(this.goodscode);
  }
}
