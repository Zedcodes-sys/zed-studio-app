"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  Camera,
  CreditCard,
} from "lucide-react";

type PackageItem = {
  id: string;
  category: string;
  name: string;
  price: number;
  photos: number;
  makeup: string;
  outfits: string;
  people: string;
};

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

type BookingForm = {
  fullName: string;
  phone: string;
  email: string;
  bookingDate: string;
  bookingTime: string;
  peopleCount: string;
  notes: string;
  referral: string;
};

type UpdateableBookingField =
  | "bookingStatus"
  | "imageSelectionStatus"
  | "dispatchStatus"
  | "paymentStatus";

const PACKAGES: PackageItem[] = [
  {
    id: "solo-1",
    category: "1 Person",
    name: "4 photos + free makeup or hair installation + flowers",
    price: 500,
    photos: 4,
    makeup: "Included",
    outfits: "2 changes",
    people: "1",
  },
  {
    id: "solo-2",
    category: "1 Person",
    name: "6 photos + free makeup",
    price: 700,
    photos: 6,
    makeup: "Included",
    outfits: "Standard",
    people: "1",
  },
  {
    id: "solo-3",
    category: "1 Person",
    name: "5 photos no makeup",
    price: 500,
    photos: 5,
    makeup: "No",
    outfits: "Standard",
    people: "1",
  },

  {
    id: "std-1",
    category: "Standard (+1)",
    name: "5 photos + makeup + free hair installation",
    price: 750,
    photos: 5,
    makeup: "Included",
    outfits: "Standard",
    people: "2",
  },
  {
    id: "std-2",
    category: "Standard (+1)",
    name: "10 photos no makeup",
    price: 1000,
    photos: 10,
    makeup: "No",
    outfits: "3 changes",
    people: "2",
  },

  {
    id: "grp-1",
    category: "+1 up to 5 People",
    name: "6 photos + makeup for 1 person",
    price: 850,
    photos: 6,
    makeup: "1 person",
    outfits: "2 changes",
    people: "2-5",
  },
  {
    id: "grp-2",
    category: "+1 up to 5 People",
    name: "5 photos + makeup for 2 people",
    price: 1000,
    photos: 5,
    makeup: "2 people",
    outfits: "2 changes",
    people: "2-5",
  },
  {
    id: "grp-3",
    category: "+1 up to 5 People",
    name: "5 photos + makeup for 3 people",
    price: 1250,
    photos: 5,
    makeup: "3 people",
    outfits: "2 changes",
    people: "2-5",
  },
  {
    id: "grp-4",
    category: "+1 up to 5 People",
    name: "5 photos no makeup",
    price: 500,
    photos: 5,
    makeup: "No",
    outfits: "Standard",
    people: "2-5",
  },
  {
    id: "grp-5",
    category: "+1 up to 5 People",
    name: "10 photos no makeup",
    price: 1000,
    photos: 10,
    makeup: "No",
    outfits: "2 changes",
    people: "2-5",
  },

  {
    id: "kids-1",
    category: "Kids",
    name: "1-3 years: 6 photos",
    price: 800,
    photos: 6,
    makeup: "N/A",
    outfits: "Standard",
    people: "Child",
  },
  {
    id: "kids-2",
    category: "Kids",
    name: "1-3 years: 6 photos with birthday themed backdrop",
    price: 1000,
    photos: 6,
    makeup: "N/A",
    outfits: "Standard",
    people: "Child",
  },
  {
    id: "kids-3",
    category: "Kids",
    name: "4 years+: 5 photos",
    price: 500,
    photos: 5,
    makeup: "N/A",
    outfits: "Standard",
    people: "Child",
  },
  {
    id: "kids-4",
    category: "Kids",
    name: "4 years+: with birthday themed backdrop",
    price: 700,
    photos: 5,
    makeup: "N/A",
    outfits: "Standard",
    people: "Child",
  },

  {
    id: "cm-1",
    category: "Couples & Maternity",
    name: "6 photos + makeup for 1",
    price: 850,
    photos: 6,
    makeup: "1 person",
    outfits: "Max 2 outfits",
    people: "2",
  },
  {
    id: "cm-2",
    category: "Couples & Maternity",
    name: "6 photos no makeup",
    price: 600,
    photos: 6,
    makeup: "No",
    outfits: "2 changes",
    people: "2",
  },

  {
    id: "fam-1",
    category: "Family",
    name: "6 photos (kids below 3 years not included)",
    price: 600,
    photos: 6,
    makeup: "No",
    outfits: "Standard",
    people: "Family",
  },
  {
    id: "fam-2",
    category: "Family",
    name: "6 photos with kids under 3 years",
    price: 800,
    photos: 6,
    makeup: "No",
    outfits: "Standard",
    people: "Family",
  },
];

