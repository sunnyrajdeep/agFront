import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy }  from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { VehicleComponent } from './vehicle/vehicle.component';
import { ProjectsComponent } from './projects/projects.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { RegisterComponent } from './register/register.component';
import { NodeserviceService } from './nodeservice.service';
import { AddReadingComponent } from './add-reading/add-reading.component';
import { LoginComponent } from './login/login.component';
import { FileUploadModule} from 'ng2-file-upload';
import { CpsComponent } from './cps/cps.component';

const appRoutes: Routes=[
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'forms',
    component:CpsComponent
  },
  {
    path:'add-reading',
    component:AddReadingComponent
  },
  {
    path:'vehicle',
    component:VehicleComponent    
  },
  {
    path:'add-vehicle',
    component:AddVehicleComponent
  },
  {
    path:'projects',
    component:ProjectsComponent
  },
  {
    path:'add-project',
    component:AddProjectComponent
  },
  {
    path:'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: DashboardComponent
  }
]
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    VehicleComponent,
    ProjectsComponent,
    AddVehicleComponent,
    AddProjectComponent,
    RegisterComponent,
    AddReadingComponent,
    LoginComponent,
    FileSelectDirective,
    CpsComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  providers: [
    NodeserviceService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    }
    ,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
