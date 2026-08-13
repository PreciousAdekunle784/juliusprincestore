import { getCoupons } from "@/lib/admin";
import { CouponManager } from "@/components/admin/coupon-manager";

export default async function AdminCoupons() {
  const coupons = await getCoupons();
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Coupons</h1>
      <CouponManager initial={coupons} />
    </div>
  );
}
