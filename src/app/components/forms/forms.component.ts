import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector    : 'app-forms',
  templateUrl : './forms.component.html',
  styleUrls   : ['./forms.component.css']
})

export class FormsInputComponent {

  form:FormGroup;
  
  constructor(
    private fb:FormBuilder,
    private taskServices:TaskService
  ) {
    this.form = this.fb.group({
      title : ['', [ Validators.required ]],
      desc  : ['', [ Validators.required ]]
    });
  }

  async saveTarea() {
    if(this.form.invalid) return;
    
    this.taskServices.saveTarea( this.form.value );
    this.form.reset();
  }

}