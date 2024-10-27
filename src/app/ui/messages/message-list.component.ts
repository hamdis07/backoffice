import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {
  messages: any[] = [];
  users: any[] = [];
  selectedMessage: any = null;
  replyContent: string = '';
  searchTerm: string = '';
  filterUnread: boolean = false;
  filterRead: boolean = false;
  filterAll: boolean = true;
  selectedTab: string = 'messages';
  loggedInAdmin: any;
  filterAdmins: boolean = false;
  filterClients: boolean = false;
  selectedFiles: File[] = [];
  selectedMessageId: any;
  selectedUsers: number[] = [];  

  selectedUserMessages: any[] = []; // Messages échangés avec l'utilisateur sélectionné
  selectedUser: any = null; // Utilisateur sélectionné pour la conversation
  messagesRecus: any[] = [];  // Définir les propriétés pour stocker les messages reçus
  messagesEnvoyes: any[] = []; // Définir les propriétés pour stocker les messages envoyés
 
  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
    this.getLoggedInAdmin();
  }

  getLoggedInAdmin(): void {
    this.authService.getLoggedInUser().subscribe(
      (data) => {
        this.loggedInAdmin = data;
      },
      (error: any) => {
        console.error('Error fetching logged-in admin:', error);
      }
    );
  }
  selectUser(user: any): void {
    this.selectedUser = user;
    this.getMessagesByUser(user.id);
  }
  getMessagesByUser(userId: number): void {
    this.messageService.getMessagesByUser(userId).subscribe((response: any) => {
        // Traitement des messages reçus et envoyés
        this.messagesRecus = response.messages_recus.map((message: any) => {
            if (message.attachments) {
                message.attachments = JSON.parse(message.attachments);
            }
            return message;
        });

        this.messagesEnvoyes = response.messages_envoyes.map((message: any) => {
            if (message.attachments) {
                message.attachments = JSON.parse(message.attachments);
            }
            return message;
        });
    });
}
isImage(attachment: any): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
  return imageExtensions.some(ext => attachment.url.toLowerCase().endsWith(ext));
}

