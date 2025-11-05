import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { FindOperator, In, Repository } from 'typeorm';
import { UserRole, UsersCategories } from './users-categories.entity';
import { FoldersCategoriesService } from 'src/folders-categories/folders-categories.service';
import {
  CategoriesTypes,
  CategoryType,
} from 'src/categories_types/categories-types.entity';

interface RawUserCategoryResult {
  id: string;
  role: string;
  completionсount: number;
  createdat: Date;
  updatedat: Date;
  rate: number | null;
  userid: string;
  usertgid: number;
  username: string;
  usercreatedat: Date;
  userupdatedat: Date;
  categoryid: string;
  categoryname: string;
  categorydescription: string;
  categorycreatedat: Date;
  categoryupdatedat: Date;
  typeid: string;
  typename: string;
  children: any[];
  averagerate: string | null;
}

@Injectable()
export class UsersCategoriesService {
  constructor(
    @InjectRepository(UsersCategories)
    private readonly userCategoryRepo: Repository<UsersCategories>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly foldersCategoriesService: FoldersCategoriesService,
  ) {}

  async addCategoryToUser(userId: string, categoryId: string, role: UserRole) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const category = await this.categoryRepo.findOneBy({ id: categoryId });

    if (!user || !category) {
      throw new NotFoundException('User or category not found');
    }

    const userCategory = this.userCategoryRepo.create({
      user,
      category,
      role: role || UserRole.VIEWER,
    });
    return this.userCategoryRepo.save(userCategory);
  }

  async removeCategoryFromUser(userId: string, categoryId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const category = await this.categoryRepo.findOneBy({ id: categoryId });

    if (!user || !category) {
      throw new NotFoundException('User or category not found');
    }

    return this.userCategoryRepo.delete({ user, category });
  }

  async getCategoriesByUser(
    userId?: string,
    type?: string,
    role?: UserRole,
    sort?: 'ASC' | 'DESC',
    folder?: string,
  ) {
    const where: {
      user: { id?: string };
      role?: UserRole;
      category: {
        id?: FindOperator<string>;
        categoriesTypes?: { id: string };
        folders?: { id: string }[];
      };
      sort?: 'ASC' | 'DESC';
      folders?: {
        id: string;
      }[];
    } = {
      user: { id: userId },
      category: {},
    };

    if (role !== undefined && role !== null) {
      where.role = role;
    }

    if (type) {
      where.category = {
        categoriesTypes: { id: type },
      };
    }

    if (folder) {
      where.category.folders = [{ id: folder }];
    }

    const userCategories = await this.userCategoryRepo.find({
      where,
      relations: [
        'category',
        'category.userCategories',
        'category.userCategories.user',
        'category.categoriesTypes',
      ],
      order: {
        updatedAt: sort || 'DESC',
      },
    });

    // Для каждой категории находим создателя
    return userCategories.map((uc) => {
      const creator = uc.category.userCategories.find(
        (uc) => uc.role === UserRole.CREATOR,
      )?.user;

      return {
        ...uc,
        user: creator || uc.user, // fallback на текущего user если создатель не найден
      };
    });
  }

  async getByType(typeId: string): Promise<Record<string, UsersCategories[]>> {
    const result: RawUserCategoryResult[] = await this.userCategoryRepo
      .createQueryBuilder('uc')
      .leftJoinAndSelect('uc.category', 'category')
      .leftJoinAndSelect('category.categoriesTypes', 'categoriesTypes')
      .leftJoinAndSelect('uc.user', 'user')
      .leftJoinAndSelect('categoriesTypes.children', 'children')
      .where(
        'categoriesTypes.id = :typeId OR categoriesTypes.parent.id = :typeId',
        { typeId },
      )
      .andWhere('uc.role = :role', { role: UserRole.CREATOR }) // Оставляем фильтр здесь
      .select([
        'uc.id as id',
        'uc.role as role',
        'uc.completionсount as completionCount',
        'uc.createdAt as createdAt',
        'uc.updatedAt as updatedAt',
        'uc.rate as rate',
        'user.id as userId',
        'user.tg_id as userTgId',
        'user.name as userName',
        'user.createdAt as userCreatedAt',
        'user.updatedAt as userUpdatedAt',
        'category.id as categoryId',
        'category.name as categoryName',
        'category.description as categoryDescription',
        'category.createdAt as categoryCreatedAt',
        'category.updatedAt as categoryUpdatedAt',
        'categoriesTypes.id as typeId',
        'categoriesTypes.type as typeName',
        // Для правильного расчета средней оценки используем подзапрос или оконную функцию по всем записям
        `(SELECT AVG(uc2.rate) FROM users_categories uc2 WHERE uc2.category_id = category.id) as averageRate`,
      ])
      .orderBy('categoriesTypes.type', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .getRawMany();

    // Группируем по типам категорий с правильной типизацией
    const grouped: Record<string, UsersCategories[]> = result.reduce(
      (acc: Record<string, UsersCategories[]>, item: RawUserCategoryResult) => {
        const typeName = item.typename;

        if (!acc[typeName]) {
          acc[typeName] = [];
        }

        // Создаем UsersCategories
        const userCategory = new UsersCategories();
        userCategory.id = item.id;
        userCategory.role = item.role as UserRole;
        userCategory.completionСount = item.completionсount;
        userCategory.createdAt = item.createdat;
        userCategory.updatedAt = item.updatedat;
        userCategory.rate = item.rate as number;

        // Создаем User
        userCategory.user = new User();
        userCategory.user.id = item.userid;
        userCategory.user.tg_id = item.usertgid;
        userCategory.user.name = item.username;
        userCategory.user.createdAt = item.usercreatedat;
        userCategory.user.updatedAt = item.userupdatedat;

        // Создаем Category
        userCategory.category = new Category();
        userCategory.category.id = item.categoryid;
        userCategory.category.name = item.categoryname;
        userCategory.category.description = item.categorydescription;
        userCategory.category.createdAt = item.categorycreatedat;
        userCategory.category.updatedAt = item.categoryupdatedat;

        // Создаем CategoriesTypes для category
        userCategory.category.categoriesTypes = new CategoriesTypes();
        userCategory.category.categoriesTypes.id = item.typeid;
        userCategory.category.categoriesTypes.type =
          item.typename as CategoryType; // Приводим к enum типу
        userCategory.category.categoriesTypes.children =
          (item.children as CategoriesTypes[]) || ([] as CategoriesTypes[]);

        // Добавляем averageRate как дополнительное поле (не часть entity)
        (userCategory as any).averageRate = item.averagerate
          ? parseFloat(item.averagerate)
          : null;

        acc[typeName].push(userCategory);

        return acc;
      },
      {},
    );

    return grouped;
  }

  async markAsDone(userId: string, categoryId: string) {
    const category = await this.userCategoryRepo.findOne({
      where: {
        user: { id: userId },
        category: {
          id: categoryId,
        },
      },
    });
    if (category) {
      category.completionСount = category.completionСount + 1;
      return await this.userCategoryRepo.save(category);
    }
  }

  async rateCategory(
    userId: string,
    dto: { categoryId: string; rate: number },
  ) {
    const category = await this.userCategoryRepo.findOne({
      where: {
        user: { id: userId },
        category: {
          id: dto.categoryId,
        },
      },
    });
    if (category) {
      category.rate = dto.rate;
      return await this.userCategoryRepo.save(category);
    }
  }
}
