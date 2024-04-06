const ALL_ITEMS = 'https://pang-server.vercel.app/shopping/items/all'
const fetchAllData = async () => {
  const response = await fetch(ALL_ITEMS, { method: 'GET' });
  const data = await response.json();
  return data;
}

export { fetchAllData }
