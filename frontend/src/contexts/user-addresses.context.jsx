import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  getUserAddresses,
  getUserDefaultAddress,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setAddressAsDefault,
  getUserAddress,
} from "@/api-services/user-addresses.service";
import { useAuth } from "./auth.context";

const UserAddressesCtx = createContext();

/* ------------------------------------------------------------------ */
/* Provider                                                           */
/* ------------------------------------------------------------------ */
export const UserAddressesProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState({});
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  /* ---------- Error handler ---------- */
  const handleError = useCallback((error, defaultMessage) => {
    console.error("User Addresses Error:", error);
    const message = error?.message || defaultMessage || "An error occurred";
    setError(message);
    return message;
  }, []);

  /* ---------- Load user addresses ---------- */
  const loadAddresses = useCallback(async () => {
    if (!isAuthenticated) {
      setAddresses([]);
      setDefaultAddress(null);
      setInitialized(true);
      return { success: false, error: "Not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Loading user addresses");
      const { response, data } = await getUserAddresses();
      console.log("Addresses API response:", { response: response.ok, data });

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load addresses");
      }

      const addressesData = Array.isArray(data.data) ? data.data : [];
      setAddresses(addressesData);

      // Find and set the default address
      const defaultAddr = addressesData.find(
        (addr) => addr.is_default === true
      );
      setDefaultAddress(defaultAddr || null);

      setInitialized(true);
      return { success: true, data: addressesData };
    } catch (e) {
      console.error("Error loading addresses:", e);
      const errorMessage = handleError(e, "Failed to load addresses");
      setInitialized(true);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleError]);

  /* ---------- Load default address ---------- */
  const loadDefaultAddress = useCallback(async () => {
    if (!isAuthenticated) {
      setDefaultAddress(null);
      return { success: false, error: "Not authenticated" };
    }

    try {
      console.log("Loading default address");
      const { response, data } = await getUserDefaultAddress();

      if (!response.ok) {
        // If no default address exists, that's not an error
        if (response.status === 404) {
          setDefaultAddress(null);
          return { success: true, data: null };
        }
        throw new Error(data?.message || "Failed to load default address");
      }

      setDefaultAddress(data.data);
      return { success: true, data: data.data };
    } catch (e) {
      console.error("Error loading default address:", e);
      const errorMessage = handleError(e, "Failed to load default address");
      return { success: false, error: errorMessage };
    }
  }, [isAuthenticated, handleError]);

  /* ---------- Create address ---------- */
  const addAddress = useCallback(
    async (addressData) => {
      console.log("Creating address:", addressData);

      if (!isAuthenticated) {
        return { success: false, error: "Please login to add addresses" };
      }

      setOperationLoading((prev) => ({ ...prev, create: true }));
      setError(null);

      try {
        // Add user_id to the address data
        const dataWithUserId = {
          ...addressData,
          user_id: user?.id,
        };

        console.log("Making createUserAddress API call");
        const { response, data } = await createUserAddress(dataWithUserId);
        console.log("Create address API response:", {
          response: response.ok,
          data,
        });

        if (!response.ok) {
          throw new Error(data?.message || "Failed to create address");
        }

        // Reload addresses to get updated data
        console.log("Reloading addresses");
        await loadAddresses();
        return { success: true, data: data.data };
      } catch (e) {
        console.error("Error in addAddress:", e);
        const errorMessage = handleError(e, "Failed to create address");
        return { success: false, error: errorMessage };
      } finally {
        setOperationLoading((prev) => ({ ...prev, create: false }));
      }
    },
    [isAuthenticated, user, loadAddresses, handleError]
  );

  /* ---------- Update address ---------- */
  const editAddress = useCallback(
    async (addressId, addressData) => {
      console.log("Updating address:", { addressId, addressData });

      if (!isAuthenticated) {
        return { success: false, error: "Please login to update addresses" };
      }

      const operationKey = `update-${addressId}`;
      setOperationLoading((prev) => ({ ...prev, [operationKey]: true }));
      setError(null);

      try {
        console.log("Making updateUserAddress API call");
        const { response, data } = await updateUserAddress(
          addressId,
          addressData
        );
        console.log("Update address API response:", {
          response: response.ok,
          data,
        });

        if (!response.ok) {
          throw new Error(data?.message || "Failed to update address");
        }

        // Update local state optimistically
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === addressId ? { ...addr, ...data.data } : addr
          )
        );

        // If this address was set as default, update default address
        if (data.data.is_default) {
          setDefaultAddress(data.data);
        }

        return { success: true, data: data.data };
      } catch (e) {
        console.error("Error in editAddress:", e);
        const errorMessage = handleError(e, "Failed to update address");
        // Reload addresses on error to ensure consistency
        await loadAddresses();
        return { success: false, error: errorMessage };
      } finally {
        setOperationLoading((prev) => ({ ...prev, [operationKey]: false }));
      }
    },
    [isAuthenticated, loadAddresses, handleError]
  );

  /* ---------- Delete address ---------- */
  const removeAddress = useCallback(
    async (addressId) => {
      console.log("Deleting address:", addressId);

      if (!isAuthenticated) {
        return { success: false, error: "Please login to delete addresses" };
      }

      const operationKey = `delete-${addressId}`;
      setOperationLoading((prev) => ({ ...prev, [operationKey]: true }));
      setError(null);

      try {
        console.log("Making deleteUserAddress API call");
        const { response, data } = await deleteUserAddress(addressId);
        console.log("Delete address API response:", {
          response: response.ok,
          data,
        });

        if (!response.ok) {
          throw new Error(data?.message || "Failed to delete address");
        }

        // Update local state
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));

        // If the deleted address was the default, clear default
        if (defaultAddress?.id === addressId) {
          setDefaultAddress(null);
        }

        return { success: true };
      } catch (e) {
        console.error("Error in removeAddress:", e);
        const errorMessage = handleError(e, "Failed to delete address");
        return { success: false, error: errorMessage };
      } finally {
        setOperationLoading((prev) => ({ ...prev, [operationKey]: false }));
      }
    },
    [isAuthenticated, defaultAddress, handleError]
  );

  /* ---------- Set address as default ---------- */
  const makeDefault = useCallback(
    async (addressId) => {
      console.log("Setting address as default:", addressId);

      if (!isAuthenticated) {
        return { success: false, error: "Please login to set default address" };
      }

      const operationKey = `default-${addressId}`;
      setOperationLoading((prev) => ({ ...prev, [operationKey]: true }));
      setError(null);

      try {
        console.log("Making setAddressAsDefault API call");
        const { response, data } = await setAddressAsDefault(addressId);
        console.log("Set default API response:", {
          response: response.ok,
          data,
        });

        if (!response.ok) {
          throw new Error(data?.message || "Failed to set address as default");
        }

        // Update local state
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            is_default: addr.id === addressId,
          }))
        );

        setDefaultAddress(data.data);

        return { success: true, data: data.data };
      } catch (e) {
        console.error("Error in makeDefault:", e);
        const errorMessage = handleError(e, "Failed to set address as default");
        // Reload addresses on error to ensure consistency
        await loadAddresses();
        return { success: false, error: errorMessage };
      } finally {
        setOperationLoading((prev) => ({ ...prev, [operationKey]: false }));
      }
    },
    [isAuthenticated, loadAddresses, handleError]
  );

  /* ---------- Get specific address ---------- */
  const getAddress = useCallback(
    async (addressId) => {
      if (!isAuthenticated) {
        return { success: false, error: "Please login to view addresses" };
      }

      const operationKey = `get-${addressId}`;
      setOperationLoading((prev) => ({ ...prev, [operationKey]: true }));

      try {
        const { response, data } = await getUserAddress(addressId);

        if (!response.ok) {
          throw new Error(data?.message || "Failed to get address");
        }

        return { success: true, data: data.data };
      } catch (e) {
        console.error("Error in getAddress:", e);
        const errorMessage = handleError(e, "Failed to get address");
        return { success: false, error: errorMessage };
      } finally {
        setOperationLoading((prev) => ({ ...prev, [operationKey]: false }));
      }
    },
    [isAuthenticated, handleError]
  );

  /* ---------- Clear all data on logout ---------- */
  const clearAddresses = useCallback(() => {
    setAddresses([]);
    setDefaultAddress(null);
    setError(null);
    setInitialized(false);
    setOperationLoading({});
  }, []);

  /* ---------- Initialize when authenticated ---------- */
  useEffect(() => {
    if (isAuthenticated && !initialized) {
      loadAddresses();
    } else if (!isAuthenticated) {
      clearAddresses();
    }
  }, [isAuthenticated, initialized, loadAddresses, clearAddresses]);

  /* ---------- Context value ---------- */
  const contextValue = useMemo(
    () => ({
      // State
      addresses,
      defaultAddress,
      loading,
      operationLoading,
      error,
      initialized,

      // Actions
      loadAddresses,
      loadDefaultAddress,
      addAddress,
      editAddress,
      removeAddress,
      makeDefault,
      getAddress,
      clearAddresses,

      // Computed values
      hasAddresses: addresses.length > 0,
      addressCount: addresses.length,
    }),
    [
      addresses,
      defaultAddress,
      loading,
      operationLoading,
      error,
      initialized,
      loadAddresses,
      loadDefaultAddress,
      addAddress,
      editAddress,
      removeAddress,
      makeDefault,
      getAddress,
      clearAddresses,
    ]
  );

  return (
    <UserAddressesCtx.Provider value={contextValue}>
      {children}
    </UserAddressesCtx.Provider>
  );
};

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */

