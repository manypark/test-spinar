import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

import { environment } from 'src/environments/environment';
import { Tareas } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  tareas:Tareas[] = [];
  app = initializeApp(environment.firebaseConfig);
  database = getDatabase(this.app);

  async readTareas() {
    const starCountRef = ref(this.database, 'tareas/');

    onValue(starCountRef, (snapshot) => {

      this.tareas = [];      

      snapshot.forEach( t => {
        this.tareas.push(t.val());
      });

    });
  }

  async saveTarea( form:any ) {
    const uid = uuidv4();
    try {
      set( ref( this.database, 'tareas/' + uid), {
        id:uid, 
        ...form
      });

      this.readTareas()
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

}