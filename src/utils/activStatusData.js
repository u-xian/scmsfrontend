export const activStatusData = (dataArr, profileId, statusId) => {
  const dataArray = dataArr;
  //On Progress Level 2
  if (profileId === 3 && statusId === 1) {
    return dataArray.filter(
      (f) =>
        f.confirmation_lvl1 === 1 &&
        f.confirmation_lvl2 === 0 &&
        f.confirmation_lvl3 === 0
    );
  }
  //Approved Level 2
  if (profileId === 3 && statusId === 2) {
    return dataArray.filter(
      (f) =>
        f.status === 0 &&
        f.confirmation_lvl1 === 1 &&
        f.confirmation_lvl2 === 1 &&
        f.confirmation_lvl3 === 0
    );
  }

  //Rejected Level 2
  if (profileId === 3 && statusId === 4) {
    return dataArray.filter(
      (f) =>
        f.confirmation_lvl1 === 1 &&
        f.confirmation_lvl2 === 1 &&
        f.confirmation_lvl3 === 2
    );
  }

  //On Progress  Level 3
  if (profileId === 4 && statusId === 1) {
    return dataArray.filter(
      (f) =>
        f.confirmation_lvl1 === 1 &&
        f.confirmation_lvl2 === 1 &&
        f.confirmation_lvl3 === 0
    );
  }
  //Approved Level 3
  if (profileId === 4 && statusId === 2) {
    return dataArray.filter(
      (f) =>
        f.status === 0 &&
        f.confirmation_lvl1 === 1 &&
        f.confirmation_lvl2 === 1 &&
        f.confirmation_lvl3 === 1
    );
  }

  //Rejected Level 3
  if (profileId === 4 && statusId === 4) {
    return dataArray.filter(
      (f) =>
        f.confirmation_lvl1 === 1 &&
        f.confirmation_lvl2 === 1 &&
        f.confirmation_lvl3 === 2
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
  //All
  if (statusId === 5) {
    return dataArray;
  }
};
