import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReserveSpotDto } from './dto/reserve.dto';
import { Prisma, SpotStatus, TicketStauts } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: createEventDto,
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      where: {
        id,
      },
      data: updateEventDto,
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: {
        id,
      },
    });
  }

  async reserveSpot(dto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        name: {
          in: dto.spots,
        },
        eventId: dto.eventId,
      },
    });
    if (spots.length !== dto.spots.length) {
      const foundSpotsNames = spots.map((spot) => spot.name);
      const notFoundSpotsNames = dto.spots.filter(
        (spotName) => !foundSpotsNames.includes(spotName),
      );
      throw new Error(`Spots not found: ${notFoundSpotsNames.join(', ')}`);
    }

    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              ticketKind: dto.ticketKind,
              email: dto.email,
              status: TicketStauts.RESERVED,
            })),
          });

          await prisma.spot.updateMany({
            where: {
              id: {
                in: spots.map((spot) => spot.id),
              },
            },
            data: {
              status: SpotStatus.RESERVED,
            },
          });

          return await Promise.all(
            spots.map((spot) =>
              prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind: dto.ticketKind,
                  email: dto.email,
                },
              }),
            ),
          );
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
          case 'P2034':
            throw new Error(
              'Some spots are already reserved. Please try again.',
            );
        }
      }
      throw error;
    }
  }
}
