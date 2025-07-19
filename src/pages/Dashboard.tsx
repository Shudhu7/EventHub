import React, { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnhancedFooter from '@/components/EnhancedFooter';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    // In a real app, this would make an API call to save the rating
  };

  const handleDownloadComplete = (bookingId: string) => {
    console.log('Download completed for booking:', bookingId);
    // In a real app, this could track download analytics
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

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      toast({
        title: "Event Deleted",
        description: "Event has been deleted successfully.",
      });
    }
  };

  // Authentication check
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Please Login</h1>
            <p className="text-lg text-gray-600">You need to be logged in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render Bookings Page (for both regular users and admin when accessing /my-bookings)
  if (isBookingsPage || (isDashboardPage && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage your event bookings and download tickets</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Mobile-Friendly Tab List */}
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 p-1 h-auto">
                <TabsTrigger 
                  value="all" 
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center"
                >
                  <span className="hidden sm:inline">All Bookings</span>
                  <span className="sm:hidden text-xs">All</span>
                  <span className="text-xs sm:ml-2">({bookings.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="confirmed"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center"
                >
                  <span className="hidden sm:inline">Confirmed</span>
                  <span className="sm:hidden text-xs">Confirmed</span>
                  <span className="text-xs sm:ml-2">({filterBookings('confirmed').length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="pending"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center"
                >
                  <span className="hidden sm:inline">Pending</span>
                  <span className="sm:hidden text-xs">Pending</span>
                  <span className="text-xs sm:ml-2">({filterBookings('pending').length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="cancelled"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center"
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
                      <Card key={booking.id} className="overflow-hidden">
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
                                    <h3 className="text-xl font-bold text-gray-900">
                                      {booking.eventTitle || 'Untitled Event'}
                                    </h3>
                                    {booking.category && (
                                      <Badge variant="secondary">{booking.category}</Badge>
                                    )}
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
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
                              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-900">Booking ID:</span>
                                    <div className="text-gray-600">{booking.ticketId || booking.id}</div>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">Booked on:</span>
                                    <div className="text-gray-600">
                                      {formatDateTime(booking.bookingDate)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">Total Amount:</span>
                                    <div className="text-lg font-bold text-primary">
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

                                {/* Keep cancel booking functionality */}
                                {booking.status === 'pending' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Cancel Booking
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
                        <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No bookings found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {activeTab === 'all' 
                            ? "You haven't made any bookings yet. Start exploring events!"
                            : `You don't have any ${activeTab} bookings.`
                          }
                        </p>
                        <Button onClick={() => window.location.href = '/'}>
                          Browse Events
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your events, users, and view analytics</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-3xl font-bold text-primary">{totalBookings}</p>
                      </div>
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Events</p>
                        <p className="text-3xl font-bold text-primary">{upcomingEvents}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">New booking confirmed</p>
                          <p className="text-sm text-gray-600">Tech Conference 2025 - John Doe</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Plus className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">New event created</p>
                          <p className="text-sm text-gray-600">AI & Cloud Tech Conference</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">5 hours ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium">New user registered</p>
                          <p className="text-sm text-gray-600">jane.smith@example.com</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Management Tab */}
            <TabsContent value="events">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Events Management
                  </CardTitle>
                  <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Event</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Event Title</Label>
                            <Input
                              id="title"
                              value={newEvent.title}
                              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                              placeholder="Enter event title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              value={newEvent.category}
                              onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                              placeholder="Enter category"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                            placeholder="Enter event description"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={newEvent.date}
                              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              type="time"
                              value={newEvent.time}
                              onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                            placeholder="Enter event location"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={newEvent.price}
                              onChange={(e) => setNewEvent({...newEvent, price: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="totalSeats">Total Seats</Label>
                            <Input
                              id="totalSeats"
                              type="number"
                              value={newEvent.totalSeats}
                              onChange={(e) => setNewEvent({...newEvent, totalSeats: e.target.value})}
                              placeholder="100"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="image">Image URL</Label>
                          <Input
                            id="image"
                            value={newEvent.image}
                            onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
                            placeholder="https://..."
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateEvent}>
                            Create Event
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Seats</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img 
                                src={event.image} 
                                alt={event.title}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium">{event.title}</p>
                                <p className="text-sm text-gray-600">{event.location}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{event.category}</Badge>
                          </TableCell>
                          <TableCell>${event.price}</TableCell>
                          <TableCell>{event.availableSeats}/{event.totalSeats}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users">
              <AdminUserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-lg text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default Dashboard;