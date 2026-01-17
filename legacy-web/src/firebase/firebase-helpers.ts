import {
	onSnapshot,
	DocumentSnapshot,
	QuerySnapshot,
	CollectionReference,
	DocumentReference,
	Query,
} from 'firebase/firestore'

export function mapValues<T extends { id: string }>(
	snap: QuerySnapshot<T>
): T[] {
	const values: T[] = []

	if (snap.empty) {
		return values
	}

	snap.forEach(doc => {
		values.push({ ...doc.data(), id: doc.id } as T)
	})

	return values
}

export function subscribe<T extends { id: string }>(
	ref: DocumentReference<T>,
	cb: (data: T | undefined) => void | undefined
) {
	return onSnapshot<T>(ref, (snap: DocumentSnapshot<T>) => {
		cb(snap.exists() ? ({ ...snap.data(), id: snap.id } as T) : undefined)
	})
}

export function subscribeAll<T extends { id: string }>(
	ref: CollectionReference<T> | Query<T>,
	cb: (data: T[]) => void | undefined
) {
	return onSnapshot<T>(ref, (snap: QuerySnapshot<T>) => {
		cb(mapValues<T>(snap))
	})
}
