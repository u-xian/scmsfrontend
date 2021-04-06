export const getMaxID = (dataArr) => {
  const dataArray = dataArr;
  const IdArray = dataArray.map((d) => {
    return d.id;
  });

  const max = IdArray.reduce(function (previousValue, currentValue) {
    return Math.max(previousValue, currentValue);
  });

  return max;
};
