import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NewProject,newVehicle } from '../new-project';
import { NodeserviceService } from '../nodeservice.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
  providers: [NodeserviceService]
})
export class VehicleComponent implements OnInit {
  successMsg;
  vehicledata:any;
  vhcl:any;
  vehicleSelected;
  constructor(
    private nodeserver: NodeserviceService
  ) { }

  viewTC(vh){this.vehicleSelected = vh;}
  viewRC(vh){this.vehicleSelected = vh;}
  viewIC(vh){this.vehicleSelected = vh;}
  viewFC(vh){this.vehicleSelected = vh;}
  viewInvoice(vh){this.vehicleSelected = vh;}

  ngOnInit() {
    this.nodeserver.getVehiclesData()
      .subscribe(
        (data)=>
        {
          this.vehicledata= data;
          console.log(data);
        }
      )
  }

}
