import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Response {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Response): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transaction = await transactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not exists', 400);
    }

    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
