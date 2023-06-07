import { HttpClient } from '@angular/common/http';
import { IUser } from './app.interfaces';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  url = 'http://localhost:4201/api/user';

  constructor(
    private http: HttpClient,
  ) { }

  get() {
    return this.http.get<IUser[]>(this.url);
  }

  post(data: IUser) {
    console.log(data);

    return this.http.post(this.url, data);
  }

  put(data: IUser) {
    return this.http.put(this.url + '/' + data._id, data);
  }

  delete(id: string) {
    return this.http.delete(this.url + '/' + id);
  }
}
