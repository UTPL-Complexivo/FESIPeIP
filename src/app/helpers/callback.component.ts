import { Component, OnInit } from '@angular/core';
import { AuthService }       from '@auth0/auth0-angular';
import { Router }            from '@angular/router';

@Component({
  selector: 'app-callback',
  template: '<p>Procesando login…</p>'
})
export class CallbackComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.handleRedirectCallback().subscribe({
      next: ({ appState }) => {
        const target = appState?.target ?? '/';
        this.router.navigateByUrl(target);
      },
      error: err => {
        console.error('Error al procesar callback', err);
        // opcional: redirigir al login o mostrar mensaje
      }
    });
  }
}
