const { firestore } = require("../configs/firebase");
const stripe = require("../configs/stripe");

exports.createOrGetCustomer = async (uid, params) => {
  const userSnapshot = await firestore.collection("users").doc(uid).get();

  const { stripeCustomerId = null, email, displayName } = userSnapshot.data();

  // check if email and displayName valid
  if (!email || !displayName) {
    throw new Error("Invalid User");
  }

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        firebaseUID: uid,
      },
      ...params,
    });

    await firestore.collection("users").doc(uid).set(
      {
        stripeCustomerId: customer.id,
      },
      { merge: true }
    );

    return customer;
  } else {
    return await stripe.customers.retrieve(stripeCustomerId);
  }
};
