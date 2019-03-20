import {
  List as DefaultList,
  Item as DefaultListItem
} from 'part:@lyra/components/lists/default'
import {
  List as SortableList,
  Item as SortableListItem
} from 'part:@lyra/components/lists/sortable'
import {
  List as GridList,
  Item as GridListItem
} from 'part:@lyra/components/lists/grid'
import {
  List as SortableGridList,
  Item as SortableGridListItem
} from 'part:@lyra/components/lists/sortable-grid'

export default function resolveListComponents(
  isSortable: boolean,
  isGrid: boolean
) {
  if (isSortable) {
    return isGrid
      ? {List: SortableGridList, Item: SortableGridListItem}
      : {List: SortableList, Item: SortableListItem}
  }
  return isGrid
    ? {List: GridList, Item: GridListItem}
    : {List: DefaultList, Item: DefaultListItem}
}
