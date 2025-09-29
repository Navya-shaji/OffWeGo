
import { useEffect, useState } from "react";
import ReusableTable from "../Modular/Table"; 
import { getSubscriptions } from "@/services/subscription/subscriptionservice";
import { subscriptionColumns   } from "../Modular/subsriptioncolumn"; 
import type { Subscription } from "@/interface/subscription";
const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    getSubscriptions().then(setSubscriptions).catch(console.error);
  }, []);

  const handleEdit = (subscription: Subscription) => {
    console.log("Edit", subscription);
  
  };

  const handleDelete = (subscription: Subscription) => {
    console.log("Delete", subscription);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Subscriptions</h2>
      <ReusableTable
        data={subscriptions}
        columns={subscriptionColumns(handleEdit, handleDelete)}
      />
    </div>
  );
};

export default SubscriptionList;