import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { PersonAgePipe } from './pipes/person-age.pipe';
import { PersonSexPipe } from './pipes/person-sex.pipe';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { PersonMaritalStatusPipe } from './pipes/person-marital-status.pipe';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {TooltipModule} from 'primeng/tooltip';
import {PaginatorModule} from 'primeng/paginator';
import { PhoneMaskPipe } from './pipes/phone-mask.pipe';
import { CpfCpnjMaskPipe } from './pipes/cpf-cpnj-mask.pipe';
import { SchedulingStatusPipe } from './pipes/scheduling-status.pipe';
import {MultiSelectModule} from 'primeng/multiselect';

@NgModule({
  declarations: [
    ErrorMessageComponent,
    PersonAgePipe,
    PersonSexPipe,
    PersonMaritalStatusPipe,
    PhoneMaskPipe,
    CpfCpnjMaskPipe,
    SchedulingStatusPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    RouterModule,
    CardModule,
    TableModule,
    BreadcrumbModule,
    InputTextareaModule,
    ConfirmDialogModule,
    DialogModule,
    CheckboxModule,
    MessagesModule,
    MessageModule,
    OverlayPanelModule,
    TooltipModule,
    PaginatorModule,
    MultiSelectModule,
    
    PersonAgePipe,
    PersonSexPipe,
    PersonMaritalStatusPipe,
    PhoneMaskPipe,
    CpfCpnjMaskPipe,
    SchedulingStatusPipe
  ]
})
export class SharedModule { }
