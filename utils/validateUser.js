exports.validateUser = (req) => {
  const user = req["currentUser"];
  if (!user) {
    throw new Error("You must be logged in to make this request!");
  }
  return user;
};
