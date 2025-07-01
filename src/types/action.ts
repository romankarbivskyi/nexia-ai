/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
