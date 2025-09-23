// Profile

import { redirect } from "next/navigation";
import ProfileContent from "./profile-server";

export default function ProfilePage() {
  redirect("/profile/info");
}
