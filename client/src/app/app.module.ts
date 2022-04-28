import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { ListsComponent } from './Components/lists/lists.component';
import { NavComponent } from './Components/nav/nav.component';
import { MessagesComponent } from './Components/messages/messages.component';
import { RegisterComponent } from './Components/register/register.component';
import { MemberListComponent } from './Components/members/member-list/member-list.component';
import { MemberDetailComponent } from './Components/members/member-detail/member-detail.component';
import { MemberCardComponent } from './Components/members/member-card/member-card.component';
import { JwtInterceptor } from './Interceptors/jwt.interceptor';
import { TestErrorComponent } from './Errors/test-error/test-error.component';
import { ErrorInterceptor } from './Interceptors/error.interceptor';
import { NotFoundComponent } from './Errors/not-found/not-found.component';
import { ServerErrorComponent } from './Errors/server-error/server-error.component';
import { MemberEditComponent } from './Components/members/member-edit/member-edit.component';
import { SharedModule } from './Modules/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './Interceptors/loading.interceptor';
import { PhotoEditorComponent } from './Components/members/photo-editor/photo-editor.component';
import { TextInputComponent } from './Forms/text-input/text-input.component';
import { DateInputComponent } from './Forms/date-input/date-input.component';
import { MemberMessagesComponent } from './Components/members/member-messages/member-messages.component';
import { AdminPanelComponent } from './Admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './Directives/has-role.directive';
import { UserManagementComponent } from './Admin/user-management/user-management.component';
import { PhotoManagementComponent } from './Admin/photo-management/photo-management.component';
import { RolesModalComponent } from './Modals/roles-modal/roles-modal.component';
import { ConfirmDialogComponent } from './Modals/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListsComponent,
    NavComponent,
    MessagesComponent,
    RegisterComponent,
    MemberListComponent,
    MemberDetailComponent,
    MemberCardComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TextInputComponent,
    DateInputComponent,
    MemberMessagesComponent,
    AdminPanelComponent,
    HasRoleDirective,
    UserManagementComponent,
    PhotoManagementComponent,
    RolesModalComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass:JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass:LoadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
