import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NodeserviceService {

  constructor(private _http :HttpClient) { }

  

  creatUser(body:any){
        console.log("in service "+body);
    return this._http.post('http://localhost:8081/register',body)
  }
  
  loginUser(body:any){
    console.log("in service "+body);
    return this._http.post('http://localhost:8081/login',body)
  }

  addProjectserv(body:any){
    console.log("in service "+body);
    return this._http.post('http://localhost:8081/api/addProject',body)
  }

  addReadingserv(body:any){
    console.log("in service "+body);
    return this._http.post('http://localhost:8081/api/addReading',body)
  }
  addVehicleserv(body:any){
    console.log("in service "+body);
    return this._http.post('http://localhost:8081/api/addVehicle',body)
  }
  


  getVehicleData(){
    return this._http.get('http://localhost:8081/api/getVehicle')
  }

  getVehiclesData(){
    return this._http.get('http://localhost:8081/api/getVehicles')
  }

  getRecords(){
    return this._http.get('http://localhost:8081/api/getRecords')
  }

  getLastRecord(body:any){
    console.log("in nodeservice :"+ body);
    return this._http.get('http://localhost:8081/api/getLastRecord?vhn='+body)
  }
  

}
