const sharp = require("sharp");
const { bucket, firestore, auth } = require("../configs/firebase");
const { validateUser } = require("../utils/validateUser");

exports.updateUser = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const { displayName, status, image } = req.body;

    // check if any of the fields are present
    if (!displayName && !status && !image) {
      return res.status(400).json({
        message: "Please provide atleast one field to update",
      });
    }

    // get the userRef from firestore
    const userRef = firestore.collection("users").doc(uid);

    // update displayName if present and not empty and only 50 characters
    if (displayName) {
      if (displayName.length > 50) {
        return res.status(400).json({
          message: "Display name should be less than 50 characters",
        });
      }

      // remove whitespaces from the displayName
      const displayNameWithoutSpaces = displayName.trim();

      // check if displayName is empty
      if (displayNameWithoutSpaces.length === 0) {
        return res.status(400).json({
          message: "Display name cannot be empty",
        });
      }

      // update the displayName
      await userRef.update({ displayName: displayNameWithoutSpaces });
    }

    // update status if present and not empty and only 80 characters
    if (status) {
      if (status.length > 80) {
        return res.status(400).json({
          message: "Status should be less than 80 characters",
        });
      }

      // remove whitespaces from the status
      const statusWithoutWhitespaces = status.trim();

      // check if the status is empty
      if (statusWithoutWhitespaces.length === 0) {
        return res.status(400).json({
          message: "Status cannot be empty",
        });
      }

      // update the status
      await userRef.update({ status: statusWithoutWhitespaces });
    }

    // handle image only if image is present
    if (image) {
      // check if image is less than 5mb
      if (image.length > 5000000) {
        return res.status(400).json({
          message: "Image should be less than 5mb",
        });
      }

      // get the image extension
      const imageExtension = image.split(";")[0].split("/")[1];

      // check if image extension is valid
      if (
        imageExtension !== "jpeg" &&
        imageExtension !== "jpg" &&
        imageExtension !== "png"
      ) {
        return res.status(400).json({
          message: "Please provide a valid image",
        });
      }

      // check if image is correct base64 format
      if (!image.startsWith("data:image/" + imageExtension)) {
        return res.status(400).json({
          message: "Please provide a valid image",
        });
      }

      // resize image create a buffer from the image
      const imageBuffer = Buffer.from(image.split(",")[1], "base64");

      // resize the image
      const resizedBuffer = await sharp(imageBuffer)
        .resize({ width: 300 })
        .toBuffer();

      const imageName = `${uid}.${imageExtension}`;

      // check if the image already exists in profileImage folder
      const imageRef = bucket.file(`profileImages/${imageName}`);

      const [imageExists] = await imageRef.exists();
      if (imageExists) {
        await imageRef.delete();
      }

      // upload the image to firebase storage
      await bucket.file(`profileImages/${imageName}`).save(resizedBuffer);

      // get the download url of the image
      const imageDownloadUrl = await imageRef.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      // update the photoURL in firestore
      await userRef.update({ photoURL: imageDownloadUrl[0] });
    }

    // return success message
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { uid } = validateUser(req);

    // create a batch to delete the user
    const batch = firestore.batch();

    // get the userRef from firestore
    const userRef = firestore.collection("users").doc(uid);

    // get the user data
    const userData = await userRef.get();

    // check if the user exists
    if (!userData.exists) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // get all the notifications to the user
    const notificationsToUser = await firestore
      .collection("notifications")
      .where("to", "==", uid)
      .get();

    // get all the notifications from the user
    const notificationsFromUser = await firestore
      .collection("notifications")
      .where("from", "==", uid)
      .get();

    const allNotifications = [
      ...notificationsToUser.docs,
      ...notificationsFromUser.docs,
    ];

    // get all the notifications ids
    const notificationIds = allNotifications.map(
      (notification) => notification.id
    );

    // delete all the notifications
    notificationIds.forEach((notificationId) => {
      batch.delete(firestore.collection("notifications").doc(notificationId));
    });

    // get all notifications data
    const allNotificationsData = allNotifications.map((notification) => ({
      ...notification.data(),
      id: notification.id,
    }));

    allNotificationsData.forEach((notification) => {
      if (notification.to === uid) {
        const fromRef = firestore.collection("users").doc(notification.from);
        const friendCollectionOfFromRef = fromRef.collection("friends");
        const friendRef = friendCollectionOfFromRef.doc(uid);
        batch.delete(friendRef);

        const notificationRefOfFromRef = fromRef
          .collection("notifications")
          .doc(notification.id);
        batch.delete(notificationRefOfFromRef);
      }

      if (notification.from === uid) {
        const toRef = firestore.collection("users").doc(notification.to);
        const friendCollectionOfToRef = toRef.collection("friends");
        const friendRef = friendCollectionOfToRef.doc(uid);
        batch.delete(friendRef);

        const notificationRefOfToRef = toRef
          .collection("notifications")
          .doc(notification.id);
        batch.delete(notificationRefOfToRef);
      }
    });

    // delete the user
    batch.delete(userRef);

    // commit the batch
    await batch.commit();

    // delete all profile images in firebase storage
    bucket.getFiles(
      {
        prefix: `profileImages/${uid}`,
      },
      async (err, files) => {
        if (err) {
          throw err;
        }
        files.forEach(async (file) => {
          await file.delete();
        });
      }
    );

    // delete the user from the firebase auth
    await auth.deleteUser(uid);

    // return success message
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};
