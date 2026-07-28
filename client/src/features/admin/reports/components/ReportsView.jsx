import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';
import { useReports } from '../hooks/useReports';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const COLORS = ['#16a34a', '#10b981', '#22c55e', '#4ade80', '#86efac'];

export default function ReportsView() {
  const {
    loading,
    report,
    fetchTodaysSales,
    fetchWeeklySales,
    fetchMonthlySales,
    fetchYearlySales,
    fetchRevenue,
    fetchOrders,
    fetchInventory,
    fetchCustomers,
  } = useReports();

  const [activeTab, setActiveTab] = useState('today-sales');
  const [period, setPeriod] = useState('monthly');
  const [reportName, setReportName] = useState('Today Sales Report');

  useEffect(() => {
    handleTabChange(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'today-sales':
        fetchTodaysSales();
        setReportName("Today's Sales Report");
        break;
      case 'weekly-sales':
        fetchWeeklySales();
        setReportName('Weekly Sales Report');
        break;
      case 'monthly-sales':
        fetchMonthlySales();
        setReportName('Monthly Sales Report');
        break;
      case 'yearly-sales':
        fetchYearlySales();
        setReportName('Yearly Sales Report');
        break;
      case 'revenue':
        fetchRevenue();
        setReportName('Revenue Report');
        break;
      case 'orders':
        fetchOrders();
        setReportName('Orders Report');
        break;
      case 'inventory':
        fetchInventory();
        setReportName('Inventory Report');
        break;
      case 'customers':
        fetchCustomers();
        setReportName('Customers Report');
        break;
      default:
        break;
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    if (activeTab === 'revenue') fetchRevenue();
    if (activeTab === 'orders') fetchOrders();
  };

  const renderChart = () => {
    if (!report?.data) return null;

    if (activeTab === 'inventory') {
      const inventoryData = [
        {
          category: 'Low Stock',
          totalItems: report.data.lowStock?.length ?? 0,
          lowStock: report.data.lowStock?.length ?? 0,
          outOfStock: 0,
        },
        {
          category: 'Out of Stock',
          totalItems: report.data.outOfStock?.length ?? 0,
          lowStock: 0,
          outOfStock: report.data.outOfStock?.length ?? 0,
        },
      ];

      return (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalItems" fill="#16a34a" />
            <Bar dataKey="lowStock" fill="#f59e0b" />
            <Bar dataKey="outOfStock" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (activeTab === 'revenue') {
      const revenueData = Array.isArray(report.data)
        ? report.data.map((item) => ({
            name: item.method || item.name || item._id || 'Unknown',
            revenue: item.total ?? item.revenue ?? 0,
          }))
        : [];
      const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
      const enrichedRevenueData = revenueData.map((item) => ({
        ...item,
        percentage: totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0,
      }));

      if (enrichedRevenueData.length === 0) return null;

      return (
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={enrichedRevenueData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={120}
              fill="#16a34a"
              dataKey="revenue"
            >
              {enrichedRevenueData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value.toLocaleString()} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (activeTab === 'orders') {
      return (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={Array.isArray(report.data) ? report.data : []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (['today-sales', 'weekly-sales', 'monthly-sales', 'yearly-sales'].includes(activeTab)) {
      return (
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={Array.isArray(report.data) ? report.data : []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#16a34a" />
            <Line type="monotone" dataKey="orders" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  const renderSummary = () => {
    if (!report?.summary) return null;

    const summaryEntries = Object.entries(report.summary).filter(
      ([key]) => key !== 'totalRevenue' && key !== 'totalCustomers' && key !== 'totalOrders' && key !== 'avgOrderValue'
    );

    if (summaryEntries.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryEntries.map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderTable = () => {
    if (!report?.data) return null;

    if (activeTab === 'customers') {
      const customers = Array.isArray(report.data) ? report.data : [];
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Orders</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.orders?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.totalSpent?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'inventory') {
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Low Stock Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">SKU</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {report.data.lowStock?.map((product, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{product.sku}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{product.stock}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{product.lowStockThreshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Out of Stock Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {report.data.outOfStock?.map((product, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{product.sku}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (!Array.isArray(report.data) || report.data.length === 0) return null;

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(report.data[0] || {}).map((col) => (
                <th key={col} className="px-4 py-2 text-left text-sm font-semibold text-gray-900 capitalize">
                  {col.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.data.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                {Object.values(row).map((val, i) => (
                  <td key={i} className="px-4 py-3 text-sm text-gray-900">
                    {typeof val === 'number' ? val.toLocaleString() : val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">Overview of sales, orders, inventory and customer performance.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToPDF(report, reportName)}
            disabled={!report}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Download size={18} />
            PDF
          </button>
          <button
            onClick={() => exportToExcel(report, reportName)}
            disabled={!report}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Download size={18} />
            Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex flex-wrap border-b">
          {[
            { id: 'today-sales', label: 'Daily Sales' },
            { id: 'weekly-sales', label: 'Weekly Sales' },
            { id: 'monthly-sales', label: 'Monthly Sales' },
            { id: 'yearly-sales', label: 'Annual Sales' },
            { id: 'revenue', label: 'Payment Methods' },
            { id: 'orders', label: 'Order Status' },
            { id: 'inventory', label: 'Inventory' },
            { id: 'customers', label: 'Top Customers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {['revenue', 'orders'].includes(activeTab) && (
          <div className="flex items-center gap-2 px-6 py-4 border-b bg-gray-50">
            <Filter size={18} className="text-gray-600" />
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        )}

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading report...</div>
            </div>
          ) : report ? (
            <div className="space-y-6">
              {renderSummary()}
              {renderChart()}
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Data</h3>
                {renderTable()}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
