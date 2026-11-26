import { toast } from "sonner";

/**
 * One way to confirm admin actions. Use `done` after a save, delete or update succeeds and
 * `failed` when it does not, so every button gives the same kind of feedback.
 */
export const notify = {
  done: (title: string, description?: string) => toast.success(title, { description }),
  failed: (title: string, description?: string) => toast.error(title, { description, duration: 6000 }),
};

/** The message from a server result or a thrown error, or a fallback. */
export function reason(error: unknown, fallback = "Please try again.") {
  if (error instanceof Error && error.message && !/Minified React error|digest/i.test(error.message)) return error.message;
  return fallback;
}
