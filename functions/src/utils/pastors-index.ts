// This file contains the logic for creating and updating the pastors index.
// This index stores all pastors that have at least one service associated with them.

import { FieldValue } from "firebase-admin/firestore";
import { IPastorsIndex } from "../models/kerkdienst-gemist";
import { firestore } from "../firebase/firebase";

export async function isPastorInIndex(pastor: string) {
  const pastorsIndex = await firestore
    .collection("indexes")
    .doc("pastors")
    .get();

  const data = pastorsIndex.data() as IPastorsIndex;
  return data.names.includes(pastor);
}

export async function addPastorToIndexIfNotAlreadyExists(
  pastor: string,
): Promise<void> {
  await firestore
    .collection("indexes")
    .doc("pastors")
    .update({
      names: FieldValue.arrayUnion(pastor),
    });
}
