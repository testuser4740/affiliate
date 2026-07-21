import { HttpError } from 'routing-controllers';

export class NotFoundError extends HttpError {
    constructor(message = 'Resource not found!') {
        super(404, message);
    }
}

export class ValidationError extends HttpError {
    constructor(message = 'Validation failed!') {
        super(422, message);
    }
}

export class ConflictError extends HttpError {
    constructor(message = 'Conflict!') {
        super(409, message);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized!') {
        super(401, message);
    }
}

export class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden!') {
        super(403, message);
    }
}
