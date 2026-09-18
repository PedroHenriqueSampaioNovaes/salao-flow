import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

export class DeleteExpiredRecruiterAccountsService {
  async execute() {
    const barbershopRepository = new BarbershopRepository();

    const deletedCount =
      await barbershopRepository.deleteManyExpiredRecruiterAccounts(new Date());

    return { deletedCount };
  }
}
