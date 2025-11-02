/**
=========================================================
* useDataTable Hook
=========================================================
* Custom hook for managing data table state and API calls
*/

import { useState, useEffect } from "react";
import { dataTableAPI } from "../api";

export const useDataTable = (initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await dataTableAPI.getTableData({ ...initialParams, ...params });
      setData(response.data.items || response.data);
      setTotalCount(response.data.total || response.data.length);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch table data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = (params) => {
    fetchData(params);
  };

  return {
    data,
    loading,
    error,
    totalCount,
    refetch,
  };
};
