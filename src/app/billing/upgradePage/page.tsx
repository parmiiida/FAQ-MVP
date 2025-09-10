import { Suspense } from "react";
import UpgradePageContent from "@/components/UpgradePageContent";

export default function UpgradePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpgradePageContent />
    </Suspense>
  );
}
