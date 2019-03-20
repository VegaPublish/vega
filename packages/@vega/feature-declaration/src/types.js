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

export type DeclarationConfig = FeatureConfig & {
  title: string,
  description: string,
  question: string
}

export type DeclarationState = FeatureState & {
  title: string,
  description: string,
  question: string,
  isDeclared: boolean,
  declaredAt: string,
  declaredBy: Reference
}
