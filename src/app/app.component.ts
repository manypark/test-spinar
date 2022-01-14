import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from "firebase/database";

import { Tareas } from './interfaces';
import { environment } from 'src/environments/environment';
@Component({
  selector    : 'app-root',
  templateUrl : './app.component.html',
  styleUrls   : ['./app.component.css']
})

export class AppComponent {

  title = 'test-spinar';
  tareas:Tareas[] = [];
  form:FormGroup;
  app = initializeApp(environment.firebaseConfig);
  database = getDatabase(this.app);

  constructor(
    private fb:FormBuilder
  )
  {
    this.form = this.fb.group({
      title : ['', [ Validators.required ]],
      desc  : ['', [ Validators.required ]]
    });

    this.readTareas();
  }

  async readTareas() {
    const starCountRef = ref(this.database, 'tareas/');

    onValue(starCountRef, (snapshot) => {

      this.tareas = [];
      
      snapshot.forEach( t => {
        console.log(t.val());
        this.tareas.push(t.val());
      });
      
    });
  }

  async saveTarea() {

    if(this.form.invalid) return;

    try {
      set(ref(this.database, 'tareas/' + uuidv4()), this.form.value);
      this.form.reset();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}
