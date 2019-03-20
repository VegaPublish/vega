import {Subject} from 'rxjs'

const roles = new Subject()

export function setCurrentRole(role) {
  roles.next(role)
}

export const setCurrentRole$ = roles
  .asObservable()
  .publishReplay(1)
  .refCount()
