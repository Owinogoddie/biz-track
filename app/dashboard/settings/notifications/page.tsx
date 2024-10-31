"use client";
import ContentSection from "../_components/content-section";
import { NotificationsForm } from "./_components/notifications-form";

export default function SettingsNotifications() {
  return (
    <ContentSection
      title="Notifications"
      desc="Configure how you receive notifications."
    >
      <NotificationsForm />
    </ContentSection>
  );
}
