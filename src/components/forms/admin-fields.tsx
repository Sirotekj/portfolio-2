export const fieldClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary';

export function LevelSelect({ defaultValue = 3 }: { defaultValue?: number }) {
  return (
    <select
      id="level"
      name="level"
      defaultValue={defaultValue}
      className={fieldClass}
    >
      {[1, 2, 3, 4, 5].map((level) => (
        <option key={level} value={level}>
          {level} / 5
        </option>
      ))}
    </select>
  );
}

export function FormFeedback({
  errors,
  messages,
}: {
  errors: string[];
  messages: string[];
}) {
  return (
    <>
      {errors.length > 0 ? (
        <ul className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
      {messages.length > 0 ? (
        <ul className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
