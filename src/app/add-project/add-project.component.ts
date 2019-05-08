import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NewProject } from '../new-project';
import { NodeserviceService } from '../nodeservice.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
  providers: [NodeserviceService]
})
export class AddProjectComponent{
  successMsg;
  
  newProjectModel = new NewProject('','', '')
  constructor(
    private nodeserver: NodeserviceService
  ) { }

  addProject(){
    console.log(this.newProjectModel);
    this.nodeserver.addProjectserv(this.newProjectModel)
    .subscribe(
      (data) => {this.successMsg= 'data saved',
        console.log(data);
      }

    );
  }
  ngOnInit() {
  }

}
