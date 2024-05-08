"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";

const Dashboard = () => {
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  // Add your logic here to get  the list

  // useEffect

  useEffect(() => {
    user && getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItems: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    setBudgetList(result);
  };
  return (
    <div className="p-8">
      <h2 className="font-bold text-4xl">Hi, {user?.fullName} ✌️</h2>
      <p>You Can Look after your money and Lets manage your expenses</p>
      <CardInfo budgetList={budgetList} />
    </div>
  );
};

export default Dashboard;
