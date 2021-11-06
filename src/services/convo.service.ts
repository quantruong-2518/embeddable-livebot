import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface IGuestConvo {
  guest: {
    fullname: string;
    phone: number;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ConvoService {
  constructor(private _http: HttpClient) {}

  createConvo(user: IGuestConvo) {
    return this._http.post(`${environment.domain}/api/v1/conversations`, user);
  }
}
