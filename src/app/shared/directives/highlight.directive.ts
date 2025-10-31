import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnChanges {
  @Input() appHighlight = '';

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appHighlight']) {
      this.highlightText();
    }
  }

  private highlightText(): void {
    const element = this.el.nativeElement;
    const text = element.textContent;
    const highlightText = this.appHighlight;

    if (!highlightText || !text) return;

    const regex = new RegExp(`(${highlightText})`, 'gi');
    const highlightedText = text.replace(regex, '<mark>$1</mark>');
    element.innerHTML = highlightedText;
  }
}