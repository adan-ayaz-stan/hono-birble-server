export function getErrorMessage(error: any): string {
  try {
    if (error instanceof Error) {
      return error.message;
    } else {
      return String(error);
    }
  } catch {
    return "Something went wrong!";
  }
}