// Main hook to access user addresses context
export const useUserAddresses = () => {
  const context = useContext(UserAddressesCtx);
  if (!context) {
    throw new Error(
      "useUserAddresses must be used within a UserAddressesProvider"
    );
  }
  return context;
};

// Hook to access only address actions (for components that only modify addresses)
export const useAddressActions = () => {
  const {
    addAddress,
    editAddress,
    removeAddress,
    makeDefault,
    getAddress,
    loadAddresses,
    loadDefaultAddress,
  } = useUserAddresses();

  return {
    addAddress,
    editAddress,
    removeAddress,
    makeDefault,
    getAddress,
    loadAddresses,
    loadDefaultAddress,
  };
};

// Hook to check if an address is the default
export const useIsDefaultAddress = (addressId) => {
  const { defaultAddress } = useUserAddresses();
  return defaultAddress?.id === addressId;
};

// Hook to get operation loading state for specific address
export const useAddressOperationLoading = (addressId, operation = null) => {
  const { operationLoading } = useUserAddresses();

  if (operation && addressId) {
    return operationLoading[`${operation}-${addressId}`] || false;
  }

  // Return any loading state for this address
  const addressOperations = Object.keys(operationLoading).filter((key) =>
    key.includes(`-${addressId}`)
  );

  return addressOperations.some((key) => operationLoading[key]);
};
