import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReservationService } from '../reservation.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as moment from 'moment';

const mockReservationModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  deleteOne: jest.fn(),
};

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getModelToken('Reservation'),
          useValue: mockReservationModel,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllForUser', () => {
    it('should return reservations for a given user', async () => {
      const userId = 'user123';
      const mockReservations = [{ _id: '1', userId }];
      mockReservationModel.find.mockResolvedValue(mockReservations);

      const result = await service.findAllForUser(userId);
      expect(result).toEqual(mockReservations);
      expect(mockReservationModel.find).toHaveBeenCalledWith({ userId });
    });
  });

  describe('create', () => {
    it('should throw an error if the selected time is already reserved', async () => {
      const reservationDto = { start: new Date(), movieId: 'movie123' };
      const req = { user: { _id: 'user123' } };
      mockReservationModel.findOne.mockResolvedValue(true);

      await expect(service.create(reservationDto, req)).rejects.toThrow(
        new HttpException("Current time selected isn't available", HttpStatus.BAD_REQUEST)
      );
    });

    it('should create a new reservation and return its ID', async () => {
      const reservationDto = { start: new Date(), movieId: 'movie123' };
      const req = { user: { _id: 'user123' } };
      const mockReservation = { _id: 'resv123' };

      mockReservationModel.findOne.mockResolvedValue(null);
      mockReservationModel.create.mockResolvedValue(mockReservation);

      const result = await service.create(reservationDto, req);
      expect(result).toEqual(mockReservation._id);
      expect(mockReservationModel.create).toHaveBeenCalledWith({
        userId: req.user._id,
        movieId: reservationDto.movieId,
        date_start: moment(reservationDto.start).toISOString(),
        date_end: moment(reservationDto.start).add(2, 'hours').toISOString(),
      });
    });
  });

  describe('findOneByDate', () => {
    it('should return a reservation if one exists at the given date', async () => {
      const date = new Date();
      const req = { user: { _id: 'user123' } };
      const mockReservation = { _id: 'resv123' };

      mockReservationModel.findOne.mockResolvedValue(mockReservation);

      const result = await service.findOneByDate(date, req);
      expect(result).toEqual(mockReservation);
      expect(mockReservationModel.findOne).toHaveBeenCalledWith({
        userId: req.user._id,
        date_start: { $lte: moment(date).toISOString() },
        date_end: { $gte: moment(date).toISOString() },
      });
    });
  });

  describe('deleteOne', () => {
    it('should throw an error if reservation is not found', async () => {
      const reservationId = 'resv123';
      const req = { user: { _id: 'user123' } };
      mockReservationModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.deleteOne(reservationId, req)).rejects.toThrow(
        new HttpException('Reservation not found', HttpStatus.NOT_FOUND)
      );
    });

    it('should delete a reservation successfully', async () => {
      const reservationId = 'resv123';
      const req = { user: { _id: 'user123' } };
      mockReservationModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.deleteOne(reservationId, req);
      expect(result).toEqual({ deletedCount: 1 });
      expect(mockReservationModel.deleteOne).toHaveBeenCalledWith({
        userId: req.user._id,
        _id: reservationId,
      });
    });
  });
});
