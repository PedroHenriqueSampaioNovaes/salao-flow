import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class ListServiceItemService {
  async execute(barbershopId: number) {
    const serviceRepository = new ServiceRepository();

    const services = await serviceRepository.listByBarbershopId(barbershopId);

    if (services.length === 0) {
      throw new AppError('Serviço não encontrado', 404);
    }

    if (services[0].barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para visualizar este serviço',
        403,
      );
    }

    return services;
  }
}
