import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NodeserviceService } from '../nodeservice.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [NodeserviceService]
})
export class RegisterComponent implements OnInit {

  successMsg;
  regform : FormGroup;

  constructor(
    private nodeserver: NodeserviceService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
      this.regform= new FormGroup({
        username:new FormControl(null, Validators.required),
        email:new FormControl(null, Validators.email),
        password: new FormControl(null,Validators.required),
        confirmPassword: new FormControl(null, this.passValidator)
      });

    this.regform.controls.password.valueChanges
      .subscribe(
        x=> this.regform.controls.confirmPassword.updateValueAndValidity()
      )
  }

  ngOnInit() {
  }

  isValid(controlName){
    return this.regform.get(controlName).invalid && this.regform.get(controlName).touched;
  }

  passValidator(control:AbstractControl){
    if(control && (control.value !==null || control.value !== undefined)){
      const confirmPasswordvalue = control.value;
      const passControl = control.root.get('password');
      if(passControl){
        const passValue = passControl.value;
        if(passValue !== confirmPasswordvalue || passValue===''){
          return {
            isError:true
          };
        }
      }
    }
    return null;
  }

  register(v){
    console.log(v);
    this.nodeserver.creatUser(v)
      .subscribe(
        (data) => {this.successMsg= 'data saved';
        this.movetologin();
        }

      );
  }

  movetologin(){
    this.router.navigate([''],{relativeTo:this.activatedRoute})
  }

}
