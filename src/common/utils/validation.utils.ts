// src/common/utils/validation.utils.ts
import { ValidationError } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

export interface GroupedErrors {
  [field: string]: string[] | GroupedErrors;
}

export interface ValidationResult {
  errors: GroupedErrors;
  hasErrors: boolean;
}

/**
 * Группирует ошибки валидации в иерархическую структуру
 */
export const groupValidationErrors = (
  errors: ValidationError[],
  i18n: I18nService,
): ValidationResult => {
  const grouped: GroupedErrors = {};

  const setNestedValue = (
    obj: GroupedErrors,
    path: string[],
    value: string,
  ) => {
    let current: any = obj;

    for (let i = 0; i < path.length; i++) {
      const key: string = path[i];
      const isLast = i === path.length - 1;

      // Если это последний элемент, добавляем сообщение
      if (isLast) {
        // Проверяем, является ли текущее значение массивом строк
        if (!current[key]) {
          current[key] = [];
        }

        // Если это не массив, а что-то другое (например, строка), создаем новый массив
        if (!Array.isArray(current[key])) {
          current[key] = [current[key] as string];
        }

        (current[key] as string[]).push(value);
        break;
      }

      // Если это не последний элемент, создаем вложенный объект
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }

      current = current[key];
    }
  };

  const processError = (error: ValidationError, currentPath: string[]) => {
    // Обрабатываем constraints текущего поля
    if (error.constraints) {
      Object.values(error.constraints).forEach((raw) => {
        const msg = isI18nKey(raw) ? i18n.t(raw.slice(6)) : raw;
        setNestedValue(grouped, [...currentPath], msg as string);
      });
    }

    // Обрабатываем детей
    if (error.children?.length) {
      // Проверяем, являются ли дети элементами массива (имеют числовые имена свойств)
      const isArrayElement = error.children.every(
        (child) => !isNaN(Number(child.property)),
      );

      if (isArrayElement) {
        // Это массив - обрабатываем каждый элемент
        error.children.forEach((child) => {
          const childPath = [...currentPath, child.property];

          // Обрабатываем constraints элемента массива
          if (child.constraints) {
            Object.values(child.constraints).forEach((raw) => {
              const msg = isI18nKey(raw) ? i18n.t(raw.slice(6)) : raw;
              setNestedValue(grouped, childPath, msg as string);
            });
          }

          // Обрабатываем вложенные ошибки элемента массива (например, поля CreateWordDto)
          if (child.children?.length) {
            child.children.forEach((nestedChild) => {
              if (nestedChild.constraints) {
                Object.values(nestedChild.constraints).forEach((raw) => {
                  const msg = isI18nKey(raw) ? i18n.t(raw.slice(6)) : raw;
                  setNestedValue(
                    grouped,
                    [...childPath, nestedChild.property],
                    msg as string,
                  );
                });
              }
            });
          }
        });
      } else {
        // Это не массив, а обычные вложенные объекты
        error.children.forEach((child) => {
          processError(child, [...currentPath, child.property]);
        });
      }
    }
  };

  // Начинаем обработку с корневых ошибок
  errors.forEach((error) => {
    processError(error, [error.property]);
  });

  return {
    errors: grouped,
    hasErrors: Object.keys(grouped).length > 0,
  };
};

// Вспомогательные функции
const isI18nKey = (msg: unknown): msg is string =>
  typeof msg === 'string' && msg.startsWith('i18n::');
