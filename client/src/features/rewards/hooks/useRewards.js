import { useState, useCallback } from 'react';
import {
  getUserRewards,
  getRewardHistory,
  getUserRedemptions,
  getRewardDashboard,
  redeemGift,
  getRewardRules,
  updateRewardRules,
  getGiftLevels,
  updateGiftLevel,
  addGiftLevel,
  getAllRedemptions,
} from '../api/rewardsApi';

export const useRewards = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [history, setHistory] = useState(null);
  const [redemptions, setRedemptions] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [giftLevels, setGiftLevels] = useState(null);
  const [rewardRules, setRewardRules] = useState(null);
  const [allRedemptions, setAllRedemptions] = useState(null);

  const fetchRewards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserRewards();
      setRewards(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRewardHistory();
      setHistory(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRedemptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserRedemptions();
      setRedemptions(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRewardDashboard();
      setDashboard(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const redeem = useCallback(
    async (giftLevelId) => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await redeemGift({ userId, giftLevelId });
        setError(null);
        await fetchDashboard();
        return response.data.data;
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchDashboard]
  );

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRewardRules();
      setRewardRules(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRules = useCallback(async (rules) => {
    setLoading(true);
    try {
      const response = await updateRewardRules(rules);
      setRewardRules(response.data.data);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGiftLevels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGiftLevels();
      setGiftLevels(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGift = useCallback(async (id, data) => {
    setLoading(true);
    try {
      const response = await updateGiftLevel(id, data);
      const updated = giftLevels.map((g) => (g.id === id ? response.data.data : g));
      setGiftLevels(updated);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [giftLevels]);

  const addGift = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await addGiftLevel(data);
      setGiftLevels([...giftLevels, response.data.data]);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [giftLevels]);

  const fetchAllRedemptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllRedemptions();
      setAllRedemptions(response.data.data);
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
    rewards,
    history,
    redemptions,
    dashboard,
    giftLevels,
    rewardRules,
    allRedemptions,
    fetchRewards,
    fetchHistory,
    fetchRedemptions,
    fetchDashboard,
    redeem,
    fetchRules,
    updateRules,
    fetchGiftLevels,
    updateGift,
    addGift,
    fetchAllRedemptions,
  };
};
