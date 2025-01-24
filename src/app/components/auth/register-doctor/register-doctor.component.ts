import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFirebaseService } from '../../../services/firebase/auth-firebase.service';
@Component({
  selector: 'app-register-doctor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-doctor.component.html',
  styleUrl: './register-doctor.component.css'
})
export class RegisterDoctorComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthFirebaseService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      specialization: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const { email, username, password, firstName, lastName, specialization } = this.registerForm.value;

    this.authService
      .registerDoctor(email, username, password, firstName, lastName, specialization)
      .subscribe({
        next: () => {
          this.successMessage = 'Doctor successfully registered!';
          this.registerForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Failed to register doctor. Please try again.';
          console.error(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
