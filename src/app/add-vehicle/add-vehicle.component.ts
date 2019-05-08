import { Component, OnInit, ViewChild, Directive,NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NodeserviceService } from '../nodeservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NewProject,newVehicle } from '../new-project';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
const URL = 'http://localhost:8081/api/upload';
@NgModule({
  declarations:[
    FileSelectDirective
  ]
})
@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css'],
  providers: [NodeserviceService],
})
// class FileSelectDirective
@Directive({ selector: '[ng2FileSelect]' })

export class AddVehicleComponent implements OnInit {
  
  successMsg;
  filepath;
  tc;
  rc;
  puc;
  fc;
  ic;
  invoice;
  vn_stat="MH";
  vn_dst="12";
  vn_sub;
  vn_number;
  uploadedFileResponse;
  fileurl:string= "http://localhost:8081/views/uploads?imagename="; // vehicleDoc-1535987624968..jpg
  newVehicleModel = new newVehicle('','', '','','','','','', '','','','');
  
  addVehicleform: FormGroup;

  constructor(
    private nodeserver: NodeserviceService, 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { 
    this.addVehicleform = new FormGroup({
      
    })
  }



  onfocusOut(){
    if(this.vn_sub && this.vn_number){
      
      this.newVehicleModel.vehicle_number = this.vn_stat+"-"+this.vn_dst+"-"+this.vn_sub+"-"+this.vn_number;
    }
    else{
      alert("Enter Vehicle No.")
    }
    
  }

  public uploaderTC: FileUploader = new FileUploader({url: URL, itemAlias: 'vehicleDoc'});
  public uploaderRC: FileUploader = new FileUploader({url: URL, itemAlias: 'vehicleDoc'});
  public uploaderPUC: FileUploader = new FileUploader({url: URL, itemAlias: 'vehicleDoc'});
  public uploaderFC: FileUploader = new FileUploader({url: URL, itemAlias: 'vehicleDoc'});
  public uploaderIC: FileUploader = new FileUploader({url: URL, itemAlias: 'vehicleDoc'});
  public uploaderInvoice: FileUploader = new FileUploader({url: URL, itemAlias: 'vehicleDoc'});
  
  addVehicle(){
    console.log(this.newVehicleModel);
    this.nodeserver.addVehicleserv(this.newVehicleModel)
    .subscribe(
      (data) => {this.successMsg= 'data saved',
        console.log(data);
        alert("Data saved");
        this.router.navigate(['../vehicle'],{relativeTo:this.activatedRoute})
      }
      
    );
    
    

  }

  ngOnInit() {
    // TC
    
    this.uploaderTC.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploaderTC.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         this.uploadedFileResponse = response;
         console.log(item.url);
         if(status===200){
         alert('File uploaded successfully');
         this.newVehicleModel.tc= this.fileurl+response;
         }
         else{
          alert("Upload Failed")
        }
     };
    // RC
    this.uploaderRC.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploaderRC.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         if(status===200){
         alert('File uploaded successfully');
         this.newVehicleModel.rc= this.fileurl+response;
         }
         else{
          alert("Upload Failed")
        }
     };
    // PUC
    this.uploaderPUC.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploaderPUC.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         if(status===200){
          alert('File uploaded successfully');
          this.newVehicleModel.puc= this.fileurl+response;
         } 
         else{
          alert("Upload Failed")
        }
     };

    //Fitness
    this.uploaderFC.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploaderFC.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         if(status===200){
         alert('File uploaded successfully');
         this.newVehicleModel.fc= this.fileurl+response;
         }
         else{
          alert("Upload Failed")
        }
     };
    
    //  IC
    this.uploaderIC.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploaderIC.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         if(status===200){
         alert('File uploaded successfully');
         this.newVehicleModel.ic= this.fileurl+response;
          }
          else{
            alert("Upload Failed")
          }
     };
    // Invoice
    this.uploaderInvoice.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploaderInvoice.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         if(status===200){
         alert('File uploaded successfully');
         this.newVehicleModel.invoice= this.fileurl+response;
         }
         else{
          alert("Upload Failed")
        }
     };
  }// end ngOnInit

}


//   successMsg;
//   Userform: FormGroup;
//   userImageFile: File;
//   @ViewChild('UserImage') User_image;
//   constructor(private fb: FormBuilder, 
//     private nodeserver:NodeserviceService,  
//     private router: Router,
//     private activatedRoute: ActivatedRoute) 
//     {
//      this.Userform = this.fb.group({
//         'Email':['',Validators.required],
//         'Password': ['',Validators.required],
//         'UserImage': ['',Validators.required]
//      });
//    }

//    checkLogin(){
//     if(localStorage.login){
//       var logs= JSON.parse(localStorage.getItem("login"));
//       //console.log(logs);
//       if(logs.loggedin===true){
//         console.log(logs);
//         //alert("logged in")
//         //this.router.navigate(['../home'],{relativeTo:this.activatedRoute})
//       }
//       else{
//         alert("Login Please");
//         this.router.navigate([''],{relativeTo:this.activatedRoute})
//       }
//     }
//     else{
      
//       this.router.navigate([''],{relativeTo:this.activatedRoute})

//     }
//   }

//    onSubmit(val){
//     console.log(val);
//     this.nodeserver.addProjectserv(val)
//     .subscribe(
//       (data) => {this.successMsg= 'data saved',
//         console.log(data);
//       }
//     );     
//    }

//   ngOnInit() {
//     this.checkLogin();
//   }

// }
