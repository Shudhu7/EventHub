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
import Navbar from '@/components/Navbar';
import AdminUserManagement from '@/components/AdminUserManagement';
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

  // User Management functions
  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "Add user functionality would be implemented here.",
    });
  };

  const handleEditUser = (userId: string, userName: string) => {
    toast({
      title: "Edit User",
      description: `Edit functionality for ${userName} would be implemented here.`,
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      toast({
        title: "User Deleted",
        description: `${userName} has been deleted successfully.`,
      });
    }
  };

  // Pagination functions
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      toast({
        title: "Previous Page",
        description: `Navigated to page ${currentPage - 1}`,
      });
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    toast({
      title: "Next Page", 
      description: `Navigated to page ${currentPage + 1}`,
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
                          {activeTab === 'all' 
                            ? "You haven't made any bookings yet. Start exploring events!"
                            : `You don't have any ${activeTab} bookings.`
                          }
                        </p>
                        <Button 
                          onClick={() => window.location.href = '/'}
                          className="bg-primary hover:bg-primary/90 text-white font-medium dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
                        >
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        {/* Fixed container with proper mobile padding */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your events, users, and view analytics</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            {/* Mobile-responsive tab list with improved dark mode */}
            <TabsList className="grid w-full grid-cols-3 h-auto bg-gray-100 dark:bg-gray-800">
              <TabsTrigger 
                value="overview" 
                className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300 font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300 font-medium"
              >
                Events
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300 font-medium"
              >
                Users
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              {/* Stats Cards with dark mode support */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Bookings</p>
                        <p className="text-3xl font-bold text-primary dark:text-primary-400">{totalBookings}</p>
                      </div>
                      <Users className="h-8 w-8 text-primary dark:text-primary-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                        <p className="text-3xl font-bold text-primary dark:text-primary-400">${totalRevenue.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary dark:text-primary-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Events</p>
                        <p className="text-3xl font-bold text-primary dark:text-primary-400">{upcomingEvents}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-primary dark:text-primary-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity with dark mode support */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                        <div>
                          <p className="font-medium dark:text-white">New booking confirmed</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Tech Conference 2025 - John Doe</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Plus className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                        <div>
                          <p className="font-medium dark:text-white">New event created</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">AI & Cloud Tech Conference</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">5 hours ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                        <div>
                          <p className="font-medium dark:text-white">New user registered</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">jane.smith@example.com</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Management Tab - ENHANCED WITH FILTERS AND DARK MODE */}
            <TabsContent value="events">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  {/* Fixed header layout for mobile with dark mode */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <CardTitle className="flex items-center dark:text-white">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Events Management
                    </CardTitle>
                    
                    {/* Fixed button container with improved styling */}
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium dark:bg-primary dark:hover:bg-primary/90 dark:text-white">
                            <Plus className="mr-2 h-4 w-4 text-white" />
                            <span className="whitespace-nowrap text-white font-medium">Add Event</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="dark:text-white">Create New Event</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="title" className="dark:text-gray-200">Event Title</Label>
                                <Input
                                  id="title"
                                  value={newEvent.title}
                                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                  placeholder="Enter event title"
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                />
                              </div>
                              <div>
                                <Label htmlFor="category" className="dark:text-gray-200">Category</Label>
                                <Input
                                  id="category"
                                  value={newEvent.category}
                                  onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                                  placeholder="Enter category"
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="description" className="dark:text-gray-200">Description</Label>
                              <Textarea
                                id="description"
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                placeholder="Enter event description"
                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="date" className="dark:text-gray-200">Date</Label>
                                <Input
                                  id="date"
                                  type="date"
                                  value={newEvent.date}
                                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="time" className="dark:text-gray-200">Time</Label>
                                <Input
                                  id="time"
                                  type="time"
                                  value={newEvent.time}
                                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="location" className="dark:text-gray-200">Location</Label>
                              <Input
                                id="location"
                                value={newEvent.location}
                                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                placeholder="Enter event location"
                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="price" className="dark:text-gray-200">Price ($)</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  value={newEvent.price}
                                  onChange={(e) => setNewEvent({...newEvent, price: e.target.value})}
                                  placeholder="0"
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                />
                              </div>
                              <div>
                                <Label htmlFor="totalSeats" className="dark:text-gray-200">Total Seats</Label>
                                <Input
                                  id="totalSeats"
                                  type="number"
                                  value={newEvent.totalSeats}
                                  onChange={(e) => setNewEvent({...newEvent, totalSeats: e.target.value})}
                                  placeholder="100"
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="image" className="dark:text-gray-200">Image URL</Label>
                              <Input
                                id="image"
                                value={newEvent.image}
                                onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
                                placeholder="https://..."
                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                              />
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => setIsCreateModalOpen(false)} 
                                className="w-full sm:w-auto text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
                              >
                                <span className="font-medium">Cancel</span>
                              </Button>
                              <Button 
                                onClick={handleCreateEvent} 
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
                              >
                                <span className="text-white font-medium">Create Event</span>
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Edit Event Modal with dark mode support */}
                      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="dark:text-white">Edit Event</DialogTitle>
                          </DialogHeader>
                          {editingEvent && (
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit-title" className="dark:text-gray-200">Event Title</Label>
                                  <Input
                                    id="edit-title"
                                    value={editingEvent.title}
                                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                                    placeholder="Enter event title"
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-category" className="dark:text-gray-200">Category</Label>
                                  <select
                                    id="edit-category"
                                    value={editingEvent.category}
                                    onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                                  >
                                    <option value="">Select Category</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Music">Music</option>
                                    <option value="Business">Business</option>
                                    <option value="Art">Art</option>
                                    <option value="Food">Food</option>
                                    <option value="Marketing">Marketing</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="edit-description" className="dark:text-gray-200">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  value={editingEvent.description}
                                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                                  placeholder="Enter event description"
                                  rows={3}
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit-date" className="dark:text-gray-200">Date</Label>
                                  <Input
                                    id="edit-date"
                                    type="date"
                                    value={editingEvent.date}
                                    onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-time" className="dark:text-gray-200">Time</Label>
                                  <Input
                                    id="edit-time"
                                    type="time"
                                    value={editingEvent.time}
                                    onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})}
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="edit-location" className="dark:text-gray-200">Location</Label>
                                <Input
                                  id="edit-location"
                                  value={editingEvent.location}
                                  onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                                  placeholder="Enter event location"
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <Label htmlFor="edit-price" className="dark:text-gray-200">Price ($)</Label>
                                  <Input
                                    id="edit-price"
                                    type="number"
                                    value={editingEvent.price}
                                    onChange={(e) => setEditingEvent({...editingEvent, price: e.target.value})}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-totalSeats" className="dark:text-gray-200">Total Seats</Label>
                                  <Input
                                    id="edit-totalSeats"
                                    type="number"
                                    value={editingEvent.totalSeats}
                                    onChange={(e) => setEditingEvent({...editingEvent, totalSeats: e.target.value})}
                                    placeholder="100"
                                    min="1"
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-availableSeats" className="dark:text-gray-200">Available Seats</Label>
                                  <Input
                                    id="edit-availableSeats"
                                    type="number"
                                    value={editingEvent.availableSeats}
                                    onChange={(e) => setEditingEvent({...editingEvent, availableSeats: e.target.value})}
                                    placeholder="100"
                                    min="0"
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="edit-image" className="dark:text-gray-200">Image URL</Label>
                                <Input
                                  id="edit-image"
                                  value={editingEvent.image}
                                  onChange={(e) => setEditingEvent({...editingEvent, image: e.target.value})}
                                  placeholder="https://example.com/image.jpg"
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                />
                                {editingEvent.image && (
                                  <div className="mt-2">
                                    <img 
                                      src={editingEvent.image} 
                                      alt="Event preview" 
                                      className="w-32 h-20 object-cover rounded border dark:border-gray-600"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t dark:border-gray-600">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setIsEditModalOpen(false)} 
                                  className="w-full sm:w-auto text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                  <span className="font-medium">Cancel</span>
                                </Button>
                                <Button 
                                  onClick={handleUpdateEvent} 
                                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
                                >
                                  <Edit className="mr-2 h-4 w-4 text-white" />
                                  <span className="text-white font-medium">Update Event</span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Enhanced Filter Section with dark mode */}
                  <div className="space-y-4 mb-6">
                    {/* Search and Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          placeholder="Search events..."
                          value={eventFilters.searchTerm}
                          onChange={(e) => setEventFilters({...eventFilters, searchTerm: e.target.value})}
                          className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <select
                          value={eventFilters.selectedCategory}
                          onChange={(e) => setEventFilters({...eventFilters, selectedCategory: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        >
                          {eventCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <select
                          value={`${eventFilters.sortBy}-${eventFilters.sortOrder}`}
                          onChange={(e) => {
                            const [sortBy, sortOrder] = e.target.value.split('-');
                            setEventFilters({...eventFilters, sortBy, sortOrder: sortOrder as 'asc' | 'desc'});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        >
                          <option value="date-asc">Date (Earliest First)</option>
                          <option value="date-desc">Date (Latest First)</option>
                          <option value="title-asc">Title (A-Z)</option>
                          <option value="title-desc">Title (Z-A)</option>
                          <option value="price-asc">Price (Low to High)</option>
                          <option value="price-desc">Price (High to Low)</option>
                          <option value="category-asc">Category (A-Z)</option>
                          <option value="seats-asc">Available Seats (Low to High)</option>
                          <option value="seats-desc">Available Seats (High to Low)</option>
                        </select>
                      </div>
                    </div>

                    {/* Advanced Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium dark:text-gray-200">Date From</Label>
                        <Input
                          type="date"
                          value={eventFilters.dateFrom}
                          onChange={(e) => setEventFilters({...eventFilters, dateFrom: e.target.value})}
                          className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium dark:text-gray-200">Date To</Label>
                        <Input
                          type="date"
                          value={eventFilters.dateTo}
                          onChange={(e) => setEventFilters({...eventFilters, dateTo: e.target.value})}
                          className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium dark:text-gray-200">Min Price ($)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={eventFilters.priceMin}
                          onChange={(e) => setEventFilters({...eventFilters, priceMin: e.target.value})}
                          className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium dark:text-gray-200">Max Price ($)</Label>
                        <Input
                          type="number"
                          placeholder="500"
                          value={eventFilters.priceMax}
                          onChange={(e) => setEventFilters({...eventFilters, priceMax: e.target.value})}
                          className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Showing {filteredAndSortedEvents.length} of {events.length} events
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearEventFilters}
                        className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Events Table with dark mode */}
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:border-gray-700">
                        <TableHead className="dark:text-gray-300">Event</TableHead>
                        <TableHead className="dark:text-gray-300">Date</TableHead>
                        <TableHead className="hidden sm:table-cell dark:text-gray-300">Category</TableHead>
                        <TableHead className="hidden md:table-cell dark:text-gray-300">Price</TableHead>
                        <TableHead className="hidden lg:table-cell dark:text-gray-300">Seats</TableHead>
                        <TableHead className="dark:text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedEvents.length > 0 ? (
                        filteredAndSortedEvents.map((event) => (
                          <TableRow key={event.id} className="dark:border-gray-700">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={event.image} 
                                  alt={event.title}
                                  className="w-12 h-12 rounded object-cover"
                                />
                                <div className="min-w-0">
                                  <p className="font-medium truncate dark:text-white">{event.title}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{event.location}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div>
                                <div className="font-medium dark:text-white">{new Date(event.date).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">{event.time}</div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">{event.category}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="font-medium dark:text-white">${event.price}</span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="text-sm">
                                <div className="font-medium dark:text-white">{event.availableSeats}/{event.totalSeats}</div>
                                <div className="text-gray-600 dark:text-gray-300">
                                  {Math.round((event.availableSeats / event.totalSeats) * 100)}% available
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                  title="Edit Event"
                                  onClick={() => handleEditEvent(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-red-600 dark:hover:border-red-500"
                                  title="Delete Event"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center space-y-2">
                              <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No events found</h3>
                              <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters to see more events.</p>
                              <Button 
                                variant="outline" 
                                onClick={clearEventFilters} 
                                className="mt-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                Clear Filters
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  </div>

                  {/* Pagination (if needed) with dark mode */}
                  {filteredAndSortedEvents.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-2 sm:space-y-0">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Total: {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''}
                      </div>
                      {filteredAndSortedEvents.length > 10 && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            Previous
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management Tab - FIXED MOBILE LAYOUT WITH DARK MODE */}
            <TabsContent value="users">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  {/* Fixed header layout for mobile with dark mode */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <CardTitle className="flex items-center dark:text-white">
                      <Users className="mr-2 h-5 w-5" />
                      User Management
                    </CardTitle>
                    
                    {/* Fixed button container with better styling */}
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <Button 
                        onClick={handleAddUser}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
                      >
                        <Plus className="mr-2 h-4 w-4 text-white" />
                        <span className="whitespace-nowrap text-white font-medium">Add User</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search and filters - mobile responsive with dark mode */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        placeholder="Search users..."
                        className="w-full pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-w-0 sm:min-w-[120px] dark:bg-gray-700 dark:text-white">
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>User</option>
                      </select>
                      <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-w-0 sm:min-w-[120px] dark:bg-gray-700 dark:text-white">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Mobile responsive table with dark mode */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="dark:border-gray-700">
                          <TableHead className="dark:text-gray-300">User</TableHead>
                          <TableHead className="hidden sm:table-cell dark:text-gray-300">Role</TableHead>
                          <TableHead className="hidden md:table-cell dark:text-gray-300">Status</TableHead>
                          <TableHead className="hidden lg:table-cell dark:text-gray-300">Join Date</TableHead>
                          <TableHead className="dark:text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Sample user data with dark mode and functional buttons */}
                        <TableRow className="dark:border-gray-700">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary dark:bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                JD
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium dark:text-white">John Doe</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">john@example.com</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">User</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">Active</Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell dark:text-gray-300">Jan 15, 2024</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser('user-1', 'John Doe')}
                                className="h-8 w-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                title="Edit User"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser('user-1', 'John Doe')}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-red-600 dark:hover:border-red-500"
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        <TableRow className="dark:border-gray-700">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary dark:bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                JS
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium dark:text-white">Jane Smith</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">jane@example.com</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="default" className="bg-primary text-white dark:bg-primary-600">Admin</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">Active</Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell dark:text-gray-300">Feb 10, 2024</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser('user-2', 'Jane Smith')}
                                className="h-8 w-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                title="Edit User"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser('user-2', 'Jane Smith')}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-red-600 dark:hover:border-red-500"
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile-friendly pagination with dark mode and functional buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-2 sm:space-y-0">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Showing {((currentPage - 1) * usersPerPage) + 1}-{Math.min(currentPage * usersPerPage, 2)} of 2 users
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleNextPage}
                        disabled={currentPage * usersPerPage >= 2} // Disable if no more pages
                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <EnhancedFooter />
      </div>
    );
  }
  <TabsContent value="users">
  <EnhancedUserManagement />
</TabsContent>

  // Fallback with dark mode support
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">You don't have permission to access this page.</p>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default Dashboard;