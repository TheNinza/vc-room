const { FRONT_END, STRIPE_WEBHOOK_SECRET } = require("../configs/environments");
const {
  firestore,
  increment,
  arrayUnion,
  timestamp,
} = require("../configs/firebase");
const stripe = require("../configs/stripe");
const { createOrGetCustomer } = require("../utils/stripeUtilityFunctions");
const { validateUser } = require("../utils/validateUser");

exports.products = async (req, res) => {
  try {
    validateUser(req);

    const { data } = await stripe.prices.list();

    const prices = data.map((item) => {
      return {
        id: item.id,
        amount: item.unit_amount / 100,
        currency: item.currency,
        quantity: item.transform_quantity.divide_by,
        name: item.nickname,
      };
    });

    // calculate percentatge discounts based on lowest price

    // lowest price
    const lowestPrice = prices.reduce((lowest, current) => {
      if (current.amount < lowest.amount) {
        return current;
      } else {
        return lowest;
      }
    });

    prices.forEach((item) => {
      const numberOfQuantityOfLowestPrice =
        item.quantity / lowestPrice.quantity;
      const ammountBasedOnLowestPrice =
        lowestPrice.amount * numberOfQuantityOfLowestPrice;
      const discount = ammountBasedOnLowestPrice - item.amount;

      const discountPercentage = (discount / ammountBasedOnLowestPrice) * 100;

      item.discountPercentage = discountPercentage;
    });

    res.status(200).json({
      message: "Products fetched successfully",
      prices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const customer = await createOrGetCustomer(uid);

    const priceId = req.body.id;

    // create a stripe checkout session with the priceId and customer
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customer.id,
      mode: "payment",
      success_url: `${FRONT_END}/payments?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONT_END}/payments?sessionId={CHECKOUT_SESSION_ID}`,
      metadata: {
        priceId,
      },
    });

    // store this session to firebase for future reference
    const sessionsRef = firestore
      .collection("accounts")
      .doc(uid)
      .collection("sessions")
      .doc(session.id);

    await sessionsRef.set({
      sessionId: session.id,
      createdAt: timestamp(),
    });

    res.status(200).json({
      message: "Checkout session created successfully",
      session,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.retrieveSessionDetails = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const sessionId = req.body.sessionId;

    // check if session exists in firebase
    const sessionRef = firestore
      .collection("accounts")
      .doc(uid)
      .collection("sessions")
      .doc(sessionId);

    const sessionSnapshot = await sessionRef.get();

    if (!sessionSnapshot.exists) {
      res.status(404).json({
        message: "Session not found",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    // fetch price details from stripe
    const price = await stripe.prices.retrieve(session.metadata.priceId);

    res.status(200).json({
      paymentStatus: session.payment_intent.status,
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
        receiptUrl: session.payment_intent?.charges.data[0]?.receipt_url,
        resumeUrl: session.url,
      },
      message: "Successfully retrieved session details",
      price: {
        name: price.nickname,
        amount: price.unit_amount / 100,
        quantity: price.transform_quantity.divide_by,
      },
      customerEmail: session.customer_details.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const event = stripe.webhooks.constructEvent(
    req["rawBody"],
    sig,
    STRIPE_WEBHOOK_SECRET
  );

  console.log(`Hooks Received For ======>>>>> ${event.type}`);

  try {
    if (event.type === "checkout.session.completed") {
      const {
        customer,
        metadata: { priceId },
        payment_status,
        id: sessionId,
      } = event.data.object;

      // check if the payment was successful and then update user's call credits in firebase

      const {
        metadata: { firebaseUID },
      } = await stripe.customers.retrieve(customer);

      const {
        transform_quantity: { divide_by: credits },
      } = await stripe.prices.retrieve(priceId);

      const batch = firestore.batch();

      // update user's call credits in firebase
      const userRef = firestore.collection("accounts").doc(firebaseUID);

      batch.update(userRef, {
        credits: increment(credits),
      });

      // update session in firebase
      const sessionRef = userRef.collection("sessions").doc(sessionId);

      batch.update(sessionRef, {
        paymentStatus: payment_status,
        paidAt: timestamp(),
      });

      await batch.commit();
    }

    res.status(200).json({
      message: "Webhook received successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ webhookError: error.message });
  }
};
