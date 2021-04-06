export const activationsByStatus = (dataArr, statusId) => {
  const dataArray = dataArr;

  //On Progress Level
  if (statusId === 1) {
    return dataArray.filter(
      (f) =>
        f.confirmation_lvl1 === 1 &&
        (f.confirmation_lvl2 === 0 || f.confirmation_lvl3 === 0)
    );
  }

  //Approved Level
  if (statusId === 2) {
    return dataArray.filter(
      (f) =>
        f.status === 0 &&
        f.confirmation_lvl1 === 1 &&
        f.confirmation_lvl2 === 1 &&
        f.confirmation_lvl3 === 0
    );
  }

  //Activated
  if (statusId === 3) {
    return dataArray.filter(
      (f) =>
        f.status === 1 &&
        f.confirmation_lvl1 === 1 &&
        f.confirmation_lvl2 === 1 &&
        f.confirmation_lvl3 === 1
    );
  }

  //Rejected Level 3
  if (statusId === 4) {
    return dataArray.filter(
      (f) =>
        f.confirmation_lvl1 === 1 &&
        ((f.confirmation_lvl2 === 1 && f.confirmation_lvl3 === 2) ||
          (f.confirmation_lvl2 === 2 && f.confirmation_lvl3 === 2))
    );
  }

  //All
  if (statusId === 5) {
    return dataArray;
  }
};
