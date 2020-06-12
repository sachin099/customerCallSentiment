import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AppService } from './app.service';
import { WorklistComponent } from './worklist/worklist.component';
import { DashboardComponent, DashboardChecklistComponent, DashboardUserProfileComponent } from './dashboard/dashboard.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ProgressChart } from './chart/progress-chart/progress-chart.component';
import { DoughtnutChart } from './chart/doughnut-chart/doughnut-chart.component'
import { CallDetail } from './call/call-detail/call-detail.component';
import { PaginationComponent } from './layout/pagination/pagination.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    WorklistComponent,
    DashboardComponent, DashboardChecklistComponent, DashboardUserProfileComponent,
    ProgressChart, DoughtnutChart,
    CallDetail,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FileUploadModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
