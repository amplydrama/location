// app/admin/availabilities/page.tsx

"use client";

import React, { useState, useEffect, FormEvent, useMemo } from 'react'; // Import useMemo
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

// --- Shadcn UI Components ---
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

// --- Custom Data Types ---
import { CarData } from '@/types/carData'; // Your CarData interface

// Assuming these are your actual imports for API calls and axios instance
import { getCar } from '@/app/api/admin/cars/car';// This should ideally fetch all cars or take parameters to do so
import axiosInstance from '@/utils/axios'; // Your pre-configured axios instance

// Interface for unavailability data (must match Django serializer)
interface Unavailability {
  id?: string;
  car?: string; // The car's ID (PK), as expected by Django's ForeignKey
  start_date: string;
  end_date: string;
  reason: string;
  created_at?: string;
  updated_at?: string;
}

// --- Main Page Component ---
const AvailabilityManagementPage = () => {
  const router = useRouter();

  // --- State for data and UI ---
  const [vehicles, setVehicles] = useState<CarData[]>([]);
  const [selectedVehicleSlug, setSelectedVehicleSlug] = useState<string>('');
  const [unavailabilities, setUnavailabilities] = useState<Unavailability[]>([]); // Holds ALL unavailabilities for the selected car

  // State for form (create/edit)
  const [formData, setFormData] = useState<Partial<Unavailability>>({
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [editingUnavailabilityId, setEditingUnavailabilityId] = useState<string | null>(null);

  // State for loading and error indicators
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [isLoadingUnavailabilities, setIsLoadingUnavailabilities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- API Call Functions ---

  // Effect to fetch all vehicles on component mount
  useEffect(() => {
    const fetchAllVehicles = async () => {
      setIsLoadingVehicles(true);
      setError(null);
      try {
        const fetchedCars = await getCar(); // Assumed to fetch all cars
        setVehicles(fetchedCars);

        if (fetchedCars.length > 0) {
          setSelectedVehicleSlug(fetchedCars[0].slug || '');
        }
      } catch (err: any) {
        console.error("Error loading vehicles:", err);
        setError("Error loading vehicles: " + (err.response?.data?.detail || err.message));
        toast.error("Error: " + (err.response?.data?.detail || err.message));
      } finally {
        setIsLoadingVehicles(false);
      }
    };
    fetchAllVehicles();
  }, []);

  // Effect to fetch unavailabilities for the initially selected/changed vehicle
  useEffect(() => {
    const fetchVehicleUnavailabilities = async () => {
      if (!selectedVehicleSlug) {
        setUnavailabilities([]);
        return;
      }

      setIsLoadingUnavailabilities(true);
      setError(null);
      try {
        // We'll still fetch unavailabilities based on the selected vehicle slug
        // This ensures we only load relevant data if the total number of unavailabilities is huge.
        // If your API provides ALL unavailabilities without filtering, you'd call
        // axiosInstance.get<Unavailability[]>('availabilities/'); here instead.
        const response = await axiosInstance.get<Unavailability[]>(`availability/availability/?car__slug=${selectedVehicleSlug}`);
        // Store all fetched unavailabilities for the selected car
        setUnavailabilities(response.data);
      } catch (err: any) {
        console.error("Error loading unavailabilities:", err);
        setError("Error loading unavailabilities: " + (err.response?.data?.detail || err.message));
        toast.error("Error: " + (err.response?.data?.detail || err.message));
      } finally {
        setIsLoadingUnavailabilities(false);
      }
    };
    fetchVehicleUnavailabilities();
  }, [selectedVehicleSlug]); // Refetch when selected vehicle changes

  // --- Frontend Filtering Logic ---
  // Use useMemo to filter and sort unavailabilities efficiently
  const filteredAndSortedUnavailabilities = useMemo(() => {
    // Find the ID of the currently selected car based on its slug
    const currentVehicleId = vehicles.find(v => v.slug === selectedVehicleSlug)?.id;

    if (!currentVehicleId) {
      return []; // No vehicle selected or ID not found
    }

    // Filter unavailabilities whose 'car' ID matches the selected vehicle's ID
    const filtered = unavailabilities.filter(
      (unavailability) => unavailability.car === currentVehicleId
    );

    // Sort them by start_date for display
    return filtered.sort((a, b) => a.start_date.localeCompare(b.start_date));
  }, [unavailabilities, selectedVehicleSlug, vehicles]); // Re-run when these dependencies change

  // --- Event Handlers ---

  const handleVehicleSelectChange = (value: string) => {
    setSelectedVehicleSlug(value);
    setEditingUnavailabilityId(null);
    setFormData({ start_date: '', end_date: '', reason: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const currentVehicle = vehicles.find(v => v.slug === selectedVehicleSlug);
    if (!currentVehicle?.slug) {
      toast.error("Could not find the selected vehicle's ID for this operation.");
      return;
    }

    if (!formData.start_date || !formData.end_date || !formData.reason) {
      toast.error("All fields (start date, end date, reason) are required.");
      return;
    }
    if (formData.start_date > formData.end_date) {
        toast.error("The start date cannot be after the end date.");
        return;
    }

    const startDateObj = new Date(formData.start_date);

// 2. Get today's date at the beginning of the day (midnight UTC for consistent comparison)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to midnight UTC to compare only the date part

    // 3. Compare the start_date with today's date
    // If startDateObj is earlier than today, it's in the past.
    if (startDateObj < today) {
        toast.error("The start date cannot be in the past.");
        return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: Omit<Unavailability, 'id' | 'created_at' | 'updated_at'> = {
        car: currentVehicle.id, // Use slug or ID based on your API
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
    };

    try {
      if (editingUnavailabilityId) {
        const response = await axiosInstance.put<Unavailability>(
          `availability/availability/${editingUnavailabilityId}/`,
          payload
        );
        const updated = response.data;
        // When updating, replace in the main unavailabilities array
        setUnavailabilities((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
        toast.success("Unavailability updated successfully!");
      } else {
        const response = await axiosInstance.post<Unavailability>(
          'availability/availability/',
          payload
        );
        const created = response.data;
        // When creating, add to the main unavailabilities array
        setUnavailabilities((prev) => [...prev, created]);
        toast.success("Unavailability created successfully!");
      }

      setFormData({ start_date: '', end_date: '', reason: '' });
      setEditingUnavailabilityId(null);
    } catch (err: any) {
      console.error("Error during operation (create/update):", err);
      setError("Error during operation: " + (err.response?.data?.detail || err.message || JSON.stringify(err.response?.data)));
      toast.error("Error: " + (err.response?.data?.detail || err.message || "Check console for details."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (unavailability: Unavailability) => {
    setEditingUnavailabilityId(unavailability.id || null);
    setFormData({
      start_date: unavailability.start_date,
      end_date: unavailability.end_date,
      reason: unavailability.reason,
    });
  };

  const handleDelete = async (unavailabilityId: string) => {
    if (!window.confirm("Are you sure you want to delete this unavailability?")) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await axiosInstance.delete(`availability/availability/${unavailabilityId}/`);
      // Remove from the main unavailabilities array
      setUnavailabilities((prev) => prev.filter((u) => u.id !== unavailabilityId));
      toast.success("Unavailability deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting unavailability:", err);
      setError("Error deleting unavailability: " + (err.response?.data?.detail || err.message));
      toast.error("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUnavailabilityId(null);
    setFormData({ start_date: '', end_date: '', reason: '' });
  };

  // --- Component Render ---
  return (
    <div className="container mx-auto p-4 max-w-7xl font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Vehicle Unavailability Management</h1>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg relative mb-6 shadow-sm" role="alert">
          <strong className="font-semibold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Availabilities List */}
        <Card className="lg:col-span-2 flex flex-col max-h-[70vh] border border-gray-200 shadow-lg bg-white rounded-xl">
          <CardHeader className="bg-gray-100 border-b border-gray-200 p-4 rounded-t-xl">
            <CardTitle className="text-lg font-semibold text-gray-800">Unavailabilities for Selected Vehicle</CardTitle>
            <CardDescription className="text-sm text-gray-600">List of periods when the vehicle is unavailable.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-4">
            {isLoadingUnavailabilities ? (
              <p className="text-center text-gray-500 py-4 animate-pulse">Loading unavailabilities...</p>
            ) : filteredAndSortedUnavailabilities.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No unavailabilities found for this vehicle. Add one!</p>
            ) : (
              <ScrollArea className="h-full pr-4">
                <div className="space-y-3">
                  {filteredAndSortedUnavailabilities.map((unavailability) => (
                    <div
                      key={unavailability.id}
                      className="flex items-center justify-between p-3 border rounded-lg border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          <span className="text-indigo-600">From:</span> {unavailability.start_date} <span className="text-indigo-600">to:</span> {unavailability.end_date}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold">Reason:</span> {unavailability.reason}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(unavailability)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200 px-4 py-2 text-sm rounded-md shadow-sm"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => unavailability.id && handleDelete(unavailability.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-200 p-2 rounded-md shadow-sm"
                          disabled={isSubmitting || !unavailability.id}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Vehicle Selector and Creation/Modification Form */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          {/* Vehicle Selection Section */}
          <Card className="max-h-[150px] border border-gray-200 shadow-lg bg-white rounded-xl">
            <CardHeader className="pb-2 bg-gray-100 border-b border-gray-200 p-4 rounded-t-xl">
              <CardTitle className="text-lg font-semibold text-gray-800">Vehicle Selection</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {isLoadingVehicles ? (
                <p className="text-gray-500 animate-pulse">Loading...</p>
              ) : (
                <Select onValueChange={handleVehicleSelectChange} value={selectedVehicleSlug} disabled={isSubmitting || isLoadingVehicles}>
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200">
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-[200px] overflow-y-auto z-50">
                    {vehicles.length === 0 ? (
                      <SelectItem value="" disabled className="text-gray-500 opacity-75">No vehicles available</SelectItem>
                    ) : (
                      vehicles.map((car) => (
                        <SelectItem
                          key={car.slug || car.id}
                          value={car.slug? car.slug : ""}
                          className="text-gray-800 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 cursor-pointer"
                        >
                          {car.brand} {car.model} ({car.immatriculation})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Creation/Modification Section */}
          {selectedVehicleSlug && (
            <Card className="flex-grow max-h-[500px] border border-gray-200 shadow-lg bg-white rounded-xl">
              <CardHeader className="bg-gray-100 border-b border-gray-200 p-4 rounded-t-xl">
                <CardTitle className="text-lg font-semibold text-gray-800">{editingUnavailabilityId ? 'Modify Unavailability' : 'Add Unavailability'}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {editingUnavailabilityId ? `Modify the existing unavailability for the selected vehicle.` : 'Create a new unavailability period for the selected vehicle.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-y-auto p-4 pr-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-gray-700 font-medium">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date || ''}
                      onChange={handleFormChange}
                      required
                      disabled={isSubmitting}
                      className="border border-gray-300 rounded-lg shadow-sm px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-gray-700 font-medium">End Date</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date || ''}
                      onChange={handleFormChange}
                      required
                      disabled={isSubmitting}
                      className="border border-gray-300 rounded-lg shadow-sm px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-gray-700 font-medium">Reason</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      value={formData.reason || ''}
                      onChange={handleFormChange}
                      required
                      disabled={isSubmitting}
                      rows={3}
                      className="border border-gray-300 rounded-lg shadow-sm px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 resize-y"
                      placeholder="E.g., Preventive maintenance, Accident repair, Special event unavailability..."
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md px-6 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      {isSubmitting ? 'Submitting...' : (editingUnavailabilityId ? 'Update Unavailability' : 'Add Unavailability')}
                    </Button>
                    {editingUnavailabilityId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                        className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-md px-6 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManagementPage;