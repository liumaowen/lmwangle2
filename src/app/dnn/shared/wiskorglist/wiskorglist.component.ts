import { Component, OnInit, Input, Output, EventEmitter , ViewChild} from '@angular/core';
import { UserapiService } from './../../service/userapi.service';
import {OrgApiService} from '../../service/orgapi.service';
import { SelectComponent } from 'ng2-select';

@Component({
  selector: 'wisk-orglist',
  templateUrl: './wiskorglist.component.html',
  styleUrls: ['./wiskorglist.component.scss']
})
export class WiskorglistComponent implements OnInit {

  orgValue;
  @ViewChild('defaultGroup') public ngSelectGroup: SelectComponent;

  @Output() orgChange = new EventEmitter();

  @Input()

  get org(){
    return this.orgValue;
  }
  set org(val){
    this.orgValue = val;
    this.orgChange.emit(this.orgValue);
  }
  orgs: any[];
  constructor(private orgApi: OrgApiService) {
    this.orgApi.listAll(0).then(data => {
      this.orgs = [];
      data.forEach(element => {
        this.orgs.push({
          name: element.name,
          id: element.id
        });
      });
    });
  }

  ngOnInit() {
  }

}
