import { useInfiniteQuery } from "react-query";

const useRemotePunchingQuery = () => {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    {
      queryKey: ["remote-punching"],
      queryFn: fetchData,
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pageParams: [1],
      },
    }
  );
  return { data, fetchNextPage, isFetchingNextPage };
};

export default useRemotePunchingQuery;
