import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  
})
export class AppComponent implements OnInit{
  title = 'app3';

  ngOnInit(): void {

    var config = {
      apiKey: "AIzaSyCLYKNHKB-qiQmCkeIKo0Rq35vRSSuKuec",
      authDomain: "jta-instagram-clone-59149.firebaseapp.com",
      databaseURL: "https://jta-instagram-clone-59149.firebaseio.com",
      projectId: "jta-instagram-clone-59149",
      storageBucket: "jta-instagram-clone-59149.appspot.com",
      messagingSenderId: "399138561083"
    };

    firebase.initializeApp(config)
  }
}
