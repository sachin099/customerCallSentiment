import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppService } from './app.service';
import { WorklistComponent } from './worklist/worklist.component';
import { DashboardComponent, DashboardChecklistComponent, DashboardUserProfileComponent } from './dashboard/dashboard.component';
import { CallDetail } from './call/call-detail/call-detail.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'worklist', component: WorklistComponent },
  {
    path: 'settings', component: DashboardComponent, children: [
      { path: 'checklist', component: DashboardChecklistComponent },
      { path: 'userprofile', component: DashboardUserProfileComponent }
    ]
  },
  { path: 'calldetail', component: CallDetail },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
