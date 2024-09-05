import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './updateadmin.component.html',
  styles: []
})
export class UpdateAdminComponent implements OnInit {
  updateAdminForm!: FormGroup;
  adminId!: string;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadAdminDetails();
  }

  initializeForm(): void {
    this.updateAdminForm = this.fb.group({
      nom: [''],
      prenom: [''],
      genre: [''],
      date_de_naissance: [''],
      addresse: [''],
      occupation: [''],
      etat_social: [''],
      numero_telephone: [''],
      user_name: [''],
      email: ['', [Validators.email]],
      password: [''],
      user_image: [null],
      role:['']
    });
  }

  loadAdminDetails(): void {
    this.adminService.getAdminById(this.adminId).subscribe(
      response => {
        this.updateAdminForm.patchValue(response.user);
      },
      error => {
        console.error('Error loading admin details:', error);
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.updateAdminForm.patchValue({ user_image: file });
    }
  }
  
  onSubmit(): void {
    if (this.updateAdminForm.invalid) {
      return;
    }
  
    const formData = new FormData();
    Object.keys(this.updateAdminForm.value).forEach(key => {
      const value = this.updateAdminForm.value[key];
  
      if (key === 'user_image' && value instanceof File) {
        formData.append(key, value);
      } else if (key !== 'user_image') { // Skip user_image if no file is selected
        formData.append(key, value);
      }
    });
  
    this.adminService.updateAdmin(this.adminId, formData).subscribe(
      response => {
        console.log('Admin updated successfully:', response);
        this.router.navigate(['/admin-list']);
      },
      error => {
        console.error('Error updating admin:', error);
      }
    );
  }
  
}  