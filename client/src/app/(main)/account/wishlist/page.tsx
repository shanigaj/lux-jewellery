import { redirect } from "next/navigation";

// The real wishlist lives at /wishlist (backed by the Redux store). This route
// used to render a divergent, mock wishlist — redirect to the canonical one.
export default function AccountWishlistPage() {
  redirect("/wishlist");
}
