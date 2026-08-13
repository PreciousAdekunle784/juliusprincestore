import { ProfileForm } from "@/components/account/profile-form";
import { ChangePassword } from "@/components/account/change-password";

export const metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display font-bold text-xl mb-5">Profile</h2>
        <ProfileForm />
      </section>
      <section>
        <h2 className="font-display font-bold text-xl mb-5">Password</h2>
        <ChangePassword />
      </section>
    </div>
  );
}
