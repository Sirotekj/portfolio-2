export const fieldClass = 'admin-field';

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
        <ul className="admin-feedback admin-feedback--error">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
      {messages.length > 0 ? (
        <ul className="admin-feedback admin-feedback--success">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
