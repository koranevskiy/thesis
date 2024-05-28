import { HttpStatus } from "@nestjs/common";

export class DomainException extends Error {
  constructor(public clientInformation: Record<string, any> & { message: string; code?: number | HttpStatus }) {
    super(clientInformation.message);
    this.name = this.constructor.name;
  }
}
