import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as Error;
  console.error(error);

  let errorMessage: JSX.Element;
  if (isRouteErrorResponse(error)) {
    errorMessage = (
      <p>
        {error.status} {error.statusText}
      </p>
    );
  } else {
    errorMessage = <p>{error.message || "Unknown Error"}</p>;
  }

  return (
    <div id="error-page" className="grid place-content-center h-screen">
      <h1 className="text-3xl">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {errorMessage}
    </div>
  );
}
