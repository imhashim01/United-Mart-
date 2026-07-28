import { useState, useCallback } from 'react';
import {
  getSalesReport,
  getPaymentMethodsReport,
  getOrderStatusReport,
  getInventoryReport,
  getTopCustomers,
} from '../api/reportsApi';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const fetchSales = useCallback(async (groupBy = 'day') => {
    setLoading(true);
    try {
      const response = await getSalesReport(groupBy);
      setReport(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTodaysSales = useCallback(() => fetchSales('day'), [fetchSales]);
  const fetchWeeklySales = useCallback(() => fetchSales('week'), [fetchSales]);
  const fetchMonthlySales = useCallback(() => fetchSales('month'), [fetchSales]);
  const fetchYearlySales = useCallback(() => fetchSales('year'), [fetchSales]);

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPaymentMethodsReport();
      setReport(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOrderStatusReport();
      setReport(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInventoryReport();
      setReport(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTopCustomers();
      setReport(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    report,
    fetchTodaysSales,
    fetchWeeklySales,
    fetchMonthlySales,
    fetchYearlySales,
    fetchRevenue,
    fetchOrders,
    fetchInventory,
    fetchCustomers,
  };
};
