// utils/paginate.ts
export function getPagination(query: any) {
  const page = Math.max(1, parseInt(query.page)) || 1;
  const limit = Math.max(1, parseInt(query.limit)) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
