import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsInputComponent } from './forms/forms.component';
import { TableComponent } from './table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [
    FormsInputComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    FormsInputComponent,
    TableComponent
  ]
})

export class ComponentModule { }