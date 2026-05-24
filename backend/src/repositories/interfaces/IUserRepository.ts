import { IGenericRepository } from '../GenericRepository';
import { IUser } from '../../models/userModel';

export interface IUserRepository extends IGenericRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string, select?: string): Promise<IUser | null>;
}
