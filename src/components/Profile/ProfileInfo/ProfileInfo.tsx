import React from 'react';

import ProfileForm from '../../Form/ProfileForm';

import s from './ProfileInfo.module.scss';

export default function ProfileInfo() {
  return (
    <>
      <div className={s.info__form}>
        <ProfileForm />
      </div>
    </>
  )
}
