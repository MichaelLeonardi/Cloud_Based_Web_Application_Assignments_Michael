type LogMeta = Record<string, unknown> | unknown;

export function logInfo(message: string, meta?: LogMeta) {
  console.log(
    JSON.stringify({
      level: "info",
      message,
      meta,
      timestamp: new Date().toISOString(),
    })
  );
}

export function logError(message: string, error?: unknown) {
  const formattedError =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;

  console.error(
    JSON.stringify({
      level: "error",
      message,
      error: formattedError,
      timestamp: new Date().toISOString(),
    })
  );
}

export function logPerf(route: string, durationMs: number) {
  console.log(
    JSON.stringify({
      level: "performance",
      route,
      durationMs,
      timestamp: new Date().toISOString(),
    })
  );
}
