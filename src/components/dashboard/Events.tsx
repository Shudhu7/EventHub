// src/components/dashboard/Events.tsx
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Ticket,
  Search
} from 'lucide-react';
import { events } from '@/data/events';

interface EventFilters {
  searchTerm: string;
  selectedCategory: string;
  dateFrom: string;
  dateTo: string;
  priceMin: string;
  priceMax: string;
  sortBy: 'title' | 'date' | 'price' | 'category' | 'seats';
  sortOrder: 'asc' | 'desc';
}

interface NewEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  totalSeats: string;
  category: string;
  image: string;
}

const Events: React.FC = () => {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const [newEvent, setNewEvent] = useState<NewEvent>({
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
  const [eventFilters, setEventFilters] = useState<EventFilters>({
    searchTerm: '',
    selectedCategory: 'All',
    dateFrom: '',
    dateTo: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'date',
    sortOrder: 'asc'
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
      toast({
        title: "Event Deleted",
        description: `${event?.title} has been deleted successfully.`,
      });
    }
  };

  return (
    <div className="min-h-[600px] w-full">
      <Card className="dark:bg-gray-800 dark:border-gray-700 w-full">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
            <CardTitle className="flex items-center dark:text-white">
              <Ticket className="mr-2 h-5 w-5" /> Event Management
            </CardTitle>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">Create New Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="eventTitle" className="dark:text-gray-200">Event Title</Label>
                    <Input 
                      id="eventTitle" 
                      value={newEvent.title} 
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
                      placeholder="e.g., Summer Music Fest" 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventDescription" className="dark:text-gray-200">Description</Label>
                    <Textarea 
                      id="eventDescription" 
                      value={newEvent.description} 
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} 
                      placeholder="Brief description of the event" 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventDate" className="dark:text-gray-200">Date</Label>
                      <Input 
                        id="eventDate" 
                        type="date" 
                        value={newEvent.date} 
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} 
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventTime" className="dark:text-gray-200">Time</Label>
                      <Input 
                        id="eventTime" 
                        type="time" 
                        value={newEvent.time} 
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} 
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="eventLocation" className="dark:text-gray-200">Location</Label>
                    <Input 
                      id="eventLocation" 
                      value={newEvent.location} 
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} 
                      placeholder="e.g., Central Park" 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventPrice" className="dark:text-gray-200">Price ($)</Label>
                      <Input 
                        id="eventPrice" 
                        type="number" 
                        value={newEvent.price} 
                        onChange={(e) => setNewEvent({...newEvent, price: e.target.value})} 
                        placeholder="e.g., 25.00" 
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventSeats" className="dark:text-gray-200">Total Seats</Label>
                      <Input 
                        id="eventSeats" 
                        type="number" 
                        value={newEvent.totalSeats} 
                        onChange={(e) => setNewEvent({...newEvent, totalSeats: e.target.value})} 
                        placeholder="e.g., 500" 
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="eventCategory" className="dark:text-gray-200">Category</Label>
                    <Input 
                      id="eventCategory" 
                      value={newEvent.category} 
                      onChange={(e) => setNewEvent({...newEvent, category: e.target.value})} 
                      placeholder="e.g., Concert, Workshop" 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventImage" className="dark:text-gray-200">Image URL</Label>
                    <Input 
                      id="eventImage" 
                      value={newEvent.image} 
                      onChange={(e) => setNewEvent({...newEvent, image: e.target.value})} 
                      placeholder="https://example.com/image.jpg" 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateModalOpen(false)} 
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
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
        <CardContent className="px-4 sm:px-6 pb-6">
          {/* Event Filters - Mobile Optimized */}
          <div className="space-y-4 mb-6 w-full">
            {/* Primary Search and Clear Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search events..."
                  value={eventFilters.searchTerm}
                  onChange={(e) => setEventFilters({...eventFilters, searchTerm: e.target.value})}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={clearEventFilters} 
                className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Clear All
              </Button>
            </div>

            {/* Date Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
                <Input
                  type="date"
                  value={eventFilters.dateFrom}
                  onChange={(e) => setEventFilters({...eventFilters, dateFrom: e.target.value})}
                  className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
                <Input
                  type="date"
                  value={eventFilters.dateTo}
                  onChange={(e) => setEventFilters({...eventFilters, dateTo: e.target.value})}
                  className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Category and Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={eventFilters.selectedCategory}
                  onChange={(e) => setEventFilters({...eventFilters, selectedCategory: e.target.value})}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {eventCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                <select
                  value={eventFilters.sortBy}
                  onChange={(e) => setEventFilters({...eventFilters, sortBy: e.target.value as 'title' | 'date' | 'price' | 'category' | 'seats'})}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="price">Sort by Price</option>
                  <option value="category">Sort by Category</option>
                  <option value="seats">Sort by Seats</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Min Price ($)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={eventFilters.priceMin}
                  onChange={(e) => setEventFilters({...eventFilters, priceMin: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Max Price ($)</label>
                <Input
                  type="number"
                  placeholder="999"
                  value={eventFilters.priceMax}
                  onChange={(e) => setEventFilters({...eventFilters, priceMax: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Showing {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''}
              </span>
              {(eventFilters.searchTerm || eventFilters.selectedCategory !== 'All' || eventFilters.dateFrom || eventFilters.dateTo || eventFilters.priceMin || eventFilters.priceMax) && (
                <Button variant="ghost" size="sm" onClick={clearEventFilters} className="w-full sm:w-auto dark:text-gray-300 dark:hover:bg-gray-700">
                  Clear all filters
                </Button>
              )}
            </div>
          </div>

          {/* Events Display - Table Format */}
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-300">Title</TableHead>
                  <TableHead className="dark:text-gray-300">Date</TableHead>
                  <TableHead className="hidden md:table-cell dark:text-gray-300">Location</TableHead>
                  <TableHead className="dark:text-gray-300">Price</TableHead>
                  <TableHead className="hidden lg:table-cell dark:text-gray-300">Seats</TableHead>
                  <TableHead className="dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-600 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <Ticket className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
                        <p className="text-lg font-medium mb-1">No events found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedEvents.map((event) => (
                    <TableRow key={event.id} className="dark:border-gray-700">
                      <TableCell className="font-medium dark:text-white">
                        <div className="max-w-48 truncate">{event.title}</div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        <div className="text-sm">{formatDate(event.date)}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell dark:text-gray-300">
                        <div className="max-w-32 truncate">{event.location}</div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">${event.price}</TableCell>
                      <TableCell className="hidden lg:table-cell dark:text-gray-300">
                        {event.availableSeats}/{event.totalSeats}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Dialog open={isEditModalOpen && editingEvent?.id === event.id} onOpenChange={(open) => {
                            if (!open) setEditingEvent(null);
                            setIsEditModalOpen(open);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event)} className="h-8 w-8 p-0 dark:text-gray-400 dark:hover:bg-gray-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="dark:bg-gray-800 dark:border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="dark:text-white">Edit Event</DialogTitle>
                              </DialogHeader>
                              {editingEvent && (
                                <div className="space-y-4 mt-4">
                                  <div>
                                    <Label htmlFor="editEventTitle" className="dark:text-gray-200">Event Title</Label>
                                    <Input 
                                      id="editEventTitle" 
                                      value={editingEvent.title} 
                                      onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} 
                                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editEventDescription" className="dark:text-gray-200">Description</Label>
                                    <Textarea 
                                      id="editEventDescription" 
                                      value={editingEvent.description} 
                                      onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} 
                                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="editEventDate" className="dark:text-gray-200">Date</Label>
                                      <Input 
                                        id="editEventDate" 
                                        type="date" 
                                        value={editingEvent.date} 
                                        onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})} 
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="editEventTime" className="dark:text-gray-200">Time</Label>
                                      <Input 
                                        id="editEventTime" 
                                        type="time" 
                                        value={editingEvent.time} 
                                        onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})} 
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="editEventLocation" className="dark:text-gray-200">Location</Label>
                                    <Input 
                                      id="editEventLocation" 
                                      value={editingEvent.location} 
                                      onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})} 
                                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="editEventPrice" className="dark:text-gray-200">Price ($)</Label>
                                      <Input 
                                        id="editEventPrice" 
                                        type="number" 
                                        value={editingEvent.price} 
                                        onChange={(e) => setEditingEvent({...editingEvent, price: e.target.value})} 
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="editEventTotalSeats" className="dark:text-gray-200">Total Seats</Label>
                                      <Input 
                                        id="editEventTotalSeats" 
                                        type="number" 
                                        value={editingEvent.totalSeats} 
                                        onChange={(e) => setEditingEvent({...editingEvent, totalSeats: e.target.value})} 
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="editEventCategory" className="dark:text-gray-200">Category</Label>
                                    <Input 
                                      id="editEventCategory" 
                                      value={editingEvent.category} 
                                      onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})} 
                                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editEventImage" className="dark:text-gray-200">Image URL</Label>
                                    <Input 
                                      id="editEventImage" 
                                      value={editingEvent.image} 
                                      onChange={(e) => setEditingEvent({...editingEvent, image: e.target.value})} 
                                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                    />
                                  </div>
                                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setIsEditModalOpen(false)} 
                                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
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
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:bg-gray-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="dark:text-gray-300">
                                  This action cannot be undone. This will permanently delete the
                                  event "{event.title}" and remove its data from our servers.
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;