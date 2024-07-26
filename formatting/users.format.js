const formatRegistrationData = (user) => {
  const formattedUser = { ...user };
  formattedUser.firstName =
    formattedUser.firstName.charAt(0).toUpperCase() +
    formattedUser.firstName.slice(1);
  if (formattedUser.middleName) {
    formattedUser.middleName =
      formattedUser.middleName.charAt(0).toUpperCase() +
      formattedUser.middleName.slice(1);
  }
  formattedUser.lastName =
    formattedUser.lastName.charAt(0).toUpperCase() +
    formattedUser.lastName.slice(1);
  if (formattedUser.locationCity) {
    formattedUSer.locationCity = formattedUser.locationCity
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return formattedUser;
};

module.exports = {
  formatRegistrationData,
};
