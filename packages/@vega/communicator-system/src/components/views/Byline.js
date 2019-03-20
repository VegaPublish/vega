import React from 'react'
import styles from './styles/Byline.css'
import {getProfileImageUrl} from 'part:@vega/datastores/user'
import {distanceInWordsToNow} from 'date-fns'

type Props = {
  author: {
    name: string,
    image: ?string,
    externalImageUrl: ?string
  },
  time: string
}

export default function Byline(props: Props) {
  const {author, time} = props
  const imageUrl = getProfileImageUrl(author)
  return (
    <div className={styles.root}>
      {imageUrl ? (
        <img className={styles.image} src={imageUrl} />
      ) : (
        <div className={styles.imagePlaceholder} />
      )}
      {author.name && <span className={styles.name}>{author.name}</span>}
      <div className={styles.time}>{distanceInWordsToNow(time)} ago</div>
    </div>
  )
}
