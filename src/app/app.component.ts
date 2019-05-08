import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent {
  title = 'project';
  constructor(){}
  

  logout(){
    var logs= JSON.parse(localStorage.getItem("login"));
    logs.loggedin=false;
    
    localStorage.setItem("login", JSON.stringify(logs));
    
  }
}
