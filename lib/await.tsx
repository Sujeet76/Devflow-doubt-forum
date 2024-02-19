import { JSX } from "react";

/**
 * Asynchronously waits for a promise to resolve and renders the result using the provided children function.
 * @template T The type of the value returned by the promise.
 * @param {Object} props The component props.
 * @param {Promise<T>} props.promise The promise to wait for.
 * @param {(value: T) => JSX.Element} props.children The function that renders the result of the promise.
 * @returns {JSX.Element} The rendered result of the promise.
 */
export default async function Await<T>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (value: T) => JSX.Element;
}) {
  const data = await promise;
  return children(data);
}
