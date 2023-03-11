import {Component, Input, OnInit, Output,EventEmitter} from '@angular/core';
import {UserapiService} from "../../service/userapi.service";
@Component({
  selector: 'app-wiskinnercompany',
  templateUrl: './wiskinnercompany.component.html',
  styleUrls: ['./wiskinnercompany.component.scss']
})
export class WiskinnercompanyComponent implements OnInit {
  value;
  @Input() isdisabled = false;
  @Output()
  wiskindcompany = new EventEmitter();
  @Output()
  change = new EventEmitter();
  @Input()
  get selectedCompany(): any {
    return this.value;
  }
  set selectedCompany(val) {
    this.value = val;
    this.wiskindcompany.emit(this.value);
  }

  companychange(event){
    this.change.emit(event);
  }
  innercompanys:Array<any>;
  constructor(private userapi:UserapiService) {
    this.innercompanys = [{id:'',name:'全部'}];
    this.userapi.findwiskind().then((data)=>{
      data.forEach((element) => {
        this.innercompanys.push({
          id: element['id'],
          name: element['name']
        })
      });
    })
  }

  ngOnInit() {
  }

}
