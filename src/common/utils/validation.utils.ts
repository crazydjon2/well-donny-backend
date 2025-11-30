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
 * без flat-массива
 */
export const groupValidationErrors = (
  errors: ValidationError[],
  i18n: I18nService,
  parentPath = '',
): ValidationResult => {
  const grouped: GroupedErrors = {};

  const addMessage = (path: string, message: string) => {
    const parts = path.split('.');
    let current: GroupedErrors = grouped;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      // Обработка массива: field[0] → { field: { 0: ... } }
      const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayName, indexStr] = arrayMatch;
        const index = Number(indexStr);

        if (!current[arrayName]) {
          current[arrayName] = {};
        }
        const arrayObj = current[arrayName] as GroupedErrors;

        if (isLast) {
          if (!arrayObj[index]) arrayObj[index] = [];
          (arrayObj[index] as string[]).push(message);
        } else {
          if (!arrayObj[index]) arrayObj[index] = {};
          current = arrayObj[index] as GroupedErrors;
        }
        continue;
      }

      // Обычное поле
      if (isLast) {
        if (!current[part]) current[part] = [];
        (current[part] as string[]).push(message);
      } else {
        if (!current[part]) current[part] = {};
        current = current[part] as GroupedErrors;
      }
    }
  };

  const walk = (list: ValidationError[], prefix: string) => {
    list.forEach((err) => {
      const currentPath = prefix ? `${prefix}.${err.property}` : err.property;

      console.log(err);

      // 1. Ошибки текущего поля
      if (err.constraints) {
        console.log('constraints', err);
        Object.values(err.constraints).forEach((raw) => {
          const msg = isI18nKey(raw) ? i18n.t(raw.slice(6)) : raw;
          addMessage(currentPath, msg as string);
        });
      }

      // 2. Вложенные ошибки
      if (err.children?.length) {
        console.log('children', err);
        if (isArrayOfPrimitives(err)) {
          // Массив примитивов → индексы
          err.children.forEach((child) => {
            if (child.constraints) {
              Object.values(child.constraints).forEach((raw) => {
                const msg = isI18nKey(raw) ? i18n.t(raw.slice(6)) : raw;
                addMessage(`${currentPath}.${child.property}`, msg as string);
              });
            }
          });
        } else {
          // Вложенный объект → рекурсия
          walk(err.children, currentPath);
        }
      }
    });
  };
  walk(errors, parentPath);

  return {
    errors: grouped,
    hasErrors: Object.keys(grouped).length > 0,
  };
};

// Вспомогательные функции
const isI18nKey = (msg: unknown): msg is string =>
  typeof msg === 'string' && msg.startsWith('i18n::');

const isArrayOfPrimitives = (err: ValidationError): boolean =>
  !!err.children?.every((c) => !c.children?.length);
