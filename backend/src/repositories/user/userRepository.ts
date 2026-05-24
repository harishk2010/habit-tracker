import { GenericRepository } from '../GenericRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUser, UserModel } from '../../models/userModel';

export class UserRepository extends GenericRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string, select?: string): Promise<IUser | null> {
    const query = this.model.findById(id);
    if (select) query.select(select);
    return await query.exec();
  }
}
