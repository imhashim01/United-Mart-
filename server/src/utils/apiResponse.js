export class ApiResponse {
  constructor(statusCode, data = null, message = 'Success', meta = undefined) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== null && data !== undefined) this.data = data;
    if (meta !== undefined) this.meta = meta;
  }
}

export const sendResponse = (res, statusCode, data, message, meta) =>
  res.status(statusCode).json(new ApiResponse(statusCode, data, message, meta));

export default ApiResponse;
