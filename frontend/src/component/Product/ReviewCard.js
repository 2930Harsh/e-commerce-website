import React from 'react'
import ProfilePng from '../../images/Profile.png'
import { Rating } from '@material-ui/lab'

const ReviewCard = ({review}) => {

    const options = {
      value: review.rating , 
      readOnly: true,
      precision: 0.25
    }

  return (
    <div className='reviewCard'>
        <img src={ProfilePng} alt='User'/>
        <p>{review.name}</p>
        <Rating {...options} />
        <span className='reviewCardComment'>{review.comment}</span>
    </div>
  )
}

export default ReviewCard