isVideo(attachment: any): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg'];
  return videoExtensions.some(ext => attachment.url.toLowerCase().endsWith(ext));
}

  viewMessage(userId: number): void {
    this.messageService.getConversationWithUser(userId).subscribe(
      (data) => {
        console.log('Réponse brute du serveur :', data); // Vérifiez que les données sont correctes
  
        try {
          // Traitez les messages reçus
          const messagesRecus = (data.messages_recus || []).map((message: any) => ({
            ...message,
            type: 'received', // Ajouter un type pour l'affichage
            attachments: message.attachments || [] // Assurez-vous d'avoir les attachments
          }));
  
          // Traitez les messages envoyés (même s'il n'y en a pas)
          const messagesEnvoyes = (data.messages_envoyes || []).map((message: any) => ({
            ...message,
            type: 'sent', // Ajouter un type pour l'affichage
            content: message.content,
            attachments: message.attachments || [] // Assurez-vous d'avoir les attachments
          }));
  
          // Combinez les messages et triez par date
          this.selectedUserMessages = [...messagesRecus, ...messagesEnvoyes].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
  
          console.log('Messages combinés et triés :', this.selectedUserMessages); // Log to check combined messages
  
          // Attribuer l'utilisateur sélectionné
          this.selectedUser = data.user;
  
          if (this.selectedUserMessages.length === 0) {
            console.log('Aucun message trouvé.');
          }
        } catch (error) {
          console.error('Erreur lors du traitement des messages:', error);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des messages :', error);
      }
    );
  }
  
selectTab(tab: string): void {
  this.selectedTab = tab;
  if (tab === 'contacts') {
    this.loadUsers(); // Load users when 'contacts' tab is selected
  } else if (tab === 'messages') {
    this.loadUsersWithLastMessages(); // Load users with last messages when 'messages' tab is selected
  }
}
loadUsersWithLastMessages(): void {
  this.messageService.getUsersWithLastMessages().subscribe((response) => {
    this.users = response; // Assuming the API returns the array of users with their last messages
  });
}
  loadAllMessages(): void {
    this.messageService.listMessages().subscribe((readMessages) => {
      this.messageService.listUnreadMessages().subscribe((unreadMessages) => {
        this.messages = [...readMessages, ...unreadMessages];
      });
    });
  }
  loadMessages(): void {
    if (this.filterUnread) {
      this.messageService.listUnreadMessages().subscribe((data) => {
        this.messages = data;
      });
    } else if (this.filterRead) {
      this.messageService.listReadMessages().subscribe((data) => {
        this.messages = data;
      });
    } else {
      this.loadAllMessages();
    }
  }
  // Select a message and fetch its details
  selectMessage(message: any): void {
    this.selectedMessageId = message.id;
    this.selectedUser = message.user_id; // Stocke l'ID de l'utilisateur du message sélectionné
  
    this.messageService.getMessageById(message.id).subscribe(
      (data) => {
        this.selectedMessage = data;
        this.replyContent = ''; // Réinitialiser le contenu de la réponse à chaque sélection
      },
      (error: any) => {
        console.error('Error fetching message details:', error);
      }
    );
  }

  // Select a user and load their conversation
 
  
  

  loadUserMessages(userId: number): void {
    this.messageService.getMessagesByUser(userId).subscribe(
      (messages) => {
        this.messages = messages; // Stocker les messages de l'utilisateur sélectionné
        this.selectedMessage = null; // Réinitialiser le message sélectionné
      },
      (error) => {
        console.error('Erreur lors du chargement des messages:', error);
      }
    );
  }

  replyToMessage() {
    const replyData = { reply: this.replyContent };
    const files = this.selectedFiles; // If you're attaching files
  
    // Make sure replyContent is not empty
    if (!this.replyContent) {
      console.error('Reply content is required');
      return;
    }
  
    this.messageService.replyToMessage(this.selectedMessageId, replyData, files)
      .subscribe(
        response => {
          console.log('Message sent:', response);
        },
        error => {
          console.error('Error sending message:', error);
        }
      );
  }
  
  
  

 

  
  searchMessages(): void {
    if (this.searchTerm) {
      this.messageService.searchMessages(this.searchTerm).subscribe((data) => {
        this.messages = data;
      });
    } else {
      this.loadMessages();
    }
  }

  filterMessages(): void {
    if (this.filterUnread || this.filterRead) {
      this.filterAll = false;
    } else {
      this.filterAll = true;
    }
    this.loadMessages();
  }
 

  loadUsers(): void {
    this.messageService.listClients().subscribe(
      (response) => {
        this.users = response.data; // Accès à la propriété 'data'
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }
  
  loadadmins(): void {
    this.messageService.listAdmins().subscribe(
      (response) => {
        this.users = response.data; // Accès à la propriété 'data'
      },
      (error) => {
        console.error('Error loading admins:', error);
      }
    );
  }
 
  loadallusers(): void {
    this.messageService.listallusers().subscribe(
      (response) => {
        this.users = response.data; // Accès à la propriété 'data'
      },
      (error) => {
        console.error('Error loading all users:', error);
      }
    );
  }
  filterUsers(): void {
    this.loadUsers();
  }

  onUserSelectionChange(event: any): void {
    const userId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
    }
  }

  sendMessage(): void {
    if (!this.selectedUser) {
      console.error('No user selected for response');
      return;
    }
  

    this.messageService.sendMessageToClients(this.selectedUsers, this.replyContent, this.selectedFiles).subscribe(
      () => {
        this.replyContent = '';
        this.selectedFiles = [];
        this.selectedUsers = [];
        console.log('Message sent successfully');
      },
      (error: any) => {
        console.error('Error sending message:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    console.log('Files selected:', event.target.files);

    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  getFileTypeText(fileType: string): string {
    if (fileType === 'image') {
      return 'Image';
    } else if (fileType === 'video') {
      return 'Vidéo';
    } else {
      return 'Fichier';
    }
  }
  loadMessages1(): void {
    this.messageService.listMessages().subscribe((data: any[]) => {
      this.messages = data.map(message => {
        return {
          ...message,
          attachments: message.attachments ? JSON.parse(message.attachments) : null
        };
      });
    }, error => {
      console.error('Erreur lors du chargement des messages:', error);
    });
  }
}
