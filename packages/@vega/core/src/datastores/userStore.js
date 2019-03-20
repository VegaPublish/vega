// @flow
// Do you need the currently logged in vega user? Just...
// import {currentUser$} from 'part:@vega/core/datastores/user-store'
// return currentUser$.map(result => ({user: result}))

import userStore from 'part:@lyra/base/user'
import lyraClient from 'part:@lyra/base/client'
import {Observable, of as observableOf} from 'rxjs'
import {map, mergeMap, publishReplay, refCount} from 'rxjs/operators'
import imageUrlBuilder from '@lyra/image-url'

type Identity = {
  id: string,
  name: string,
  email: string,
  externalId: string,
  profileImage: string
}

type VegaUser = {
  _id: string,
  _type: 'user',
  name: string,
  email: string,
  identity: string,
  externalProfileImageUrl?: string,
  profileImage?: {
    asset?: {
      _ref?: string
    }
  }
}

const USER_QUERY = `*[_type=='user' && identity == $identity][0]`

const findVegaUser = (identity: Identity): Observable<VegaUser> =>
  identity
    ? lyraClient.observable.fetch(USER_QUERY, {identity: identity.id})
    : observableOf(null)

let imageUrlFor = null
const getBuilder = () => {
  if (!imageUrlFor) {
    const conf = lyraClient.config()
    imageUrlFor = imageUrlBuilder({
      dataset: conf.dataset,
      apiHost: conf.apiHost
    })
  }
  return imageUrlFor
}

type ImageUrlBuilder = {
  width: number => ImageUrlBuilder,
  height: number => ImageUrlBuilder,
  url: () => string
}

type SetParams = ImageUrlBuilder => ImageUrlBuilder
const defaultSetParams = builder => builder.width(512).height(512)

export function getProfileImageUrl(
  user: VegaUser,
  setParams: SetParams = defaultSetParams
): ?string {
  const hasImageRef =
    user.profileImage && user.profileImage.asset && user.profileImage.asset._ref
  return hasImageRef
    ? setParams(getBuilder().image(user.profileImage)).url()
    : user.externalProfileImageUrl
}

export function logout(): void {
  userStore.actions.logout()
}

export const currentIdentity$ = userStore.currentUser.pipe(
  map(event => event.user)
)

export const currentUser$ = currentIdentity$.pipe(
  mergeMap(findVegaUser),
  publishReplay(1),
  refCount()
)
