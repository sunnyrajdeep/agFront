import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NodeserviceService } from '../nodeservice.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [NodeserviceService],
  
})
export class LoginComponent implements OnInit {
  successMsg;
  Userform: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private nodeserver:NodeserviceService,  
    private router: Router,
    private activatedRoute: ActivatedRoute) {

     this.Userform = this.fb.group({
        'email':['',Validators.required],
        'password': ['',Validators.required]
     });
   }

  checkLogin(){
    if(localStorage.login){
      var logs= JSON.parse(localStorage.getItem("login"));
      //console.log(logs);
      if(logs.loggedin===true){
        //console.log(logs);
        alert("logged in")
        this.router.navigate(['../home'],{relativeTo:this.activatedRoute})
      }
      else{
        alert("Login Please");
      }
    }
    else{
      console.log("Login Please");

    }
  }

   onLogin(val){
    this.nodeserver.loginUser(val)
    .subscribe(
      (data) => {
        var replay:any = data;
        console.log(data);
        if(replay.code===200){
          this.successMsg= 'logged in';
          this.router.navigate(['../home'],{relativeTo:this.activatedRoute})
        
          localStorage.setItem("login", JSON.stringify({loggedin:true}));
        }
        
      }
    );     
   }
   
  ngOnInit() {
    this.checkLogin()
  }
}
