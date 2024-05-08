import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema";
import moment from "moment/moment";
import React, { useState } from "react";
import { toast } from "sonner";
import { Loader } from 'lucide-react';

const AddExpenses = ({ budgetId, user, refreshData }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const addNewExpense = async () => {
    setLoading(true);
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        createdAt: moment().format("YYYY-MM-DD"),
      })
      .returning({ insertedId: Budgets.id });
    setName("");
    setAmount("");

    if (result) {
      setLoading(false);
      refreshData();
      toast("A new Expense is created");
    }
  };
  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expenses</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        className="mt-3 w-full"
        disabled={!(name && amount) || loading}
        onClick={() => addNewExpense()}
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
};

export default AddExpenses;
