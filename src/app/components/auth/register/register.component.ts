import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthFirebaseService } from '../../../services/firebase/auth-firebase.service';
// import { Route } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent{
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthFirebaseService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.min(0)]],
      gender: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const { email, username, password, firstName, lastName, age, gender } = this.registerForm.value;
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.register(email, username, password, firstName, lastName, age, gender).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Rejestracja zakończona sukcesem!');
      
        this.registerForm.reset();
        // this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Wystąpił błąd podczas rejestracji: ' + err.message;
      },
    });
  }
  
}