const POLICY_TEXT = `
ZED Studio Photography Booking Policy

1. All shoots are strictly by booking only.
2. A non-refundable booking fee of K100 is required to secure the date and time.
3. The remaining balance must be paid on the shoot day before the session starts.
4. A booking is only confirmed after the K100 deposit is recorded.
5. Clients must arrive on time. Late arrival may reduce shoot time.
6. Package benefits apply only to the package selected at booking.
7. Photo delivery and dispatch are processed after image selection and payment confirmation.
8. By continuing, the client agrees to the studio rules, package terms, and communication regarding their booking.
`;

const currency = (n: number | string) => `K${Number(n).toLocaleString()}`;
const STORAGE_KEY = "zstudio_app_state_v1";

function getInitialState(): AppState {
  return {
    bookings: [],
    customers: [],
  };
}

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function ZStudioBookingApp() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    PACKAGES[0]?.id ?? ""
  );
  const [policyAccepted, setPolicyAccepted] = useState<boolean>(false);
  const [form, setForm] = useState<BookingForm>({
    fullName: "",
    phone: "",
    email: "",
    bookingDate: "",
    bookingTime: "",
    peopleCount: "1",
    notes: "",
    referral: "",
  });

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

  const selectedPackage = useMemo<PackageItem>(() => {
    return PACKAGES.find((p) => p.id === selectedPackageId) ?? PACKAGES[0];
  }, [selectedPackageId]);

  const groupedPackages = useMemo<Record<string, PackageItem[]>>(() => {
    return PACKAGES.reduce<Record<string, PackageItem[]>>((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, []);

  function updateForm(key: keyof BookingForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submitBooking() {
    if (!policyAccepted) {
      alert("Please accept the booking policy before continuing.");
      return;
    }

    if (!form.fullName || !form.phone || !form.bookingDate || !form.bookingTime) {
      alert("Please fill in the required fields.");
      return;
    }

    const bookingId = uid("book");
    const total = selectedPackage.price;
    const deposit = 100;
    const balance = Math.max(total - deposit, 0);

    const booking: Booking = {
      id: bookingId,
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      bookingDate: form.bookingDate,
      bookingTime: form.bookingTime,
      peopleCount: form.peopleCount,
      notes: form.notes,
      referral: form.referral,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      packageCategory: selectedPackage.category,
      totalAmount: total,
      depositPaid: deposit,
      balanceDue: balance,
      paymentStatus: "deposit_paid",
      bookingStatus: "confirmed",
      imageSelectionStatus: "pending",
      dispatchStatus: "not_sent",
      loyaltyEligible: false,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => {
      const existingCustomer = prev.customers.find((c) => c.phone === form.phone);
      let customers: Customer[];

      if (existingCustomer) {
        customers = prev.customers.map((c) =>
          c.phone === form.phone
            ? {
                ...c,
                name: form.fullName,
                email: form.email || c.email,
                totalBookings: c.totalBookings + 1,
                totalSpent: c.totalSpent + total,
                lastBookingDate: form.bookingDate,
                rewardStatus: c.totalBookings + 1 >= 3 ? "Reward eligible" : "Normal",
              }
            : c
        );
      } else {
        customers = [
          ...prev.customers,
          {
            id: uid("cust"),
            name: form.fullName,
            phone: form.phone,
            email: form.email,
            totalBookings: 1,
            totalSpent: total,
            lastBookingDate: form.bookingDate,
            rewardStatus: "Normal",
          },
        ];
      }

      return {
        bookings: [booking, ...prev.bookings],
        customers,
      };
    });

    setForm({
      fullName: "",
      phone: "",
      email: "",
      bookingDate: "",
      bookingTime: "",
      peopleCount: "1",
      notes: "",
      referral: "",
    });
    setPolicyAccepted(false);
    alert("Booking created successfully.");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-xl">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                <Camera className="h-4 w-4" /> ZED Studio Photography
              </div>
              <div className="...">
  <h1 className="text-4xl font-bold text-white">
    Capture Your Best Moments in Style 📸
  </h1>

  <p className="mt-3 text-slate-200 max-w-xl">
    Book your professional photo session at ZED Studio Photography.
    Simple booking, flexible packages, and premium quality photos.
  </p>

  {/* 👉 ADD THIS HERE */}
  <a
    href="https://wa.me/260976888824"
    target="_blank"
    className="inline-block mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium"
  >
    Chat on WhatsApp
  </a>

</div>
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

        <Tabs defaultValue="booking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl">
            <TabsTrigger value="booking">Customer Booking</TabsTrigger>
            <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
            <TabsTrigger value="customers">Customer Loyalty</TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
              <Card className="rounded-3xl border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CalendarDays className="h-5 w-5" /> Create Booking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Full Name *</Label>
                      <Input
                        value={form.fullName}
                        onChange={(e) => updateForm("fullName", e.target.value)}
                        placeholder="Customer full name"
                      />
                    </div>
                    <div>
                      <Label>Phone Number *</Label>
                      <Input
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="097xxxxxxx"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        placeholder="Optional email"
                      />
                    </div>
                    <div>
                      <Label>Number of People</Label>
                      <Input
                        value={form.peopleCount}
                        onChange={(e) => updateForm("peopleCount", e.target.value)}
                        placeholder="1, 2, 3..."
                      />
                    </div>
                    <div>
                      <Label>Booking Date *</Label>
                      <Input
                        type="date"
                        value={form.bookingDate}
                        onChange={(e) => updateForm("bookingDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Booking Time *</Label>
                      <Input
                        type="time"
                        value={form.bookingTime}
                        onChange={(e) => updateForm("bookingTime", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>How did the customer hear about you?</Label>
                    <Input
                      value={form.referral}
                      onChange={(e) => updateForm("referral", e.target.value)}
                      placeholder="Facebook, WhatsApp, walk-in, referral..."
                    />
                  </div>

                  <div>
                    <Label>Booking Notes</Label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                      placeholder="Shoot details, preferred backdrop, birthday theme, special requests..."
                    />
                  </div>

                  <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Choose a Package</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="rounded-xl">
                            View Policy
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-3xl">
                          <DialogHeader>
  <DialogTitle>Booking Policy</DialogTitle>
  <DialogDescription>
    Please read the studio booking rules before confirming your booking.
  </DialogDescription>
</DialogHeader>
                          <div className="whitespace-pre-line text-sm leading-7 text-slate-700">
                            {POLICY_TEXT}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {Object.entries(groupedPackages).map(
                      ([category, items]: [string, PackageItem[]]) => (
                        <div key={category} className="space-y-3">
                          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            {category}
                          </h4>
                          <div className="grid gap-3 md:grid-cols-2">
                            {items.map((item) => {
                              const active = selectedPackageId === item.id;
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setSelectedPackageId(item.id)}
                                  className={`rounded-2xl border p-4 text-left transition ${
                                    active
                                      ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                                      : "border-slate-200 bg-white hover:border-slate-400"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="font-semibold">{item.name}</p>
                                      <p
                                        className={`mt-1 text-sm ${
                                          active ? "text-slate-200" : "text-slate-500"
                                        }`}
                                      >
                                        {item.photos} photos • {item.people} people
                                      </p>
                                    </div>
                                    <Badge className="rounded-full bg-white text-slate-900">
                                      {currency(item.price)}
                                    </Badge>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="rounded-2xl border bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Selected Package</p>
                        <p className="text-sm text-slate-500">{selectedPackage.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {currency(selectedPackage.price)}
                        </p>
                        <p className="text-sm text-slate-500">
                          Deposit: {currency(100)} • Balance:{" "}
                          {currency(selectedPackage.price - 100)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4">
                    <Checkbox
                      checked={policyAccepted}
                      onCheckedChange={(checked) =>
                        setPolicyAccepted(Boolean(checked))
                      }
                    />
                    <div className="text-sm leading-6 text-slate-700">
                      I have read and accepted the booking policy. I understand that
                      K100 is required as a non-refundable down payment and the
                      remaining balance is paid on the day of the shoot.
                    </div>
                  </div>

                  <Button
                    onClick={submitBooking}
                    className="h-12 w-full rounded-2xl text-base"
                  >
                    Confirm Booking
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CreditCard className="h-5 w-5" /> Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Studio policy</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      Strictly by booking only. A deposit of K100 confirms the slot.
                      Call/WhatsApp: 0976888824 for bookings. Full balance must be
                      settled on shoot day before the session begins.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center justify-between rounded-2xl border p-4">
                      <span className="text-slate-500">Total package price</span>
                      <span className="font-bold">
                        {currency(selectedPackage.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border p-4">
                      <span className="text-slate-500">Required deposit</span>
                      <span className="font-bold">{currency(100)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border p-4">
                      <span className="text-slate-500">Balance on shoot day</span>
                      <span className="font-bold">
                        {currency(selectedPackage.price - 100)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold">Best for office use later</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Confirm deposit paid</li>
                      <li>• Track image selection</li>
                      <li>• Mark when photos are dispatched</li>
                      <li>• See repeat customers and reward eligibility</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
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
                            <CalendarDays className="h-4 w-4" /> {booking.bookingDate} at{" "}
                            {booking.bookingTime}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="h-4 w-4" /> {booking.peopleCount} people
                          </div>
                          <p className="text-sm text-slate-700">
                            <span className="font-medium">Package:</span>{" "}
                            {booking.packageName}
                          </p>
                          <p className="text-sm text-slate-700">
                            <span className="font-medium">Payment:</span> Deposit{" "}
                            {currency(booking.depositPaid)} paid, balance{" "}
                            {currency(booking.balanceDue)}
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
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
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
                            <span className="font-medium">Total bookings:</span>{" "}
                            {customer.totalBookings}
                          </p>
                          <p>
                            <span className="font-medium">Total value:</span>{" "}
                            {currency(customer.totalSpent)}
                          </p>
                          <p>
                            <span className="font-medium">Last booking:</span>{" "}
                            {customer.lastBookingDate}
                          </p>
                          <p>
                            <span className="font-medium">Reward status:</span>{" "}
                            {customer.rewardStatus}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}