import { LoaderBar } from "../helpers/loaders";

const WithLoader = ({ children, isLoading }) => {
  if (isLoading) return <LoaderBar />;
  return children;
};

export default WithLoader;
