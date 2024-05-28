import { SetMetadata } from "@nestjs/common";

export const RESPONSE_MESSAGE = "response-message";
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);
