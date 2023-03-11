import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

@Injectable()
export class NavapiService {

  constructor(private http:Http) { }
  // getCode(username:string):Promise<any>{

  mynav(version):Promise<any>{
      return this.http.get("store/api/nav/mynav",{search: version}).toPromise().then(data=>{
          return data.json() as any[];
      })
  }

}
