import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const pdfModal = document.getElementById('pdfModal');
      if (!pdfModal) return;

      pdfModal.addEventListener('show.bs.modal', (event: any) => {
        const button = event.relatedTarget;
        const pdfUrl = button.getAttribute('data-pdf');
        const iframe = document.getElementById('pdfViewer') as HTMLIFrameElement;
        if (iframe) iframe.src = pdfUrl;
      });

      pdfModal.addEventListener('hidden.bs.modal', () => {
        const iframe = document.getElementById('pdfViewer') as HTMLIFrameElement;
        if (iframe) iframe.src = '';
      });
    }
  }
}
