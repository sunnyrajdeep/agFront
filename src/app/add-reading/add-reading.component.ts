import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NewProject,newRecord } from '../new-project';
import { NodeserviceService } from '../nodeservice.service';

@Component({
  selector: 'app-add-reading',
  templateUrl: './add-reading.component.html',
  styleUrls: ['./add-reading.component.css']
})
export class AddReadingComponent {

  addreadingForm : FormGroup;
  lastRecord;
  vehicleNo;
  readings;
  successMsg;
  date_of_journey;
  day_start_reading;
  day_end_reading;
  total_kms;
  vehicle_numbers:any;
  dateOfJourney;
  
  constructor(private nodeserver: NodeserviceService) { 
    this.addreadingForm = new FormGroup({
      vehicle_no: new FormControl(null,Validators.required),
      date_of_journey: new FormControl(null,Validators.required),
      time: new FormControl(null,Validators.required),
      day_start_reading: new FormControl(null, Validators.required),
      day_end_reading: new FormControl(null,Validators.required),
      day_kms: new FormControl(null,Validators.required),
      locations_visited: new FormControl(null, Validators.required),
      remark: new FormControl(null,Validators.required)
    });
  }
  focusOutFunction(){
    if(this.day_start_reading<=this.day_end_reading){
      let totalkms = this.day_end_reading - this.day_start_reading;
      this.total_kms = totalkms.toString();
    }
    else{
      alert("Day end reading must be greater than or equal to day start reading");
    }
    
  }

  populateLastReading(vehicleNo){
    this.nodeserver.getLastRecord(vehicleNo)
      .subscribe(
        (data)=>{
          this.lastRecord = data;
          if(this.dateOfJourney!=this.lastRecord.date_of_journey){
            this.day_start_reading = this.lastRecord.day_end_reading;
            console.log("Day start reading: "+JSON.stringify(data))
          }
          else{
            alert("Reading for this vehical for this date:"+ this.lastRecord.date_of_journey +" is already added.");
            document.getElementById("date_of_journey").focus();
          }
          
        }
      )
  }

  records(){
    this.nodeserver.getRecords()
      .subscribe(
        (data)=>
        {
          this.readings= data;
          console.log(this.readings.location_visited);
        }
      )
  }

  addReading(val){
    console.log(val);
    this.nodeserver.addReadingserv(val)
    .subscribe(
      (data) => {this.successMsg= 'data saved',
        console.log(data);
        this.addreadingForm = new FormGroup({
          vehicle_no: new FormControl(null,Validators.required),
          date_of_journey: new FormControl(null,Validators.required),
          time: new FormControl(null,Validators.required),
          day_start_reading: new FormControl(null, Validators.required),
          day_end_reading: new FormControl(null,Validators.required),
          day_kms: new FormControl(null,Validators.required),
          locations_visited: new FormControl(null, Validators.required),
          remark: new FormControl(null,Validators.required)
        });
        this.records();
      }
    );
  }



  ngOnInit() {
    this.records();
    this.nodeserver.getVehicleData()
    .subscribe(
      (data) => {
        console.log(data);
        this.vehicle_numbers = data;
      }

    );

  }

}
