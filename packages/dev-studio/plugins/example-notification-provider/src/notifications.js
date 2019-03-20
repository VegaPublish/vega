import {NEVER, of as observableOf} from 'rxjs'
import {truncate} from 'lodash'
import {DEBUG} from './debug-helpers'

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus erat quis porttitor finibus. Nullam malesuada vestibulum libero id pulvinar. Praesent a leo auctor, dapibus nunc sed, congue urna. Curabitur dictum, leo in porttitor placerat, nisi erat vulputate massa, ut laoreet massa eros ac elit. Vestibulum efficitur nulla sit amet odio euismod, eu tempor nisl consequat. Curabitur id urna sit amet tortor ultricies facilisis at vel nisl. Aliquam sed augue urna. Quisque sed dui at ipsum iaculis eleifend in a arcu. Donec et tellus eget ipsum facilisis fringilla. Nullam tincidunt nulla eu metus consequat, et vulputate nibh congue. Vestibulum vitae nulla mattis, sodales sapien non, ultrices justo. Praesent ornare quam et imperdiet ultricies. Etiam id odio vitae justo ornare euismod elementum id nulla. Nunc volutpat nunc eget tempus mattis. Maecenas justo mi, viverra ac dolor quis, condimentum aliquet nisl. Etiam aliquet turpis vitae mi sodales fermentum. Aenean ut ultricies dolor. Praesent mollis ante elementum interdum lacinia. Pellentesque rutrum massa nec ante molestie, sodales sagittis mi bibendum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque ut sagittis purus, eget egestas nunc. In hac habitasse platea dictumst. Maecenas vel lectus nec sem posuere porta. Integer varius mollis quam nec hendrerit.`

const MOCKED_NOTIFICATIONS = new Array(2)
  .fill(0)
  .map(() => (Math.random() * LOREM.length - 40).toFixed())
  .map(start => ({
    id: Math.random()
      .toString(32)
      .substring(2),
    title: `Hey ${start}`,
    description: truncate(
      LOREM.substring(
        start,
        start + ((Math.random() * LOREM.length) / 2).toFixed()
      )
    ),
    timestamp: new Date(new Date().getTime() - 1000 * 60 * 60),
    intent: {
      name: 'edit',
      params: {
        type: 'article',
        id: 'article_0821ef4e78fa62cf5646ebba29822e8d'
      }
    }
  }))

export default {
  title: 'Example provider',
  notifications$: DEBUG ? observableOf(MOCKED_NOTIFICATIONS) : NEVER
}
