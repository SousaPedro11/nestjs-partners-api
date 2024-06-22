import { TicketKind } from '@prisma/client';

export class ReservarLugarRequest {
  lugares: string[];
  tipoIngresso: TicketKind;
  email: string;
}
