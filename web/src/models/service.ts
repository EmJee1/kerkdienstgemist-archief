import { Timestamp } from 'firebase/firestore'

export interface IService {
  id: string
  title: string
  file: string
  createdAt: Timestamp
  pastor?: string
}

export interface IPastorsIndex {
  names: string[]
}
