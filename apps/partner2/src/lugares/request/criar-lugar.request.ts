import { SpotStatus } from '@prisma/client';

export class CriarLugarRequest {
  nome: string;
  status?: SpotStatus;
}
