"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";

const Dashboard = () => {
  const [budgetList, setBudgetList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
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
    getAllExpense();
  };

  const getAllExpense = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.name,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpenseList(result);
  };

  return (
    <div className="p-8">
      <h2 className="font-bold text-4xl">Hi, {user?.fullName} ✌️</h2>
      <p className="text-gray-600">
        You Can Look after your money and Lets manage your expenses
      </p>
      <CardInfo budgetList={budgetList} />
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2">
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable
            expensesList={expenseList}
            refreshData={() => getBudgetList()}
          />
        </div>
        <div>
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgetList?.length > 0
            ? budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))
            : [1, 2, 3, 4].map((item, index) => (
                <div
                  className="h-[180xp] w-full
               bg-slate-200 rounded-lg animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
