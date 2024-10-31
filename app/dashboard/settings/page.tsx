'use client'
// app/settings/account/page.tsx

import ContentSection from "./_components/content-section";
import ProfileForm from "./profile/_components/profile-form";


export default function SettingsPage() {
  return (
    <ContentSection
    title='Profile'
    desc='This is how others will see you on the site.'
  >
    <ProfileForm />
  </ContentSection>
  )
}
