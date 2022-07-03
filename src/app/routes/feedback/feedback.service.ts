import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class FeedbackService {
    constructor(private http: Http) { }
    getlist(search): Promise<any> {
        return this.http.get('store/api/feedback/list', {search: search}).toPromise();
    }
    reply(feedback): Promise<any> {
        return this.http.post('store/api/feedback', feedback).toPromise();
    }
}
