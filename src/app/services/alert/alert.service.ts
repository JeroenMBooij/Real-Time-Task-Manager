import { Injectable } from '@angular/core';
import { Alert } from '../../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alert: Alert; 
  constructor(){
      this.alert = new Alert();
  }

  public getAlert(){
      return this.alert;
  }

  public setAlert(type: string, message: string){
      this.alert.type = type;
      this.alert.message = message;
  }
}
