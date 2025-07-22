import EnhancedUserManagement from '@/components/EnhancedUserManagement';
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
];
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Navbar from '@/components/Navbar';
import UniversalBookingActions from '@/components/UniversalBookingActions';
import { events } from '@/data/events';
import { useAuth } from '@/contexts/AuthContext';
import { UserBooking } from '@/types/event';
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  TrendingUp,
  BarChart3,
  MapPin,
  Clock,
  Download,
  Star,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ticket,
  Settings,
  FileText,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnhancedFooter from '@/components/EnhancedFooter';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Check if we're on the bookings route or dashboard route
  const isBookingsPage = location.pathname === '/my-bookings';
  const isDashboardPage = location.pathname === '/dashboard';

  // Load user bookings
  useEffect(() => {
    const loadBookings = () => {
      setLoading(true);
      try {
        if (user) {
          const savedBookings = localStorage.getItem(`bookings_${user.id}`);
          if (savedBookings) {
            const parsedBookings = JSON.parse(savedBookings);
            const validBookings = parsedBookings.filter((booking: any) =>
              booking &&
              booking.id &&
              booking.eventTitle &&
              booking.status
            );
            setBookings(validBookings);
          } else {
            setBookings([]);
          }
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
        setBookings([]);
        toast({
          title: "Error Loading Bookings",
          description: "There was an error loading your bookings. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user, toast]);

  // Mock data for admin
  const totalBookings = 1247;
  const totalRevenue = 86420;
  const upcomingEvents = events.length;

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    totalSeats: '',
    category: '',
    image: ''
  });

  // Event filtering states
  const [eventFilters, setEventFilters] = useState({
    searchTerm: '',
    selectedCategory: 'All',
    dateFrom: '',
    dateTo: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'date',
    sortOrder: 'asc' as 'asc' | 'desc'
  });

  // Available categories from events data
  const eventCategories = ['All', ...Array.from(new Set(events.map(event => event.category)))];

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      // Search filter
      const matchesSearch = eventFilters.searchTerm === '' ||
        event.title.toLowerCase().includes(eventFilters.searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(eventFilters.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(eventFilters.searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = eventFilters.selectedCategory === 'All' ||
        event.category === eventFilters.selectedCategory;

      // Date range filter
      const matchesDateFrom = eventFilters.dateFrom === '' ||
        new Date(event.date) >= new Date(eventFilters.dateFrom);
      const matchesDateTo = eventFilters.dateTo === '' ||
        new Date(event.date) <= new Date(eventFilters.dateTo);

      // Price range filter
      const matchesPriceMin = eventFilters.priceMin === '' ||
        event.price >= parseFloat(eventFilters.priceMin);
      const matchesPriceMax = eventFilters.priceMax === '' ||
        event.price <= parseFloat(eventFilters.priceMax);

      return matchesSearch && matchesCategory && matchesDateFrom &&
             matchesDateTo && matchesPriceMin && matchesPriceMax;
    });

    // Sort events
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (eventFilters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'seats':
          comparison = a.availableSeats - b.availableSeats;
          break;
        default:
          comparison = 0;
      }
      return eventFilters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [eventFilters]);

  // Clear all event filters
  const clearEventFilters = () => {
    setEventFilters({
      searchTerm: '',
      selectedCategory: 'All',
      dateFrom: '',
      dateTo: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'date',
      sortOrder: 'asc'
    });
  };

  // Booking management functions
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date time:', error);
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filterBookings = (filter: string) => {
    try {
      if (!Array.isArray(bookings)) {
        return [];
      }
      if (filter === 'all') return bookings;
      return bookings.filter(booking => booking && booking.status === filter);
    } catch (error) {
      console.error('Error filtering bookings:', error);
      return [];
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!bookingId) {
      toast({
        title: "Error",
        description: "Invalid booking ID.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const updatedBookings = bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' as const }
            : booking
        );
        setBookings(updatedBookings);
        if (user) {
          localStorage.setItem(`bookings_${user.id}`, JSON.stringify(updatedBookings));
        }
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been cancelled successfully.",
        });
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast({
          title: "Error",
          description: "There was an error cancelling your booking. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Universal Booking Actions handlers
  const handleRatingSubmit = (bookingId: string, rating: number, review: string) => {
    console.log('Rating submitted:', { bookingId, rating, review });
  };

  const handleDownloadComplete = (bookingId: string) => {
    console.log('Download completed for booking:', bookingId);
  };

  const showToastMessage = (title: string, description: string, variant?: 'default' | 'destructive') => {
    toast({
      title,
      description,
      variant: variant || "default",
    });
  };

  // Admin functions
  const handleCreateEvent = () => {
    toast({
      title: "Event Created",
      description: "New event has been created successfully.",
    });
    setIsCreateModalOpen(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      price: '',
      totalSeats: '',
      category: '',
      image: ''
    });
  };

  // Pagination functions for dashboard's internal tables (if any, not for user management)
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // This state is likely for a different context or could be removed if only EnhancedUserManagement handles users

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      toast({
        title: "Previous Page",
        description: `Mapsd to page ${currentPage - 1}`,
      });
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    toast({
      title: "Next Page",
      description: `Mapsd to page ${currentPage + 1}`,
      });
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      price: event.price.toString(),
      totalSeats: event.totalSeats.toString(),
      availableSeats: event.availableSeats.toString(),
      category: event.category,
      image: event.image
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;

    // In a real app, this would make an API call to update the event
    toast({
      title: "Event Updated",
      description: `${editingEvent.title} has been updated successfully.`,
    });
    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (window.confirm(`Are you sure you want to delete "${event?.title}"?`)) {
      // In a real app, this would make an API call to delete the event
      toast({
        title: "Event Deleted",
        description: `${event?.title} has been deleted successfully.`,
      });
    }
  };

  // Authentication check
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Please Login</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">You need to be logged in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render Bookings Page (for both regular users and admin when accessing /my-bookings)
  if (isBookingsPage || (isDashboardPage && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Bookings</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your event bookings and download tickets</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Mobile-Friendly Tab List with improved dark mode */}
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 p-1 h-auto bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="all"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300"
                >
                  <span className="hidden sm:inline">All Bookings</span>
                  <span className="sm:hidden text-xs">All</span>
                  <span className="text-xs sm:ml-2">({bookings.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="confirmed"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300"
                >
                  <span className="hidden sm:inline">Confirmed</span>
                  <span className="sm:hidden text-xs">Confirmed</span>
                  <span className="text-xs sm:ml-2">({filterBookings('confirmed').length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300"
                >
                  <span className="hidden sm:inline">Pending</span>
                  <span className="sm:hidden text-xs">Pending</span>
                  <span className="text-xs sm:ml-2">({filterBookings('pending').length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300"
                >
                  <span className="hidden sm:inline">Cancelled</span>
                  <span className="sm:hidden text-xs">Cancelled</span>
                  <span className="text-xs sm:ml-2">({filterBookings('cancelled').length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filterBookings(activeTab).map((booking) => {
                    if (!booking || !booking.id) {
                      return null;
                    }

                    return (
                      <Card key={booking.id} className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                        <CardContent className="p-0">
                          <div className="flex flex-col lg:flex-row">
                            {/* Event Image */}
                            <div className="lg:w-48 h-48 lg:h-auto">
                              <img
                                src={booking.eventImage || '/placeholder-image.jpg'}
                                alt={booking.eventTitle || 'Event'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop';
                                }}
                              />
                            </div>

                            {/* Booking Details */}
                            <div className="flex-1 p-6">
                              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                      {booking.eventTitle || 'Untitled Event'}
                                    </h3>
                                    {booking.category && (
                                      <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">{booking.category}</Badge>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>{formatDate(booking.eventDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      <span>{booking.eventTime || 'Time TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      <span>{booking.eventLocation || 'Location TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4" />
                                      <span>{booking.numberOfTickets || 1} ticket{(booking.numberOfTickets || 1) > 1 ? 's' : ''}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 lg:mt-0">
                                  <Badge className={getStatusColor(booking.status)}>
                                    {getStatusIcon(booking.status)}
                                    <span className="ml-1 capitalize">{booking.status}</span>
                                  </Badge>
                                </div>
                              </div>

                              {/* Booking Information */}
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-900 dark:text-white">Booking ID:</span>
                                    <div className="text-gray-600 dark:text-gray-300">{booking.ticketId || booking.id}</div>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900 dark:text-white">Booked on:</span>
                                    <div className="text-gray-600 dark:text-gray-300">
                                      {formatDateTime(booking.bookingDate)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900 dark:text-white">Total Amount:</span>
                                    <div className="text-lg font-bold text-primary dark:text-primary-400">
                                      ${booking.totalAmount || 0}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Action Buttons */}
                              <div className="space-y-2">
                                <UniversalBookingActions
                                  booking={booking}
                                  onRatingSubmit={handleRatingSubmit}
                                  onDownloadComplete={handleDownloadComplete}
                                  showToast={showToastMessage}
                                />

                                {/* Keep cancel booking functionality with better dark mode styling */}
                                {booking.status === 'pending' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-red-600 dark:hover:border-red-500"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span className="font-medium">Cancel Booking</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {filterBookings(activeTab).length === 0 && (
                    <div className="text-center py-12">
                      <div className="max-w-md mx-auto">
                        <Ticket className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No bookings found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {activeTab === 'all' ? "You haven't made any bookings yet. Start exploring events!" : `You don't have any ${activeTab} bookings.` }
                        </p>
                        <Button onClick={() => window.location.href = '/'} className="bg-primary hover:bg-primary/90 text-white font-medium dark:bg-primary dark:hover:bg-primary/90 dark:text-white" >
                          <span className="text-white font-medium">Browse Events</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    );
  }

  // Admin Dashboard (only accessible via /dashboard route for admin users)
  if (isDashboardPage && user.role === 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900"> {/* Added flex flex-col */}
        <Navbar />
        {/* Fixed container with proper mobile padding */}
        <div className="flex-grow max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8"> {/* Added flex-grow */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your events, users, and view analytics</p>
          </div>
          <Tabs defaultValue="overview" className="space-y-6">
            {/* Mobile-responsive tab list with improved dark mode */}
            <TabsList className="grid w-full grid-cols-3 h-auto bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300 font-medium" >
                Overview
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300 font-medium" >
                Events
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300 font-medium" >
                Users
              </TabsTrigger>
            </TabsList>
            {/* Overview Tab */}
            <TabsContent value="overview" className="min-h-[600px]"> {/* Added min-h */}
  {/* Stats Cards with dark mode support */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Bookings</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-400">{totalBookings}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% from last month</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="h-8 w-8 text-primary dark:text-primary-400" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-400">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8% from last month</p>
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Upcoming Events</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-400">{upcomingEvents}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">5 this week</p>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-400">2,847</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">423 online now</p>
          </div>
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Quick Actions */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-lg dark:text-white">
          <Plus className="mr-2 h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full justify-start"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Event
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          System Settings
        </Button>
      </CardContent>
    </Card>

    {/* Recent Activity */}
    <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-lg dark:text-white">
          <BarChart3 className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium dark:text-white">New booking confirmed</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Summer Music Fest - 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Ticket className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium dark:text-white">Event created</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tech Conference 2024 - 15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium dark:text-white">Payment pending</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Art Workshop - 1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium dark:text-white">5-star review received</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Comedy Night - 2 hours ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Charts and Analytics */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    {/* Revenue Chart */}
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-lg dark:text-white">
          <TrendingUp className="mr-2 h-5 w-5" />
          Revenue Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Revenue Chart</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Chart implementation needed</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Popular Events */}
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-lg dark:text-white">
          <Star className="mr-2 h-5 w-5" />
          Top Performing Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.slice(0, 5).map((event, index) => (
            <div key={event.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary dark:text-primary-400">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white">{event.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {event.totalSeats - event.availableSeats} bookings
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                ${event.price}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>

  {/* System Status */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">System Status</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <p className="text-sm text-green-600 dark:text-green-400">All systems operational</p>
            </div>
          </div>
          <Settings className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>
      </CardContent>
    </Card>

    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Server Load</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">23%</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Database Size</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">2.4 GB</p>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Backup</p>
            <p className="text-sm text-gray-900 dark:text-white mt-1">2 hours ago</p>
          </div>
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
            <Download className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</TabsContent>
            {/* Events Tab */}
            <TabsContent value="events" className="min-h-[600px]"> {/* Added min-h */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center dark:text-white">
                      <Ticket className="mr-2 h-5 w-5" /> Event Management
                    </CardTitle>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Add Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="dark:text-white">Create New Event</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="eventTitle" className="dark:text-gray-200">Event Title</Label>
                            <Input id="eventTitle" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g., Summer Music Fest" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </div>
                          <div>
                            <Label htmlFor="eventDescription" className="dark:text-gray-200">Description</Label>
                            <Textarea id="eventDescription" value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} placeholder="Brief description of the event" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="eventDate" className="dark:text-gray-200">Date</Label>
                              <Input id="eventDate" type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                              <Label htmlFor="eventTime" className="dark:text-gray-200">Time</Label>
                              <Input id="eventTime" type="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="eventLocation" className="dark:text-gray-200">Location</Label>
                            <Input id="eventLocation" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} placeholder="e.g., Central Park" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="eventPrice" className="dark:text-gray-200">Price ($)</Label>
                              <Input id="eventPrice" type="number" value={newEvent.price} onChange={(e) => setNewEvent({...newEvent, price: e.target.value})} placeholder="e.g., 25.00" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </div>
                            <div>
                              <Label htmlFor="eventSeats" className="dark:text-gray-200">Total Seats</Label>
                              <Input id="eventSeats" type="number" value={newEvent.totalSeats} onChange={(e) => setNewEvent({...newEvent, totalSeats: e.target.value})} placeholder="e.g., 500" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="eventCategory" className="dark:text-gray-200">Category</Label>
                            <Input id="eventCategory" value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})} placeholder="e.g., Concert, Workshop" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </div>
                          <div>
                            <Label htmlFor="eventImage" className="dark:text-gray-200">Image URL</Label>
                            <Input id="eventImage" value={newEvent.image} onChange={(e) => setNewEvent({...newEvent, image: e.target.value})} placeholder="https://example.com/image.jpg" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </div>
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                              Cancel
                            </Button>
                            <Button onClick={handleCreateEvent}>
                              <Plus className="mr-2 h-4 w-4" /> Create Event
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Event Filters */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          placeholder="Search events..."
                          value={eventFilters.searchTerm}
                          onChange={(e) => setEventFilters({...eventFilters, searchTerm: e.target.value})}
                          className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      <Input
                        type="date"
                        value={eventFilters.dateFrom}
                        onChange={(e) => setEventFilters({...eventFilters, dateFrom: e.target.value})}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        title="Date From"
                      />
                      <Input
                        type="date"
                        value={eventFilters.dateTo}
                        onChange={(e) => setEventFilters({...eventFilters, dateTo: e.target.value})}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        title="Date To"
                      />
                      <Button variant="outline" onClick={clearEventFilters} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Clear Filters
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <select
                        value={eventFilters.selectedCategory}
                        onChange={(e) => setEventFilters({...eventFilters, selectedCategory: e.target.value})}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {eventCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        placeholder="Min Price"
                        value={eventFilters.priceMin}
                        onChange={(e) => setEventFilters({...eventFilters, priceMin: e.target.value})}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                      <Input
                        type="number"
                        placeholder="Max Price"
                        value={eventFilters.priceMax}
                        onChange={(e) => setEventFilters({...eventFilters, priceMax: e.target.value})}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                      <select
                        value={eventFilters.sortBy}
                        onChange={(e) => setEventFilters({...eventFilters, sortBy: e.target.value as 'title' | 'date' | 'price' | 'category' | 'seats'})}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="date">Sort by Date</option>
                        <option value="title">Sort by Title</option>
                        <option value="price">Sort by Price</option>
                        <option value="category">Sort by Category</option>
                        <option value="seats">Sort by Seats</option>
                      </select>
                      <select
                        value={eventFilters.sortOrder}
                        onChange={(e) => setEventFilters({...eventFilters, sortOrder: e.target.value as 'asc' | 'desc'})}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:border-gray-700">
                        <TableHead className="dark:text-gray-300">Title</TableHead>
                        <TableHead className="dark:text-gray-300">Date</TableHead>
                        <TableHead className="dark:text-gray-300">Location</TableHead>
                        <TableHead className="dark:text-gray-300">Price</TableHead>
                        <TableHead className="dark:text-gray-300">Seats</TableHead>
                        <TableHead className="dark:text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedEvents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-gray-600 dark:text-gray-400">
                            No events found matching your criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAndSortedEvents.map((event) => (
                          <TableRow key={event.id} className="dark:border-gray-700">
                            <TableCell className="font-medium dark:text-white">{event.title}</TableCell>
                            <TableCell className="dark:text-gray-300">{formatDate(event.date)}</TableCell>
                            <TableCell className="dark:text-gray-300">{event.location}</TableCell>
                            <TableCell className="dark:text-gray-300">${event.price}</TableCell>
                            <TableCell className="dark:text-gray-300">{event.availableSeats}/{event.totalSeats}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Dialog open={isEditModalOpen && editingEvent?.id === event.id} onOpenChange={(open) => {
                                  if (!open) setEditingEvent(null);
                                  setIsEditModalOpen(open);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)} className="dark:text-gray-400 dark:hover:bg-gray-700">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                                    <DialogHeader>
                                      <DialogTitle className="dark:text-white">Edit Event</DialogTitle>
                                    </DialogHeader>
                                    {editingEvent && (
                                      <div className="space-y-4 mt-4">
                                        <div>
                                          <Label htmlFor="editEventTitle" className="dark:text-gray-200">Event Title</Label>
                                          <Input id="editEventTitle" value={editingEvent.title} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </div>
                                        <div>
                                          <Label htmlFor="editEventDescription" className="dark:text-gray-200">Description</Label>
                                          <Textarea id="editEventDescription" value={editingEvent.description} onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label htmlFor="editEventDate" className="dark:text-gray-200">Date</Label>
                                            <Input id="editEventDate" type="date" value={editingEvent.date} onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                          </div>
                                          <div>
                                            <Label htmlFor="editEventTime" className="dark:text-gray-200">Time</Label>
                                            <Input id="editEventTime" type="time" value={editingEvent.time} onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                          </div>
                                        </div>
                                        <div>
                                          <Label htmlFor="editEventLocation" className="dark:text-gray-200">Location</Label>
                                          <Input id="editEventLocation" value={editingEvent.location} onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label htmlFor="editEventPrice" className="dark:text-gray-200">Price ($)</Label>
                                            <Input id="editEventPrice" type="number" value={editingEvent.price} onChange={(e) => setEditingEvent({...editingEvent, price: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                          </div>
                                          <div>
                                            <Label htmlFor="editEventTotalSeats" className="dark:text-gray-200">Total Seats</Label>
                                            <Input id="editEventTotalSeats" type="number" value={editingEvent.totalSeats} onChange={(e) => setEditingEvent({...editingEvent, totalSeats: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                          </div>
                                        </div>
                                        <div>
                                          <Label htmlFor="editEventCategory" className="dark:text-gray-200">Category</Label>
                                          <Input id="editEventCategory" value={editingEvent.category} onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </div>
                                        <div>
                                          <Label htmlFor="editEventImage" className="dark:text-gray-200">Image URL</Label>
                                          <Input id="editEventImage" value={editingEvent.image} onChange={(e) => setEditingEvent({...editingEvent, image: e.target.value})} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                          <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                            Cancel
                                          </Button>
                                          <Button onClick={handleUpdateEvent}>
                                            Save Changes
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:bg-gray-700">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription className="dark:text-gray-300">
                                        This action cannot be undone. This will permanently delete the
                                        event and remove its data from our servers.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteEvent(event.id)} className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Users Tab */}
            <TabsContent value="users" className="min-h-[600px]"> {/* Added min-h */}
              {/* This is where the EnhancedUserManagement component is rendered */}
              <EnhancedUserManagement />
            </TabsContent>
          </Tabs>
        </div>
        <EnhancedFooter />
      </div>
    );
  }

  return null; // Should not reach here if user is handled
};

export default Dashboard;