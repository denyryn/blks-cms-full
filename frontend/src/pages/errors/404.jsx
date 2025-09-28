import ErrorPage from "@/components/error-page";

export default function NotFoundPage(props) {
  return <ErrorPage errorType="404" {...props} />;
}
