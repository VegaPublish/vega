// @flow

type ChecklistItem = {
  name: string,
  title: string
}
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
type ChecklistItemResult = {
  completedItemName: string,
  completedAt: string,
  completedBy: Reference
}
export type ChecklistFeatureState = FeatureState & {
  title: string,
  items: Array<ChecklistItemResult>
}
export type ChecklistFeatureConfig = FeatureConfig & {
  title: string,
  items: Array<ChecklistItem>
}
