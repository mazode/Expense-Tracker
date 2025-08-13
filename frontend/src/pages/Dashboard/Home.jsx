import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useEffect, useState } from "react";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import InfoCard from "../../components/Cards/InfoCard";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last60DaysExpenses from "../../components/Dashboard/Last60DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (loading) return;
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(
          `${API_PATHS.DASHBOARD.GET_DATA}`
        );
        if (response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(
          error.response?.data?.message || "Failed to fetch dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array since we handle the loading state inside fetchDashboardData

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                icon={<IoMdCard />}
                label="Total Balance"
                value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
                color="bg-primary"
              />

              <InfoCard
                icon={<LuWalletMinimal />}
                label="Total Income"
                value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
                color="bg-orange-500"
              />

              <InfoCard
                icon={<LuHandCoins />}
                label="Total Expense"
                value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
                color="bg-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <RecentTransactions
                transactions={dashboardData?.recentTransactions}
                onSeeMore={() => navigate("/expense")}
              />

              <FinanceOverview
                totalBalance={dashboardData?.totalBalance || 0}
                totalIncome={dashboardData?.totalIncome || 0}
                totalExpense={dashboardData?.totalExpense || 0}
              />

              <ExpenseTransactions
                transactions={dashboardData?.lastExpense?.transactions || []}
                onSeeMore={() => navigate("/expense")}
              />

              <Last60DaysExpenses
                data={dashboardData?.lastExpense?.transactions || []}
              />

              <RecentIncomeWithChart
                data={
                  dashboardData?.lastIncome?.transactions?.slice(0, 4) || []
                }
                totalIncome={dashboardData?.totalIncome || 0}
              />

              <RecentIncome
                transactions={dashboardData?.lastIncome?.transactions}
                onSeeMore={() => navigate("/income")}
              />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
export default Home;
