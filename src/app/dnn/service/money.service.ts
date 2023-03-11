import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

@Injectable()
export class MoneyService {

  constructor(private http:Http) { }

  getmoney(moneyquery):Promise<any>{
    return this.http.get("store/app/usermoney/moneydet",{search:moneyquery}).toPromise().then(data=>{
      return data.json() as any[];
    })
  }

}
