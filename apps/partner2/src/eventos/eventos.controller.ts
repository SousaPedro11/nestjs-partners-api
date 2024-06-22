import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CriarEventoRequest } from './request/criar-evento.request';
import { AtualizarEventoRequest } from './request/atualizar-evento.request';
import { ReservarLugarRequest } from './request/reservar-lugar.request';
import { EventsService } from '@app/core/events/events.service';
import { AuthGuard } from '@app/core/auth/auth.guard';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventsService) {}

  @Post()
  async create(@Body() criarEventoRequest: CriarEventoRequest) {
    return await this.eventosService
      .create({
        name: criarEventoRequest.nome,
        date: criarEventoRequest.data,
        description: criarEventoRequest.descricao,
        price: criarEventoRequest.preco,
      })
      .then((event) => ({
        id: event.id,
        nome: event.name,
        data: event.date,
        descricao: event.description,
        preco: event.price,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }));
  }

  @Get()
  async findAll() {
    return await this.eventosService.findAll().then((eventos) => {
      return eventos.map((event) => ({
        id: event.id,
        nome: event.name,
        data: event.date,
        descricao: event.description,
        preco: event.price,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }));
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.eventosService.findOne(id).then((event) => ({
      id: event.id,
      nome: event.name,
      data: event.date,
      descricao: event.description,
      preco: event.price,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() atualizarEventoRequest: AtualizarEventoRequest,
  ) {
    return await this.eventosService
      .update(id, {
        name: atualizarEventoRequest.nome,
        date: atualizarEventoRequest.data,
        description: atualizarEventoRequest.descricao,
        price: atualizarEventoRequest.preco,
      })
      .then((event) => ({
        id: event.id,
        nome: event.name,
        data: event.date,
        descricao: event.description,
        preco: event.price,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }));
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventosService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/reservar-lugar')
  async reserveSpots(
    @Body() reservarLugarRequest: ReservarLugarRequest,
    @Param('id') eventId: string,
  ) {
    return await this.eventosService
      .reserveSpot({
        spots: reservarLugarRequest.lugares,
        ticketKind: reservarLugarRequest.tipoIngresso,
        email: reservarLugarRequest.email,
        eventId,
      })
      .then((reservas) => {
        return reservas.map((reserva) => ({
          id: reserva.id,
          email: reserva.email,
          tipoIngresso: reserva.ticketKind,
          lugares: reserva.spotId,
          createdAt: reserva.createdAt,
          updatedAt: reserva.updatedAt,
        }));
      });
  }
}
