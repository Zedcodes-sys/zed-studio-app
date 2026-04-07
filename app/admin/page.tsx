"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  User,
  Users,
  Phone,
  ImageIcon,
  CheckCircle2,
} from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
type ImageSelectionStatus = "pending" | "selected";
type DispatchStatus = "not_sent" | "dispatched";
type PaymentStatus = "deposit_paid" | "fully_paid" | "unpaid_balance";

type Booking = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  bookingDate: string;
  bookingTime: string;
  peopleCount: string;
  notes: string;
  referral: string;
  packageId: string;
  packageName: string;
  packageCategory: string;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  imageSelectionStatus: ImageSelectionStatus;
  dispatchStatus: DispatchStatus;
  loyaltyEligible: boolean;
  createdAt: string;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
  rewardStatus: string;
};

type AppState = {
  bookings: Booking[];
  customers: Customer[];
};

const STORAGE_KEY = "zstudio_app_state_v1";

function getInitialState(): AppState {
  return {
    bookings: [],
    customers: [],
  };
}

const currency = (n: number | string) => `K${Number(n).toLocaleString()}`;

function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    selected: "bg-purple-100 text-purple-800",
    dispatched: "bg-emerald-100 text-emerald-800",
    not_sent: "bg-slate-100 text-slate-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
        map[value] || "bg-slate-100 text-slate-800"
      }`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setState(JSON.parse(raw) as AppState);
      } catch {
        setState(getInitialState());
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const stats = useMemo(() => {
    const totalCustomers = state.customers.length;
    const loyalCustomers = state.customers.filter(
      (c) => c.totalBookings >= 2
    ).length;
    const confirmed = state.bookings.filter(
      (b) => b.bookingStatus === "confirmed"
    ).length;
    const dispatched = state.bookings.filter(
      (b) => b.dispatchStatus === "dispatched"
    ).length;

    return { totalCustomers, loyalCustomers, confirmed, dispatched };
  }, [state]);

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return state.bookings;

    return state.bookings.filter(
      (b) =>
        b.fullName.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.packageName.toLowerCase().includes(q) ||
        b.bookingDate.includes(q)
    );
  }, [search, state.bookings]);

  function updateBooking(
    id: string,
    field: "bookingStatus" | "imageSelectionStatus" | "dispatchStatus" | "paymentStatus",
    value: Booking["bookingStatus" | "imageSelectionStatus" | "dispatchStatus" | "paymentStatus"]
  ) {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) =>
        booking.id === id ? { ...booking, [field]: value } : booking
      ),
    }));
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-xl">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                <Search className="h-4 w-4" /> Admin Dashboard
              </div>
              <h1 className="text-4xl font-bold text-white">
                ZED Studio Admin
              </h1>
              <p className="mt-3 text-slate-200 max-w-xl">
                Manage bookings, customer loyalty, and studio status updates from the admin panel.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="rounded-2xl border-0 bg-white/10 text-white shadow-none backdrop-blur">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-200">Customers</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-0 bg-white/10 text-white shadow-none backdrop-blur">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-200">Loyal Customers</p>
                  <p className="text-2xl font-bold">{stats.loyalCustomers}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-0 bg-white/10 text-white shadow-none backdrop-blur">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-200">Confirmed Bookings</p>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-0 bg-white/10 text-white shadow-none backdrop-blur">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-200">Dispatched</p>
                  <p className="text-2xl font-bold">{stats.dispatched}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-xl">Bookings Dashboard</CardTitle>
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, phone, package or date"
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
                No bookings yet.
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border bg-white p-4 shadow-sm"
                >
                  <div className="grid gap-4 lg:grid-cols-[1.3fr,1fr,1fr]">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500" />
                        <p className="font-semibold">{booking.fullName}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4" /> {booking.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <ImageIcon className="h-4 w-4" /> {booking.bookingDate} at {booking.bookingTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="h-4 w-4" /> {booking.peopleCount} people
                      </div>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Package:</span> {booking.packageName}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Payment:</span> Deposit {currency(booking.depositPaid)} paid, balance {currency(booking.balanceDue)}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="mb-2 block">Booking Status</Label>
                        <Select
                          value={booking.bookingStatus}
                          onValueChange={(value: BookingStatus) =>
                            updateBooking(booking.id, "bookingStatus", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">pending</SelectItem>
                            <SelectItem value="confirmed">confirmed</SelectItem>
                            <SelectItem value="completed">completed</SelectItem>
                            <SelectItem value="cancelled">cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="mb-2 block">Image Selection</Label>
                        <Select
                          value={booking.imageSelectionStatus}
                          onValueChange={(value: ImageSelectionStatus) =>
                            updateBooking(booking.id, "imageSelectionStatus", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">pending</SelectItem>
                            <SelectItem value="selected">selected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="mb-2 block">Dispatch Status</Label>
                        <Select
                          value={booking.dispatchStatus}
                          onValueChange={(value: DispatchStatus) =>
                            updateBooking(booking.id, "dispatchStatus", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_sent">not_sent</SelectItem>
                            <SelectItem value="dispatched">dispatched</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="mb-2 block">Payment Status</Label>
                        <Select
                          value={booking.paymentStatus}
                          onValueChange={(value: PaymentStatus) =>
                            updateBooking(booking.id, "paymentStatus", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deposit_paid">deposit_paid</SelectItem>
                            <SelectItem value="fully_paid">fully_paid</SelectItem>
                            <SelectItem value="unpaid_balance">unpaid_balance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusBadge value={booking.bookingStatus} />
                    <StatusBadge value={booking.imageSelectionStatus} />
                    <StatusBadge value={booking.dispatchStatus} />
                    <Badge variant="outline" className="rounded-full">
                      {booking.paymentStatus.replaceAll("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImageIcon className="h-5 w-5" /> Loyalty & Customer Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.customers.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
                No customers recorded yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {state.customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-sm text-slate-500">{customer.phone}</p>
                        {customer.email ? (
                          <p className="text-sm text-slate-500">{customer.email}</p>
                        ) : null}
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-700">
                      <p>
                        <span className="font-medium">Total bookings:</span> {customer.totalBookings}
                      </p>
                      <p>
                        <span className="font-medium">Total value:</span> {currency(customer.totalSpent)}
                      </p>
                      <p>
                        <span className="font-medium">Last booking:</span> {customer.lastBookingDate}
                      </p>
                      <p>
                        <span className="font-medium">Reward status:</span> {customer.rewardStatus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
