// @flow
type Reference = {
  _ref: string
}
type FeatureConfig = {
  _id: string,
  _type: string
}
type FeatureState = {
  _id: string,
  article: Reference,
  featureConfig: Reference
}

export type DueDateConfig = FeatureConfig & {
  title: string,
  description: string
}

export type DueDateState = FeatureState & {
  dueAt: string
}
