import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './Admin/admin-panel/admin-panel.component';
import { HomeComponent } from './Components/home/home.component';
import { ListsComponent } from './Components/lists/lists.component';
import { MemberDetailComponent } from './Components/members/member-detail/member-detail.component';
import { MemberEditComponent } from './Components/members/member-edit/member-edit.component';
import { MemberListComponent } from './Components/members/member-list/member-list.component';
import { MessagesComponent } from './Components/messages/messages.component';
import { NotFoundComponent } from './Errors/not-found/not-found.component';
import { ServerErrorComponent } from './Errors/server-error/server-error.component';
import { TestErrorComponent } from './Errors/test-error/test-error.component';
import { AdminGuard } from './Guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { PreventUnsavedChangesGuard } from './Guards/prevent-unsaved-changes.guard';
import { MemberDetailedResolver } from './resolvers/member-detailed.resolver';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'members', component: MemberListComponent},
      {path: 'members/:username', component: MemberDetailComponent , resolve: {member: MemberDetailedResolver}},
      {path: 'member/edit', component: MemberEditComponent, canDeactivate: [PreventUnsavedChangesGuard]},
      {path: 'lists', component: ListsComponent},
      {path: 'messages', component: MessagesComponent},
      {path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard]}
    ]
  },
  {path: 'errors', component: TestErrorComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
