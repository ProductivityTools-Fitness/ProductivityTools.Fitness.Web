import { Component, OnInit, signal } from '@angular/core';
import { ConsoleService } from '../console.service';

@Component({
  selector: 'app-appname',
  imports: [],
  templateUrl: './appname.html',
  styleUrl: './appname.css',
})
export class Appname implements OnInit {

  serverName=signal<string>('did not receive anything')

  constructor(private consoleService: ConsoleService) {
  }


  ngOnInit() {
    this.consoleService.getServerName().subscribe((serverName) => {
      console.log("serverName: " + serverName);
      this.serverName.set(serverName);
    });
  }
}
