import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class DetailsServiceItemService {
  async execute(serviceId: string, barbershopId: number) {
    const serviceRepository = new ServiceRepository();

    const service = await serviceRepository.getById(serviceId);

    if (!service) {
      throw new AppError('Serviço não encontrado', 404);
    }

    if (service.barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para visualizar este serviço',
        403,
      );
    }

    return service;
  }
}
