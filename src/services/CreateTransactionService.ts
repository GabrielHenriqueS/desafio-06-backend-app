import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Transaction value is higher to total value', 400);
    }

    let categoryCreate = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryCreate) {
      categoryCreate = await categoriesRepository.create({ title: category });
      await categoriesRepository.save(categoryCreate);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryCreate.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
