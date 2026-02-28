type ErrorTextProps = {
  text: string[] | string
}

export const ErrorText = ({ text }: ErrorTextProps) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-error-bg/40 text-error-text animate-shake mt-4 w-full p-4"
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase md:text-base">
        <span aria-hidden="true">&gt;</span>
        <span aria-hidden="true">Critical_error_detected</span>
        <span className="sr-only">Critical_error_detected</span>
      </div>
      <div className="text-xs uppercase md:text-sm">
        {Array.isArray(text) ? (
          text.map((error, index) => (
            <p key={`${error}-${index}`} className="my-1">
              <span aria-hidden="true">[!] </span>
              {error}
            </p>
          ))
        ) : (
          <p className="my-1">{text}</p>
        )}
      </div>
    </div>
  )
}
