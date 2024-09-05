import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message-list',
  standalone:true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2>Messages</h2>
      <ul>
        <li *ngFor="let message of messages">
          {{ message.subject }} - {{ message.sender }}
          <button (click)="viewMessage(message.id)">Voir</button>
          <button (click)="deleteMessage(message.id)">Supprimer</button>
        </li>
      </ul>
      <div *ngIf="selectedMessage">
        <h3>Détails du Message</h3>
        <p>{{ selectedMessage.content }}</p>
        <input type="text" placeholder="Votre réponse" [(ngModel)]="replyContent">
        <button (click)="replyToMessage(selectedMessage.id)">Répondre</button>
      </div>
    </div>
  `,
  styles: []
})
export class MessageListComponent implements OnInit {
  messages: any[] = [];
  selectedMessage: any;
  replyContent: string = '';

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.listMessages().subscribe(data => {
      this.messages = data;
    });
  }

  viewMessage(id: number): void {
    this.messageService.showMessage(id).subscribe(data => {
      this.selectedMessage = data;
    });
  }

  deleteMessage(id: number): void {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.loadMessages(); // Recharger la liste des messages après la suppression
    });
  }

  replyToMessage(id: number): void {
    if (this.replyContent) {
      this.messageService.replyToMessage(id, { reply: this.replyContent }).subscribe(() => {
        this.replyContent = '';
        this.viewMessage(id); // Recharger le message après la réponse
      });
    }
  }
}
