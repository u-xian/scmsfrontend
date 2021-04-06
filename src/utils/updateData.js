export const updateData = (dataArr, itemupdate, Id) => {
  const dataArray = dataArr;
  let updatedList = dataArray.map((item) => {
    if (item.id === Id) {
      return { ...item, status: itemupdate };
    }
    return item;
  });
  return updatedList;
};
