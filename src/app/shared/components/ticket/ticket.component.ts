import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TicketData {
  day: string;
  date: string;
  time: string;
  specialist: string;
  type: string;
  duration: string;
  price: string;
  availability: string;
  category: string;
  categoryLabel: string;
  available: boolean;
  seatsReserved: number;
  seatsTotal: number;
  sessionNumber?: number;
  title?: string;
  isFull?: boolean;
  currentParticipants?: number;
  maxParticipants?: number;
}

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
})
export class TicketComponent {
  @Input() ticket!: TicketData;
  @Input() selected = false;
  @Input() showSelection = true;
  @Output() select = new EventEmitter<void>();

  get isIndividual(): boolean {
    return this.ticket.type === 'جلسة فردية';
  }

  get availableSeats(): number {
    const total = this.ticket.maxParticipants ?? this.ticket.seatsTotal ?? 0;
    const reserved = this.ticket.currentParticipants ?? this.ticket.seatsReserved ?? 0;
    return Math.max(0, total - reserved);
  }

  getSeatPercent(): number {
    if (!this.ticket.seatsTotal) return 0;
    return Math.round((this.ticket.seatsReserved / this.ticket.seatsTotal) * 100);
  }
}

