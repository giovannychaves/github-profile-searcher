import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RequestOptions } from 'src/app/models/http.model';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(private http: HttpClient) { }

  get<T>(url: string, options?: RequestOptions): Observable<HttpEvent<T>> {
    return this.http.get<T>(url, this.getRequestOptions(options));
  }

  // post<T>(url: string, body: any | null, options?: RequestOptions): Pro<T> {
  //   return this.http.post<T>(url, body, this.getRequestOptions(options));
  // }

  private getRequestOptions(options?: RequestOptions): any {
    let requestOptions: any = {};
    if (options) {
      if (options.headers) {
        requestOptions.headers = new HttpHeaders(options.headers);
      }
      if (options.params) {
        requestOptions.params = new HttpParams({ fromObject: options.params });
      }
    }
    return requestOptions;
  }
}