// src/common/services/error.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  groupValidationErrors,
  ValidationResult,
  GroupedErrors,
} from '../utils/validation.utils';
import { ValidationError } from 'class-validator';

@Injectable()
export class ErrorService {
  private readonly logger = new Logger(ErrorService.name);

  constructor(private readonly i18n: I18nService) {}

  /**
   * Обрабатывает ошибки валидации.
   * Принимает либо ValidationError[] от class-validator,
   * либо произвольный массив/объект кастомных ошибок.
   */
  processValidationErrors(
    rawErrors: unknown,
    context: string = 'Validation',
  ): ValidationResult {
    // 1. Пытаемся привести к ValidationError[]
    const validationErrors = rawErrors as ValidationError[];

    if (validationErrors) {
      const result = groupValidationErrors(validationErrors, this.i18n);
      this.logIfNeeded(result, context);
      return result;
    }

    // 2. Кастомные ошибки
    const grouped = this.normalizeCustomErrors(rawErrors);
    const hasErrors = Object.keys(grouped).length > 0;
    const result: ValidationResult = { errors: grouped, hasErrors };

    this.logIfNeeded(result, context);
    return result;
  }

  /** Формирует HTTP-ответ */
  buildValidationResponse(
    validationResult: ValidationResult,
    status: number = 400,
  ) {
    return {
      statusCode: status,
      message: validationResult.hasErrors ? 'Validation failed' : 'No errors',
      errors: validationResult.errors,
    };
  }

  /* --------------------------------------------------------------------- */
  /*                         Внутренние вспомогательные методы                     */
  /* --------------------------------------------------------------------- */

  /** Пытается безопасно привести unknown → ValidationError[] */
  // private tryAsValidationErrorArray(input: unknown): ValidationError[] | null {
  //   return input as ValidationError[];
  // }

  /** Приводит кастомные ошибки к GroupedErrors */
  private normalizeCustomErrors(input: unknown): GroupedErrors {
    const result: GroupedErrors = {};

    if (Array.isArray(input)) {
      input.forEach((item: unknown) => {
        if (
          typeof item === 'object' &&
          item !== null &&
          'field' in item &&
          'message' in item &&
          typeof item.field === 'string' &&
          typeof item.message === 'string'
        ) {
          const { field, message } = item as { field: string; message: string };

          if (!result[field]) {
            result[field] = []; // ← Явная инициализация
          }

          (result[field] as string[]).push(message); // ← Безопасный push
        }
      });
    } else if (typeof input === 'object' && input !== null) {
      Object.assign(result, input);
    }

    return result;
  }

  /** Логирует только если есть ошибки */
  private logIfNeeded(result: ValidationResult, context: string) {
    if (result.hasErrors) {
      this.logger.error(
        JSON.stringify(
          {
            context,
            errors: result.errors,
          },
          null,
          2,
        ),
      );
    }
  }
}
