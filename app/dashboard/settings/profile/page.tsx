import ContentSection from "../_components/content-section"
import { ProfileForm } from "./_components/profile-form"

export default function ProfilePage() {
  return (
    <ContentSection
      title="Profile"
      desc="Manage your personal information and preferences."
    >
      <ProfileForm />
    </ContentSection>
  )
}