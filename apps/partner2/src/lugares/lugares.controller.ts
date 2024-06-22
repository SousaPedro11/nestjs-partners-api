import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CriarLugarRequest } from './request/criar-lugar.request';
import { AtualizarLugarRequest } from './request/atualizar-lugar.request';
import { SpotsService } from '@app/core/spots/spots.service';

@Controller('eventos/:eventoId/lugares')
export class LugaresController {
  constructor(private readonly lugaresService: SpotsService) {}

  @Post()
  async create(
    @Body() criarLugarRequest: CriarLugarRequest,
    @Param('eventoId') eventoId: string,
  ) {
    return await this.lugaresService
      .create({
        name: criarLugarRequest.nome,
        status: criarLugarRequest.status,
        eventId: eventoId,
      })
      .then((spot) => ({
        id: spot.id,
        nome: spot.name,
        status: spot.status,
        eventoId: spot.eventId,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
      }));
  }

  @Get()
  async findAll(@Param('eventoId') eventoId: string) {
    return await this.lugaresService.findAll(eventoId).then((spots) => {
      return spots.map((spot) => ({
        id: spot.id,
        nome: spot.name,
        status: spot.status,
        eventoId: spot.eventId,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
      }));
    });
  }

  @Get(':lugarId')
  async findOne(
    @Param('lugarId') lugarId: string,
    @Param('eventoId') eventoId: string,
  ) {
    return await this.lugaresService
      .findOne(eventoId, lugarId)
      .then((spot) => ({
        id: spot.id,
        nome: spot.name,
        status: spot.status,
        eventoId: spot.eventId,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
      }));
  }

  @Patch(':lugarId')
  async update(
    @Param('lugarId') lugarId: string,
    @Param('eventoId') eventoId: string,
    @Body() atualizarLugarRequest: AtualizarLugarRequest,
  ) {
    return await this.lugaresService
      .update(lugarId, {
        name: atualizarLugarRequest.nome,
        status: atualizarLugarRequest.status,
        eventId: eventoId,
      })
      .then((spot) => ({
        id: spot.id,
        nome: spot.name,
        status: spot.status,
        eventoId: spot.eventId,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
      }));
  }

  @HttpCode(204)
  @Delete(':lugarId')
  remove(
    @Param('lugarId') lugarId: string,
    @Param('eventoId') eventoId: string,
  ) {
    return this.lugaresService.remove(eventoId, lugarId);
  }
}
